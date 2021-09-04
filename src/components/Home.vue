<template>
  <div>
       <el-button type="info" @click="loginout">退出</el-button>
  </div>
</template>

<script>
export default {
methods:{
    loginout(){
        // 销毁本地token
        window.sessionStorage.clear()
         // 跳转到登录页
        this.$router.push('/login')
    }
}
}
</script>

<style>

</style>