<template>
  <div>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb> -->
  <c-header text1='权限管理' text2='角色列表'></c-header>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addRoleBtn">添加角色</el-button>
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
                <el-tag closable @close="removeRoleRight(scope.row, item1.id)">{{item1.authName}}</el-tag>
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
                    <el-tag
                      type="success"
                      closable
                      @close="removeRoleRight(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRoleRight(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
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
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleBtn(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRoleBtn(scope.row)">删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="setRoleRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限dialog -->
    <el-dialog title="分配权限" :visible.sync="roleRightDialogVisible" @close="restKeys">
      <div>
        <el-tree
          :data="rightsTree"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :default-checked-keys="defaultCheckedKeys"
          ref="rightsTreeRef"
        ></el-tree>
      </div>
      <span slot="footer">
        <el-button @click="roleRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleRights">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加角色dialog -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialogVisible" @close='addDialogClose'>
      <div>
        <el-form :model="addRoleForm" :rules="addRoleFormRules" ref='addRoleFormRef' label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addRoleForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model="addRoleForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddRole">确 定</el-button>
      </span>
    </el-dialog >

    <!--编辑角色dialog -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" @close='$refs.editRoleFormRef.resetFields()'>
      <div>
        <el-form :model="editRole" :rules="addRoleFormRules" ref='editRoleFormRef' label-width="80px">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model.trim="editRole.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input v-model.trim="editRole.roleDesc"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRolestsList,
  deleteRoleRightById,
  getRightsTree,
  setRoleRightsByRoleId,
  addRole,
  editROleById,
  deleteRoleById
} from '@/network/roles.js'
export default {
  data() {
    return {
      rolesList: [],
      roleRightDialogVisible: false,
      rightsTree: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defaultCheckedKeys: [],
      roleId: '',
      addRoleDialogVisible: false,
      addRoleForm:{
        roleName: '',
        roleDesc: ''
      },
      addRoleFormRules: {
        roleName: [
          {required: true, message: '请输入角色名称', trigger: 'blur'},
          {min:2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ]
      },
      editRole: {},
      editRoleDialogVisible: false
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
    async removeRoleRight(role, rightId) {
      console.log(role.children)
      console.log(role.id, rightId)
      const confirmText = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(cancelText => {
        return cancelText
      })
      if (confirmText !== 'confirm')
        return this.messageEvent('已取消删除', 'info')
      const { data: res } = await deleteRoleRightById(role.id, rightId)
      // console.log(res)
      if (res.meta.status !== 200)
        return this.messageEvent(res.meta.msg, 'error')
      this.messageEvent(res.meta.msg)
      // console.log(res.data)
      role.children = res.data
      // role = res.data
      // this._getRolesList()
    },
    // expandChange(row, expandedRows) {
    //   console.log('expand')
    //   console.log(row, expandedRows)
    // }
    getChecksId(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(child => {
        this.getChecksId(child, arr)
      })
    },
    async setRoleRightDialog(role) {
      // console.log(role)
      this.roleId = role.id
      // console.log(this.roleId)
      const { data: res } = await getRightsTree()
      // console.log(res)
      if (res.meta.status !== 200)
        return this.messageEvent(res.meta.msg, 'error')
      this.rightsTree = res.data
      this.getChecksId(role, this.defaultCheckedKeys)
      // console.log(this.defaultCheckedKeys)
      this.roleRightDialogVisible = true
    },
    restKeys() {
      //重置
      this.defaultCheckedKeys = []
    },
    async setRoleRights() {
      // console.log(this.$refs.rightsTreeRef.getCheckedKeys(true))
      // console.log(this.$refs.rightsTreeRef.getHalfCheckedNodes())
      const checkedKeys = this.$refs.rightsTreeRef.getCheckedKeys()
      const halfCheckedNodes = this.$refs.rightsTreeRef.getHalfCheckedNodes()
      halfCheckedNodes.forEach(node => {
        checkedKeys.push(node.id)
      })
      // console.log(checkedKeys)
      const rids = checkedKeys.join(',')
      const { data: res } = await setRoleRightsByRoleId(this.roleId, rids)
      if (res.meta.status !== 200)
        return this.messageEvent(res.meta.msg, 'error')
      this.messageEvent(res.meta.msg)
      this._getRolesList()
      this.roleRightDialogVisible = false
    },
    addRoleBtn() {
      this.addRoleDialogVisible = true
    },
    addDialogClose() {
      this.$refs.addRoleFormRef.resetFields()
      this.addRoleForm = {}
    },
    submitAddRole() {
      this.$refs['addRoleFormRef'].validate(async valid => {
        if(!valid) return false
        const { data: res } = await addRole(this.addRoleForm.roleName, this.addRoleForm.roleDesc)
        console.log(res)
        if (res.meta.status !== 201)
        return this.messageEvent(res.meta.msg, 'error')
        this.messageEvent(res.meta.msg)
        this._getRolesList()
        this.addRoleDialogVisible = false
      })
    },
    async editRoleBtn(role) {
      // console.log(role)
      this.editRole = JSON.parse(JSON.stringify(role))
      this.editRoleDialogVisible = true
    },
    submitEditRole() {
      this.$refs['editRoleFormRef'].validate(async valid => {
        if(!valid) return false
        const { data: res } = await editROleById(this.editRole.id, this.editRole.roleName, this.editRole.roleDesc)
        // console.log(res)
        if (res.meta.status !== 200)
        return this.messageEvent(res.meta.msg, 'error')
        this.messageEvent('更新成功')
        this._getRolesList()
        this.editRoleDialogVisible = false
      })
    },
    async deleteRoleBtn(role) {
      const resultText = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(resultText)
      if(resultText !== 'confirm') {
        return this.messageEvent('取消删除', 'info')
      }
      const {data: res} = await deleteRoleById(role.id)
      if (res.meta.status !== 200)
        return this.messageEvent(res.meta.msg, 'error')
        this.messageEvent('删除成功')
        this._getRolesList()
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 6px;
}
.border-top {
  border-top: 1px solid #eee;
}
.border-bottom {
  border-bottom: 1px solid #eee;
}
.center {
  display: flex;
  align-items: center;
}
</style>