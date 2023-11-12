<template>
  <div>
    <header>
      <div class="user-info">
        <img class="avatar" src="../assets/img/profile_photo.png" alt="用户头像" width="40" height="40" />
        <span class="user-name">GLM对话</span>
      </div>
    </header>

    <nav>
      <div>
        <div class="logo">
          <img  class="avatar" src="../assets/img/GLM.png" alt="Logo" width="80" height="75" />
        </div>
        <div class="title">
          智能问答
        </div>
        <div class="button" @click="handleOpen('add')">
          + 新建对话
        </div>
        <div class="selectable-row" v-for="(message, index) in Object.keys(messages)" :key="index" @click="getData(message)">
          <div class="row-content" >
            <img src="@/assets/img/say.png" alt="image1" class="row-image" />
            <span class="row-text" >{{message}}</span>
            <img src="@/assets/img/edit.png" alt="image2" class="row-image row-image-right"  @click="handleOpen(message)"/>
            <el-popconfirm title="确认删除吗?" @confirm="delMsg(message)">
              <template #reference>
                <img src="@/assets/img/del.png" alt="image2" class="row-image row-image-right"/>
              </template>
            </el-popconfirm>
          </div>
        </div>

      </div>

    </nav>

    <main>
      <div class="container">
        <div class="count" id="message-container">
          <div v-for="(message, index) in messagesData" :key="index" class="message-container ">
            <img :src="message.avatar" :alt="message.alt" class="user-avatar">
            <div :class="message.bubbleClass">
              {{ message.content }}
            </div>
          </div>
        </div>
        <div class="input-container">
          <textarea class="input-box" placeholder="在此输入您想了解的内容，shift+Enter换行" v-model="countMsg" @keydown.enter.prevent="handleEnterKey"></textarea>
          <button class="send-button" @click="sendMessage">发送</button>
        </div>
      </div>
    </main>
  </div>
  <el-dialog
      v-model="dialogVisible"
      :title="say"
      width="30%"
      :before-close="handleClose"
  >
    <el-input
        v-model="title"
        maxlength="100"
        placeholder="请输入问题"
        show-word-limit
        type="textarea"
    />
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="addData">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script  lang="ts" setup>
import {nextTick, onMounted, ref} from "vue";
import {ElLoading, ElMessage} from 'element-plus'
import axios from  "axios"
const dialogVisible = ref(false)
const countMsg = ref('');
const title = ref('');
const oldTitle = ref('');
const say = ref('');
const userToken ={
  'access':localStorage.getItem('access'),
  'refresh':localStorage.getItem('refresh')
}
const headers = {
  'Content-Type': 'application/json', // 替换为实际的 Content-Type
  'Authorization': 'Bearer '+userToken.access, // 替换JWT
};
const messages = ref({
});
const messagesData = ref([]);
const handleClose = (done: () => void) => {
  done()
}
const handleOpen = (flag) => {
  if (flag==='add') {
    say.value='新建对话'
    title.value=''
    dialogVisible.value=true
  }else {
    oldTitle.value=flag
    say.value='编辑对话'
    title.value=flag
    dialogVisible.value=true
  }
}
const addData = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (say.value==='新建对话') {
    const newMessage = {
      avatar: "src/assets/img/user.png",
      alt: "User Avatar",
      bubbleClass: "user-bubble",
      content:title.value
    };
    if (messages.value.hasOwnProperty(title.value)) {
      messages.value[title.value].push(newMessage);
    } else {
      messages.value[title.value] = [newMessage];
    }
    const options = {
      url:'https://glmapi.gaozih.top/api/archive/create/',
      data:{body: title.value},
      method: 'post',
      headers : {
        'Authorization': 'Bearer '+userToken.access,
        'Content-Type' : 'application/json'
      }
    }
    axios(options).then(response => {
      // console.log('创建成功', response.data.res);
      const rotMessage = {
        avatar: "src/assets/img/rboot.png",
        alt: "User Avatar",
        bubbleClass: "user-bubble",
        content:response.data.res
      };
      loading.close()

      messages.value[title.value].push(rotMessage);
      console.log('创建成功', messages.value);
    }).catch(error => {
      console.error('创建失败', error);
    });
    // getData(title.value)
  }else {
    messages.value[title.value] = messages.value[oldTitle.value];
    delete messages.value[oldTitle.value];
  }

  ElMessage({
    message: '操作成功',
    type: 'success',
  })
  dialogVisible.value=false
}

