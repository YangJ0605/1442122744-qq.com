<template>
  <div class="login-wrapper">
    <div class="login-box">
      <div class="avatar-box">
        <img src="~@/assets/logo.png" alt />
      </div>
      <!-- ele from -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login-form"
        :model="loginFrom"
        :rules="loginRules"
      >
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model.trim="loginFrom.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginFrom.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row :gutter="20">
            <el-col :span='14'>
              <el-input
            v-model="loginFrom.code"
            maxlength=6
          ></el-input>
            </el-col>
            <el-col :span="10">
              <el-input :value="`验证码为：${randomCode}`" disabled></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="restLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { login } from '@/network/login.js'
export default {
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      loginFrom: {
        username: 'res',
        password: '1442122744',
        code: ''
      },
      loginRules: {
        username: [{ validator: validateUsername, trigger: 'blur' }],
        password: [{ validator: validatePass, trigger: 'blur' }],
        code: [{required: true, message: '请输入验证码', trigger: 'blur'},
          {min: 6, max: 6, message: '请输入6位验证码', trigger: 'blur'}
        ]
      },
      randomCode: ''
    }
  },
  created(){
    this.randomCode = String(parseInt(Math.random() * 1000000)).padEnd(6, '0')
  },
  methods: {
    restLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        // console.log('登录')
        // console.log(this.loginFrom.code, this.randomCode)
        if(this.loginFrom.code !== this.randomCode) {
          this.randomCode = String(parseInt(Math.random() * 1000000)).padEnd(6, '0')
          return this.messageEvent('验证码有误，请重新输入', 'error')
        }
        const { data: res } = await login(this.loginFrom)
        // console.log(res)
        if (res.meta.status !== 200)
          return this.messageEvent(res.meta.msg, 'error', 1500, true)
        // console.log('chneggong')
        // console.log(this)
        this.messageEvent(res.meta.msg, 'success', 1500, true)
        window.sessionStorage.setItem('token', res.data.token)
        window.sessionStorage.setItem('user', this.loginFrom.username)
        const path = this.$route.query.redirect
        path ? this.$router.push(path) : this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.login-wrapper {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  background-color: #fff;
  width: 450px;
  height: 350px;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .avatar-box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .login-form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
}
</style>