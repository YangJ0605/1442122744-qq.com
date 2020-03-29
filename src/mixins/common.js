export default {
  methods: {
    messageEvent(message, type = 'success', duration = 1500, center = true){
      console.log('commonmix')
      this.$message({
        message,
        type,
        duration,
        center
      });
    },
    handleError(res) {
      this.messageEvent(res.meta.msg, 'error')
    }
  }
}