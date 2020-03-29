<template>
  <div>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
  <c-header text1='用户管理' text2='用户列表'></c-header>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            clearable
            @clear="clearEvent"
            @keyup.native.enter="searchUser"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchUser"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="usersList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column label="状态" width="180">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="toggleState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editDialogBtn(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUserBtn(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSettingDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加用户" :visible.sync="addDialogVisible" @close="addDialogClose">
      <el-form :model="addUserForm" :rules="addUserRules" label-width="80px" ref="addUserFromRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model.trim="addUserForm.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model.trim="addUserForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="addUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model.trim="addUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item label="角色" prop="role">
          <el-input v-model.trim="addUserForm.role" autocomplete="off"></el-input>
        </el-form-item>-->
        <!-- <el-form-item label="状态">
          <el-switch v-model="addUserForm.mg_state"></el-switch>
        </el-form-item>-->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelBtn">取 消</el-button>
        <el-button type="primary" @click="submitUserFrom">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑用户"
      :visible.sync="editDialogVisible"
      @close="$refs.editUserFromRef.resetFields()"
    >
      <el-form :model="editUserForm" :rules="addUserRules" label-width="80px" ref="editUserFromRef">
        <el-form-item label="用户名">
          <el-input v-model.trim="editUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model.trim="editUserForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model.trim="editUserForm.mobile" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="分配角色" :visible.sync="settingDialogVisible" @close='roleSelectedId = ""'>
      <el-form label-width="100px" :model="settingUserForm">
        <el-form-item label='当前用户：'>
          <el-input v-model="settingUserForm.username" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label='当前角色：'>
          <el-input v-model="settingUserForm.role_name" autocomplete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="分配新角色：">
          <el-select v-model="roleSelectedId">
            <el-option v-for="item in roleSelectedOptions" :key="item.id" :value="item.id" :label="item.roleName">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="settingDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUserRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUsers,
  changeUserState,
  addUser,
  getUserById,
  editUser,
  deleteUserById,
  getRoles,
  setUserRoleById
} from '@/network/users.js'
import { validateEmail, validateMobile } from '@/utils/utils.js'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      usersList: [],
      total: 0,
      isClear: false,
      addDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '用户名的长度在 2 到 8 个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 15,
            message: '密码长度在 6 到 15 个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' },
          { required: true }
        ],
        mobile: [
          { validator: validateMobile, trigger: 'blur' },
          { required: true }
        ]
        // role: [{ required: true, message: '请输入角色名', trigger: 'blur' }]
      },
      editDialogVisible: false,
      editUserForm: {},
      settingDialogVisible: false,
      settingUserForm: {
        username: '',
        role_name: ''
      },
      roleSelectedId: '',
      roleSelectedOptions: []
    }
  },
  computed: {},
  created() {
    this._getUsers()
  },
  watch: {
    'queryInfo.query': function(newVal) {
      if (newVal === '' && !this.isClear) {
        console.log('watch')
        this._getUsers()
      }
    }
  },
  methods: {
    async _getUsers() {
      const { data: res } = await getUsers({ params: this.queryInfo })
      console.log(res)
      if (res.meta.status !== 200)
        return this.messageEvent(res.meta.msg, 'error', 1500, true)
      this.usersList = res.data.users
      this.total = res.data.total
      this.pagenum = res.data.pagenum
      this.isClear = false
    },
    handleSizeChange(size) {
      // console.log(size)
      this.queryInfo.pagesize = size
      this._getUsers()
    },
    handleCurrentChange(currentPage) {
      // console.log(currentPage)
      this.queryInfo.pagenum = currentPage
      this._getUsers()
    },
    async toggleState(userinfo) {
      // console.log(userinfo)
      const { data: res } = await changeUserState(userinfo)
      // console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.messageEvent(res.meta.msg, 'error', 1500, true)
      }
      this.messageEvent(res.meta.msg, 'success', 1500, true)
    },
    searchUser() {
      this._getUsers()
    },
    clearEvent() {
      this.isClear = true
      this._getUsers()
    },
    cancelBtn() {
      this.addDialogVisible = false
    },
    addDialogClose() {
      // console.log('close')
      this.$refs.addUserFromRef.resetFields()
    },
    submitUserFrom() {
      this.$refs['addUserFromRef'].validate(async valid => {
        if (valid) {
          // alert('submit!')
          const { data: res } = await addUser(this.addUserForm)
          // console.log(res)
          if (res.meta.status !== 201)
            return this.handleError(res)
          this.messageEvent(res.meta.msg, 'success', 1500, true)
          this.addDialogVisible = false
          this._getUsers()
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    async editDialogBtn(id) {
      // console.log('edit')
      // console.log(id)
      const { data: res } = await getUserById(id)
      // console.log(res)
      if (res.meta.status !== 200)
        return this.messageEvent('获取用户失败', 'error', 1500, true)
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    editSubmit() {
      this.$refs['editUserFromRef'].validate(async valid => {
        if (valid) {
          const { data: res } = await editUser(
            this.editUserForm.id,
            this.editUserForm
          )
          if (res.meta.status !== 200)
            return this.messageEvent('更新用户失败', 'error', 1500, true)
          this.editDialogVisible = false
          this._getUsers()
          this.messageEvent(res.meta.msg)
        } else {
          return false
        }
      })
    },
    deleteUserBtn(id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then( async () => {
          const {data: res} = await deleteUserById(id)
          console.log(res)
          if (res.meta.status !== 200)
            return this.messageEvent(res.meta.msg, 'error')
          this.messageEvent(res.meta.msg)
          this._getUsers()
        })
        .catch(() => {
          this.messageEvent('已取消删除', 'info')
        })
    },
    async showSettingDialog(user) {
      // console.log(user)
      this.settingUserForm = user
      const {data:res} = await getRoles()
      if (res.meta.status !== 200)
            return this.messageEvent('获取角色列表失败', 'error')
      this.roleSelectedOptions = res.data
      this.settingDialogVisible = true
    },
    async saveUserRole() {
      // console.log(this.roleSelectedId)
      // console.log(this.settingUserForm.id)
      if(this.roleSelectedId === '') return this.messageEvent('请选择角色', 'error')
      const {data:res} = await setUserRoleById(this.settingUserForm.id, this.roleSelectedId)
      if (res.meta.status !== 200)
            return this.messageEvent(res.meta.msg, 'error')
      this._getUsers()
      this.settingDialogVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>

</style>