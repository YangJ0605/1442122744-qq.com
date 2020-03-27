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
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="tag"
                  @close='handleTagClose(index, scope.row)'
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ 新标签</el-button>
              </template>
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
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  class="tag"
                  @close='handleTagClose(index, scope.row)'
                >{{item}}</el-tag>
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                >+ 新标签</el-button>
              </template>
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

    <el-dialog
      :title="`编辑${titleDialog}`"
      :visible.sync="editParamsDialogVisible"
      @close="$refs.editParamsFormRef.resetFields()"
    >
      <el-form
        :model="editParamsForm"
        :rules="paramsRules"
        ref="editParamsFormRef"
        label-width="80px"
      >
        <el-form-item :label="titleDialog" prop="name">
          <el-input v-model="editParamsForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editParamsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submiteditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {mixinCascader} from '@/mixins/mixin.js'
import {
  getParamsList,
  addParam,
  editParam,
  deleteParam
} from '@/network/params.js'
export default {
  mixins: [mixinCascader],
  data() {
    return {
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
            message: `${
              this.activeName === 'many' ? '动态参数' : '静态属性'
            }不能为空`,
            trigger: 'blur'
          },
          { min: 2, max: 12, message: '长度在 2 到 12 个字符', trigger: 'blur' }
        ]
      },
      editParamsDialogVisible: false,
      editParamsForm: {
        name: ''
      },
      editAttrId: '',
      // isshowPoper: true
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
    titleDialog() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  },
  methods: {
    handleChange() {
      // console.log(this.cascaderSelectArr)
      if (this.cascaderSelectArr.length !== 3) {
        this.cascaderSelectArr = []
        this.onlyData = []
        this.manyData = []
        return
      }
      this._getParamsList()
    },
    handleTabClick() {
      if (this.cascaderSelectArr.length === 3) {
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
      // console.log(res)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      // console.log(res)
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
    submitAddParams() {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const params = {
          attr_name: this.addParamsForm.name,
          attr_sel: this.activeName
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
    },
    editParamsBtn(params) {
      this.editParamsForm.name = params.attr_name
      // console.log(params)
      // console.log(this.cateId, params.cat_id)
      this.editAttrId = params.attr_id
      this.editParamsDialogVisible = true
    },
    submiteditParams() {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return false
        const data = {
          attr_name: this.editParamsForm.name,
          attr_sel: this.activeName
        }
        const { data: res } = await editParam(
          this.cateId,
          this.editAttrId,
          data
        )
        if (res.meta.status !== 200) {
          return this.handleError(res)
        }
        this._getParamsList()
        this.messageEvent(res.meta.msg)
        this.editParamsDialogVisible = false
      })
    },
    async deleteParamsBtn(params) {
      const restext = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(r => r)
      if (restext !== 'confirm') {
        return this.messageEvent('取消删除', 'info')
      }
      const { data: res } = await deleteParam(params.cat_id, params.attr_id)
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.messageEvent('删除成功')
      this._getParamsList()
    },
    handleInputConfirm(row) {
      if (!row.inputValue.trim()) {
        row.inputVisible = false
        row.inputValue = ''
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      // console.log(row)
      this.saveChange(row)
      row.inputVisible = false
      row.inputValue = ''
    },
    async saveChange(row) {
      const data = {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      }
      const { data: res } = await editParam(this.cateId, row.attr_id, data)
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      // console.log(res)
      this.messageEvent(res.meta.msg)
    },
    showInput(row) {
      row.inputVisible = true
      // console.log(row)
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    async handleTagClose(index, row) {
      const restext = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(r => r)
      if (restext !== 'confirm') {
        return this.messageEvent('取消删除', 'info')
      }
      row.attr_vals.splice(index, 1)
      this.saveChange(row)
    },
    // cc() {
    //   // console.log(e.target)
    //   console.log('xx')
    //   this.isshowPoper = false
    // }
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
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
.tag {
  margin-right: 8px;
}
.poper {
  display: none;
}
</style>