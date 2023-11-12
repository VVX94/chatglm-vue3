<template>
  <div class="cont">
    <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        class="login-form"
        status-icon>
      <h3 class="title">👉 登录 👈</h3>
      <el-form-item  prop="username">
        <el-input class="input-with-select" v-model="ruleForm.username" placeholder="用户名" clearable>
          <template #prefix>
            <el-icon><User /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item  prop="password">
        <el-input
            type="password"
            clearable
            placeholder="密码"
            v-model="ruleForm.password"
            class="input-with-select">
          <template #prefix>
            <el-icon><Lock /></el-icon>
          </template>
        </el-input>
      </el-form-item>
      <router-link to='/reg' style="  text-decoration: none;padding: 10px;color:#4e89ff;font-size: 15px">
        没有账号，快去注册
      </router-link>

      <el-form-item style="margin-top: 10px">
        <el-button :loading="load" type="primary" @click="submitForm(ruleFormRef)" style="width: 100%">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import type {FormInstance, FormRules} from 'element-plus'
import { useRouter } from 'vue-router'
import axios from  "axios"
import {ElLoading, ElMessage} from "element-plus";

const router = useRouter();

const ruleFormRef = ref<FormInstance>()


//按钮等待加载
const load = ref(false);
//验证码图片
const image = ref('');
//表单属性值
const ruleForm = reactive({
  username:'',
  password:'',
})


//校验规则
const rules = reactive<FormRules>({
  username: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '密码不能为空', trigger: 'blur' },
  ],
})

//表单提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const loading = ElLoading.service({
        lock: true,
        text: '拼命加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      setTimeout(() => {
        loading.close()
      }, 1500)
      load.value = true
        const options = {
          url:'http://127.0.0.1:8000/api/user/token/get/',
          data:{username:ruleForm.username,password:ruleForm.password},
          method: 'post',
          headers: {'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'}
        }
        axios(options).then(r => {
          localStorage.setItem('access',r.data.access)
          localStorage.setItem('refresh',r.data.refresh)
          ElMessage({
            message:'登录成功！',
            type:'success'
          })
          router.push("index")

        })
            .catch(error=>{
              console.error(error);
              ElMessage({
                message:'账号密码错误！',
                type:'warning'
              })
            })
    } else {
      console.log('error submit!')

      return false
    }
  })
}


</script>

<style scoped>
.cont{
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(../assets/img/login_bg.jpg);

  background-repeat: no-repeat;
  overflow: hidden;
  background-size: cover;
}
.login-form{
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.43);
  width: 300px;
  padding: 25px 25px 5px 25px;
  margin-bottom: 100px;
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #707070;
}
.login-code {
  display: flex;
}

.login-code>img{
  height: 35px;
  margin-left: 10px;
  cursor: pointer;
}
</style>