const delMsg = (chatTitle) => {
  const chatId =messages.value[chatTitle].id;
  axios.delete(`https://glmapi.gaozih.top/api/archive/delete/${chatId}`,{headers})
      .then(response => {
        console.log('删除成功', response);
      })
      .catch(error => {
        console.error('删除失败', error);
      });
  delete messages.value[chatTitle];
}
function  handleEnterKey(event) {
  if (!event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
}
const getList = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
  }, 1500)
  // 发送请求
  axios.get('https://glmapi.gaozih.top/api/archive/list/',{headers})
      .then(response => {
        // 获取生成记录列表成功，处理返回的响应结果
        const chatList =document.getElementById('chatList');
        response.data.forEach(chat=>{
          const chatItem = {
            'chatId':'',
            'chatBody':''
          };
          chatItem.chatId = chat.id; // 用于记录 ID 属性
          chatItem.chatBody = chat.body;//用于记录Body属性
          const newMessage={
            avatar: "src/assets/img/user.png",
            alt: "User Avatar",
            bubbleClass: "user-bubble",
            content:chatItem.chatBody
          }
          if (messages.value.hasOwnProperty(title.value)) {
            messages.value[chatItem.chatBody].push(newMessage);
          } else {
            messages.value[chatItem.chatBody] = [newMessage];
          }
          messages.value[chatItem.chatBody].id =chatItem.chatId;
          axios.get('https://glmapi.gaozih.top/api/archive/detail/' + chatItem.chatId,{headers})
              .then(response => {
                // 获取生成记录列表成功，处理返回的响应结果
                const rotMessage={
                  avatar: "src/assets/img/rboot.png",
                  alt: "User Avatar",
                  bubbleClass: "user-bubble",
                  content:response.data.res
                }
                messages.value[chatItem.chatBody].push(rotMessage);
                console.log(response.data);
                // 进行其他操作
              })
              .catch(error => {
                // 获取生成记录列表失败，处理错误
                console.error(error);
                // 进行其他操作
              });

          console.log('创建成功', messages.value);
          console.log(chatItem);

        })
        console.log(response.data);
        // 进行其他操作
      })
      .catch(error => {
        // 获取生成记录列表失败，处理错误
        console.error(error);
        // 进行其他操作
      });


}
const getData = (data) => {
  messagesData.value = messages.value[data]
  // axios.get('https://glmapi.gaozih.top/api/archive/detail/' + data,{headers})
  //     .then(response => {
  //       // 获取生成记录列表成功，处理返回的响应结果
  //       console.log(response.data);
  //       // 进行其他操作
  //     })
  //     .catch(error => {
  //       // 获取生成记录列表失败，处理错误
  //       console.error(error);
  //       // 进行其他操作
  //     });
}
const sendMessage = () =>  {
  const loading = ElLoading.service({
    lock: true,
    text: '拼命加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  setTimeout(() => {
    loading.close()
  }, 1500)
  messagesData.value.push({
    avatar: "src/assets/img/user.png",
    alt: "User Avatar",
    bubbleClass: "user-bubble",
    content: countMsg.value
  });
  countMsg.value = ''; // 清空输入框
  nextTick(()=>{
    scrollToBottom();
  })
}

