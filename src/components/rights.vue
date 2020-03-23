<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="authName"></el-table-column>
        <el-table-column label="路径" prop="path"></el-table-column>
        <el-table-column label="等级" prop="level">
          <template slot-scope="scope">
             <el-tag v-if="scope.row.level == 0">一级</el-tag>
             <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
             <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
import { getRightsList } from '@/network/rights.js'
export default {
  data() {
    return {
      rightsList: []
    }
  },
  created() {
    this._getRightsList('list')
  },
  methods: {
    async _getRightsList(type) {
      const {data:res} = await getRightsList(type)
      if (res.meta.status !== 200)
            return this.messageEvent(res.meta.msg, 'error')
          this.rightsList = res.data
          // console.log(this.rightsList)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>