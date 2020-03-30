<template>
  <div>
    <h3>
      HELLO，{{user}}，欢迎来到Vue电商后台管理系统～～
    </h3>
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

</style>