const getUserInfo = () => {
// 发送请求
  axios.get('https://glmapi.gaozih.top/api/user/info/',{headers})
      .then(response => {
        // 获取用户信息成功，处理返回的响应结果
        console.log(response.data);
        // 进行其他操作
      })
      .catch(error => {
        // 获取用户信息失败，处理错误
        console.error(error);
        // 进行其他操作
      });
}
onMounted(()=>{
  getUserInfo()
  getList()
  let access = localStorage.getItem('access')
  let refresh = localStorage.getItem('refresh')
  console.log('INdex.VUe----->取值access：',access)
  console.log('INdex.VUe----->取值refresh：',refresh)
})
function scrollToBottom() {
  const messageContainer = document.querySelector('#message-container');
  messageContainer.scrollTop = messageContainer.scrollHeight;
}
</script>
<style scoped>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
header {
  background-color: #ffffff;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #ccc;
}
nav {
  background-color: #414141;
  color: #ffffff;
  width: 200px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
}
.avatar {
  border-radius: 50%; /* 实现圆形头像 */
}
.user-info {
  display: flex;
  align-items: center;
}
.user-name {
  margin-left: 10px;
  font-weight: bold;
}
nav {
  background-color: rgba(52, 56, 68);
  color: #ffffff;
  width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.logo {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.title {
  text-align: center;
  font-weight: bold;
  margin-bottom: 10px;
}

.button {
  background-color: #36c3ff;
  color: #ffffff;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  font-weight: bolder;
  cursor: pointer;
}

.selectable-row {
  cursor: pointer;
  transition: background-color 0.3s;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
}

.selectable-row:hover {
  background-color: rgba(98, 96, 109);
}
.row-image {
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
  width: 18px;
}
.row-image-right {
  margin-left: auto;
  margin-right: 0;
}
main {
  display: flex;
  justify-content: center;
  background: rgba(240, 240, 240);
  margin-left: 220px;
  padding: 20px;
  min-height: calc(100vh - 110px);
}
.container {
  width: 850px;
}
.message-container {
  display: flex;
  margin-bottom: 20px;
}
.robot-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
.robot-bubble {
  background-color: rgba(249, 249, 249);
  padding: 10px;
  border-radius: 10px;
  width: 780px;
  word-wrap: break-word;
}
.user-bubble {
  background-color: rgba(226, 226, 226);
  padding: 10px;
  border-radius: 10px;
  width: 780px;
  word-wrap: break-word;
}
.user-bubble {
  margin-left: 0;
}
.input-container {
  display: flex;
  align-items: flex-end;
  margin-top: 20px;
  position: relative;
  justify-content: end;
}
.send-button {
  position: absolute;
  bottom: 5px;
  right: 5px;
  background-color: #00aaff;
  color: #fff;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
}
.input-box {
  width: 790px;
  height: 100px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  resize: none;
  font-size: 14px;
  font-family: Arial, sans-serif;
  outline: 2px solid #ecf9ff;
}
.count {
  max-height: 600px;
  overflow-y: auto;
}
/* 滚动条整体样式 */
.count::-webkit-scrollbar {
  width: 8px;
  background-color: #f5f5f5;
}

/* 滚动条滑块样式 */
.count::-webkit-scrollbar-thumb {
  background-color: #dadada;
  border-radius: 4px;
}

/* 滚动条滑块悬停样式 */
.count::-webkit-scrollbar-thumb:hover {
  background-color: #dcdcdc;
}

.row-content {
  display: flex;
  align-items: center;
  max-width: 300px; /* 限制文字部分的最大宽度为200px */
  white-space: nowrap; /* 防止文字换行 */
  overflow: hidden; /* 隐藏溢出的文字 */
  text-overflow: ellipsis; /* 显示省略号 (...) 来表示被截断的文本 */
}

.row-text {
  flex: 1; /* 文字部分占据剩余的空间 */
  text-overflow: ellipsis; /* 显示省略号 (...) 来表示被截断的文本 */
  overflow: hidden; /* 隐藏溢出的文字 */
}

</style>