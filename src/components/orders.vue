<template>
  <div>
    <c-header text1='订单管理' text2='订单列表'></c-header>

    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            clearable
            @clear="clearEvent"
            @keyup.native.enter="searchOrder"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        queryInfo: {
          query: ''
        }
      }
    },
    created(){},
    methods: {
      clearEvent() {},
      searchOrder() {}
    }
  }
</script>

<style lang="scss" scoped>
  
</style>