<template>
  <div>
    <c-header text1="商品管理" text2="参数列表"></c-header>
    <el-card>
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon :closable="false"></el-alert>
      <el-row class="el-row">
        <span>选择商品分类</span>
        <el-cascader
          :props="cascaderOptions"
          :options="cateList"
          v-model="cascaderSelectArr"
          @change="handleChange"
          style="width:300px"
        ></el-cascader>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="btnDisable" @click="addParamsBtn">添加参数</el-button>
          <el-table :data="manyData" border stripe>
            <el-table-column type="expand">
              <template></template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamsBtn(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsBtn(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="btnDisable" @click="addParamsBtn">添加属性</el-button>
          <el-table :data="onlyData" border stripe>
            <el-table-column type="expand">
              <template></template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editParamsBtn(scope.row)"
                >编辑</el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParamsBtn(scope.row)"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <el-dialog
      :title="`添加${titleDialog}`"
      :visible.sync="addParamsDialogVisible"
      @close="handleAddParamsDialogClose"
    >
      <el-form
        :model="addParamsForm"
        :rules="paramsRules"
        ref="addParamsFormRef"
        label-width="80px"
      >
        <el-form-item :label="titleDialog" prop="name">
          <el-input v-model="addParamsForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCategories, getParamsList, addParam } from '@/network/params.js'
export default {
  data() {
    return {
      cateList: [],
      cascaderOptions: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        // checkStrictly: true,
        expandTrigger: 'hover'
      },
      cascaderSelectArr: [],
      activeName: 'many',
      manyData: [],
      onlyData: [],
      addParamsDialogVisible: false,
      addParamsForm: {
        name: ''
      },
      paramsRules: {
        name: [
          {
            required: true,
            message: `${this.activeName === 'many' ? '动态参数' : '静态属性'}不能为空`,
            trigger: 'blur'
          },
          { min: 2, max: 6, message: '长度在 2 到 6 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this._getcategories()
  },
  computed: {
    btnDisable() {
      if (this.cascaderSelectArr.length !== 3) {
        return true
      }
      return false
    },
    cateId() {
      if (this.cascaderSelectArr.length === 3) {
        return this.cascaderSelectArr[2]
      }
      return null
    },
    titleDialog() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    async _getcategories() {
      const { data: res } = await getCategories()
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.cateList = res.data
    },
    handleChange() {
      // console.log(this.cascaderSelectArr)
      if (this.cascaderSelectArr.length !== 3) {
        this.cascaderSelectArr = []
        return
      }
      this._getParamsList()
    },
    handleTabClick() {
      if(this.cascaderSelectArr.length === 3) {
        this._getParamsList()
      }
    },
    async _getParamsList() {
      const { data: res } = await getParamsList(this.cateId, this.activeName)
      // console.log(this.cateId)
      // console.log(this.cascaderSelectArr)
      //  console.log(res)
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      if (this.activeName === 'many') {
        this.manyData = res.data
      } else {
        this.onlyData = res.data
      }
    },
    handleAddParamsDialogClose() {
      this.$refs.addParamsFormRef.resetFields()
    },
    addParamsBtn() {
      console.log('add')
      this.addParamsDialogVisible = true
    },
    editParamsBtn(params) {
      console.log(params)
    },
    deleteParamsBtn(params) {
      console.log(params)
    },
    submitAddParams() {
       this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const params = {
          attr_name: this.addParamsForm.name,
          attr_sel: this.activeName,
        }
        const { data: res } = await addParam(this.cateId, params)
        if (res.meta.status !== 201) {
          return this.handleError(res)
        }
        this.messageEvent(`添加${this.titleDialog}成功`)
        this._getParamsList()
        this.addParamsDialogVisible = false
        // console.log(res)
       })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin: 14px 0;
  span {
    margin-right: 8px;
  }
}
</style>