<template>
  <el-container class="home-wrapper">
    <el-header>
      <div class="logo">
        <img src="~@/assets/heima.png" alt />
        <span>cc电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="!collapse ? '200px' : '64px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          unique-opened
          active-text-color="#409bef"
          :collapse="collapse"
          :collapse-transition="false"
          router
          :default-active="currentActive"
        >
          <el-submenu :index="String(index)" v-for="(item, index) in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsList[index]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- :index="`${String(index)}-${String(index2)}`" -->
            <el-menu-item :index="`/${item2.path}`" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getMenuList } from '@/network/home'
export default {
  data() {
    return {
      menuList: [],
      iconsList: [
        'iconfont icon-user',
        'iconfont icon-tijikongjian',
        'iconfont icon-shangpin',
        'iconfont icon-danju',
        'iconfont icon-baobiao'
      ],
      collapse: false,
      currentActive: ''
    }
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    toggleCollapse() {
      this.collapse = !this.collapse
    }
  },
  async created() {
    const { data: res } = await getMenuList()
    // console.log(res)
    if (res.meta.status !== 200)
      return this.messageEvent(res.meta.msg, 'error', 1500, true)
    this.menuList = res.data
    this.currentActive = this.$route.path
  }
}
</script>

<style lang='scss' scoped>
.home-wrapper {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  .logo {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border: none;
  }
  span {
    margin-left: 8px;
  }
  .toggle-button {
    background-color: #4a5064;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 10px;
    letter-spacing: 0.2em;
    height: 24px;
    cursor: pointer;
  }
}
.el-main {
  background-color: #eaedf1;
}
</style>