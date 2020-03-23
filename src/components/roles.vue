<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border>
        <!-- 展开 expand -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1)  in scope.row.children"
              :key="item1.id"
              :class="['border-bottom', index1===0?'border-top':'']"
              class="center"
            >
              <el-col :span="5">
                <el-tag>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                  class="center"
                  :class="index2 === 0 ? '' : 'border-top'"
                >
                  <el-col :span="6">
                    <el-tag type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="item3 in item2.children" :key="item3.id" type="warning" closable @close="tagCloseEvent">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="290px">
          <template>
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRolestsList } from '@/network/roles.js'
export default {
  data() {
    return {
      rolesList: []
    }
  },
  created() {
    this._getRolesList()
  },
  methods: {
    async _getRolesList() {
      const { data: res } = await getRolestsList()
      if (res.meta.status !== 200)
        return this.messageEvent(res.meta.msg, 'error')
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    async tagCloseEvent() {
     const confirmText = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(cancelText => {
        return cancelText
      })
      if (confirmText !== 'confirm') return this.messageEvent('已取消删除', 'info')
      console.log('确认删除')
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 6px;
}
.border-top {
  border-top: 1px solid red;
}
.border-bottom {
  border-bottom: 1px solid red;
}
.center {
  display: flex;
  align-items: center;
}
</style>