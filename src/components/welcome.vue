<template>
  <div class="welcome">
    <el-card style="height: 100%">
      <h1>
        WELCOME!
      </h1>
      <h3>
        HELLO，{{user.toUpperCase()}}，欢迎来到VUE电商后台管理系统！
      </h3>
      <img src="~@/assets/welcome.jpg" alt width="950px" height="475px" />
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: ''
    }
  },
  created() {
    this.user = window.sessionStorage.getItem('user')
  }
}
</script>

<style lang="scss" scoped>
.welcome {
  height: 100%;
  background: #fff;
  position: relative;;
  h1, h3 {
    font-size: 60px;
    font-weight: normal;
    color: #eee;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  h3 {
    font-size: 30px;
    color: #717d93;
    white-space: nowrap;
    top: 13%;
  }
  img {
    margin-top: 144px;
  }
}
</style>