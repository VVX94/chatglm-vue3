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
    axios.post('https://glmapi.gaozih.top/api/user/token/refresh/', requestBody)
        .then(response => {
          console.log('令牌刷新成功', response);
          // requestBody.refresh=response.data.refresh;
          localStorage.setItem('refresh',response.data.access);
          localStorage.setItem('access',response.data.access);
        })
        .catch(error => {
          console.error('令牌刷新失败', error);
        });
  },  1*60*1000);   //1分钟
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
