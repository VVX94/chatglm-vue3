<template>
  <router-view></router-view>
</template>
<script lang="ts" setup>
import {onMounted} from "vue";
import axios from  "axios"
const dateTimer = () => {
  setInterval(() => {
    const refreshToken = localStorage.getItem('refresh');
    const requestBody = {
      refresh: refreshToken,
    };
    axios.post('http://127.0.0.1:8000/api/user/token/refresh/', requestBody)
        .then(response => {
          console.log('令牌刷新成功', response);
          // requestBody.refresh=response.data.refresh;
          localStorage.setItem('refresh',response.data.access);
          localStorage.setItem('access',response.data.access);
        })
        .catch(error => {
          console.error('令牌刷新失败', error);
        });
  },  60*1000);   //3分钟
}
onMounted(()=>{
  dateTimer()
})
</script>

<style>
.el-message {
  top: 20px !important;
}
.el-message:not(:last-child) {
  visibility: hidden;
}
</style>
