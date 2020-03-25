<template>
  <div>
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb> -->
  <c-header text1='商品管理' text2='商品分类'></c-header>
  
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCateBtn">添加分类</el-button>
        </el-col>
      </el-row>

      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="tree-table"
      >
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="!scope.row.cat_deleted" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>

        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="editCateBtn(scope.row)"
          >编辑</el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteCateBtn(scope.row)"
          >删除</el-button>
        </template>
      </tree-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" @close="handleAddCateDialogClose">
      <div>
        <el-form
          :model="addCateFrom"
          ref="addCateFromRef"
          :rules="addCateFromRules"
          label-width="100px"
        >
          <el-form-item prop="cat_name" label="分类名称：">
            <el-input v-model="addCateFrom.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <el-cascader
              v-model="parentCheckedId"
              :options="parentOptions"
              :props="addPropOptions"
              @change="parentCheckedChange"
              style="width:100%;"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitAddCate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑分类"
      :visible.sync="eidtCateDialogVisible"
      @close="handleEditCateDialogClose"
    >
      <div class="row">
        <label value>分类名称：</label>
        <div>
          <el-input v-model.trim="editCateName" @blur="onBlur($event)" class></el-input>
          <div class="err_message" v-if="showErrMsg">{{errMessage}}</div>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="eidtCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCategories,
  addCategory,
  editCategory,
  deleteCategory
} from '@/network/categories.js'
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      catelist: [],
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      addCateDialogVisible: false,
      addCateFrom: {
        cat_name: '',
        cat_level: 0,
        cat_pid: 0
      },
      addCateFromRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          {
            min: 2,
            max: 8,
            message: '名称长度在 2 到 8 个字符',
            trigger: 'blur'
          }
        ]
      },
      parentCheckedId: [],
      parentOptions: [],
      addPropOptions: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      eidtCateDialogVisible: false,
      editCateName: '',
      editCateId: '',
      errMessage: '',
      showErrMsg: false,
      oldEditCateName: ''
    }
  },
  created() {
    this._getCategories()
  },
  methods: {
    async _getCategories() {
      const { data: res } = await getCategories(this.queryInfo)
      // console.log(res)
      if (res.meta.status !== 200)
        return this.messageEvent(res.meta.msg, 'error')
      // console.log(res)
      this.catelist = res.data.result
      this.total = res.data.total
      // console.log(this.catelist)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this._getCategories()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this._getCategories()
    },
    addCateBtn() {
      this.addCateDialogVisible = true
      // console.log('add')
      this.getParentCategories()
    },
    async getParentCategories() {
      const { data: res } = await getCategories({ type: 2 })
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.parentOptions = res.data
    },
    parentCheckedChange() {
      // console.log(this.parentCheckedId)
      // console.log(this.parentCheckedId.length)
      const length = this.parentCheckedId.length
      if (length > 0) {
        this.addCateFrom.cat_level = length
        this.addCateFrom.cat_pid = this.parentCheckedId[length - 1]
        return
      } else {
        this.addCateFrom.cat_pid = 0
        this.addCateFrom.cat_level = 0
      }
    },
    submitAddCate() {
      this.$refs.addCateFromRef.validate(async valid => {
        if (!valid) {
          return this.messageEvent('请输入分类名称', 'error')
        }
        const { data: res } = await addCategory(this.addCateFrom)
        if (res.meta.status !== 201) {
          return this.handleError(res)
        }
        // console.log(res)
        // const length = this.parentCheckedId.length
        // if(length === 0) {
        //   this._getCategories()
        // }else if(length === 1) {

        // }
        this.messageEvent(res.meta.msg)
        this._getCategories()
        // console.log(this.parentCheckedId)
        this.addCateDialogVisible = false
      })
    },
    handleAddCateDialogClose() {
      this.$refs.addCateFromRef.resetFields()
      this.parentCheckedId = []
      this.addCateFrom.cat_level = 0
      this.addCateFrom.cat_pid = 0
    },
    editCateBtn(cate) {
      console.log(cate)
      this.eidtCateDialogVisible = true
      this.oldEditCateName = cate.cat_name
      // console.log(this.oldEditCateName)
      this.editCateName = this.oldEditCateName
      this.editCateId = cate.cat_id
    },
    onBlur(e) {
      const length = e.target.value.length
      if (!length) {
        this.showErrMsg = true
        this.errMessage = '请输入分类名称'
        return
      } else if (length > 8 || length < 2) {
        this.showErrMsg = true
        this.errMessage = '名称长度在 2 到 8 个字符'
      } else {
        this.showErrMsg = false
        this.errMessage = ''
      }
    },
    handleEditCateDialogClose() {
      this.errMessage = ''
      this.showErrMsg = false
      this.editCateName = this.oldEditCateName
    },
    async submitEditCate() {
      if (this.showErrMsg) {
        return this.messageEvent(this.errMessage, 'error')
      }
      console.log(this.editCateId)
      const { data: res } = await editCategory(
        this.editCateId,
        this.editCateName
      )
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.messageEvent('更新成功')
      this._getCategories()
      this.eidtCateDialogVisible = false
    },
    async deleteCateBtn(cate) {
      // console.log(cate)
      const restext = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await deleteCategory(cate.cat_id)
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.messageEvent('删除成功')
      this._getCategories()
    }
  }
}
</script>

<style lang="scss">
.tree-table {
  margin: 15px 0;
}
.el-cascader-menu {
  height: 300px;
  padding: 10px 0;
}
.row {
  display: flex;
  align-items: center;
  div {
    flex: 1;
    margin-left: 10rpx;
    position: relative;
  }
}
div.err_message {
  font-size: 10px;
  text-align: left;
  margin-top: 5px;
  color: red;
  position: absolute;
}
</style>