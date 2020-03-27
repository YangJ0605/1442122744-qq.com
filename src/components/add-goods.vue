<template>
  <div>
    <c-header text1="商品管理" text2="添加商品"></c-header>
    <el-card>
      <el-alert title="添加商品信息(商品分类只能选择三级)" type="info" center show-icon :closable="false"></el-alert>

      <el-steps :active="activeName - 0" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addGoodsFrom"
        :rules="addGoodsFromRules"
        ref="addGoodsFromRef"
        label-width="90px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          @tab-click="tabControlClick"
          v-model="activeName"
          :before-leave="beforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item prop="goods_name" label="商品名称">
              <el-input v-model="addGoodsFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item prop="goods_price" label="商品价格">
              <el-input v-model="addGoodsFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_weight" label="商品重量">
              <el-input v-model="addGoodsFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_number" label="商品数量">
              <el-input v-model="addGoodsFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item prop="goods_cat" label="商品分类">
              <el-cascader
                placeholder="请选择三级分类"
                :props="cascaderOptions"
                :options="cateList"
                v-model="cascaderSelectArr"
                style="width:300px"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name">
              <el-checkbox-group v-model="item.attr_vals" @change="checkListChange">
                <el-checkbox :label="item2" v-for="item2 in item.attr_vals" :key="item2" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadUrl"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :multiple="true"
              :on-success="onSuccessUpload"
              :headers="uploadheadrs"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mixinCascader } from '@/mixins/mixin.js'
import { getParamsList } from '@/network/params.js'
export default {
  mixins: [mixinCascader],
  created() {
    this._getcategories()
  },
  data() {
    return {
      activeName: '0',
      addGoodsFrom: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0
      },
      addGoodsFromRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择三级分类', trigger: 'blur' }
        ]
      },
      onlyData: [],
      manyData: [],
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      uploadheadrs: {
        Authorization: window.sessionStorage.getItem('token') 
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  methods: {
    tabControlClick() {
      // this.activeName += 1
      if (this.activeName === '1') {
        this._getParamsList('many')
      }
      if (this.activeName === '2') {
        this._getParamsList('only')
      }
    },
    beforeLeave() {
      // console.log('cc')
      if (this.cascaderSelectArr.length !== 3) {
        this.messageEvent('请先选择三级分类', 'error')
        return false
      }
      return true
    },
    handleChange() {
      // console.log(this.cascaderSelectArr)
      if (this.cascaderSelectArr.length !== 3) {
        this.cascaderSelectArr = []
        this.onlyData = []
        this.manyData = []
        return
      }
    },
    async _getParamsList(sel) {
      const { data: res } = await getParamsList(this.cateId, sel)
      // console.log(this.cateId)
      // console.log(this.cascaderSelectArr)
      //  console.log(res)
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      // console.log(res)
      if (sel === 'many') {
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
          // this.checkList.push(item.attr_vals)
          //过滤空的字符串
          item.attr_vals = item.attr_vals.filter(item2 => item2.length)
        })
        this.manyData = res.data
        // console.log(this.manyData)
      } else {
        this.onlyData = res.data
      }
    },
    checkListChange() {
      // // console.log(this.checkList)
      // console.log(this.manyData)
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    onSuccessUpload(res, file) {
      console.log(res)
      console.log(file)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>