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
          智能绘画
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
            <div v-if ="message.avatar==='src/assets/img/user.png'">
            <img src="data:image/png;base64,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" alt="User" class="user-avatar">
            <div  :class="message.bubbleClass">
              {{ message.content }}
            </div>
            </div>
            <div v-else-if ="message.avatar==='src/assets/img/rboot.png'">
              <img src="data:image/png;base64,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" alt="Robot" class="robot-avatar">
              <div :class="message.bubbleClass" >
                <img :src="message.content" alt="图片" style="max-height: 500px;max-width: 750px">
              </div>
            </div>
          </div>
        </div>
<!--        <div class="input-container">-->
<!--          <textarea class="input-box" placeholder="在此输入您想了解的内容，shift+Enter换行" v-model="countMsg" @keydown.enter.prevent="handleEnterKey"></textarea>-->
<!--          <button class="send-button" @click="sendMessage">发送</button>-->
<!--        </div>-->
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
// import {Base64} from "js-base64";
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
      content:title.value,
      type:'text'
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
        // content:response.data.res,
        content:response.data.res,
        type:'image',
      };
      rotMessage.content='data:image/jpg;base64, '+response.data.res
      if(response.data.res.indexOf('data:')!=-1 && response.data.res.indexOf('base64')!=-1 ){
        rotMessage.type='image';
        // console.log('base64检测已执行')
      }
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
        // console.log('删除成功', response);
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
            content:chatItem.chatBody,
            type:'text'
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
                  content:response.data.res,
                  type:'image'
                }
                rotMessage.content='data:image/jpg;base64, '+response.data.res
                if(response.data.res.indexOf('data:')!=-1 && response.data.res.indexOf('base64')!=-1 ){
                  rotMessage.type='image';
                  // console.log('base64检测已执行')
                }
                messages.value[chatItem.chatBody].push(rotMessage);
                // console.log(response.data);
                // 进行其他操作
              })
              .catch(error => {
                // 获取生成记录列表失败，处理错误
                console.error(error);
                // 进行其他操作
              });

          // console.log('创建成功', messages.value);
          // console.log(chatItem);

        })
        // console.log(response.data);
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
  // messagesData.value.push({
  //   avatar: "src/assets/img/user.png",
  //   alt: "User Avatar",
  //   bubbleClass: "user-bubble",
  //   content: countMsg.value,
  //   type:'text'
  // });
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
        // console.log(response.data);
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
  // console.log('INdex.VUe----->取值access：',access)
  // console.log('INdex.VUe----->取值refresh：',refresh)
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