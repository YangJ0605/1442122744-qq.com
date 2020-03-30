<template>
  <div>
    <c-header text1="商品管理" :text2="title2"></c-header>
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
                v-model="addGoodsFrom.goods_cat"
                style="width:300px"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item v-for="item in manyData" :key="item.attr_id" :label="item.attr_name">
              <template v-if="$route.path.includes('edit')">
                <el-checkbox-group v-model="item.attr_value" @change="checkListChange">
                <el-checkbox :label="item2" v-for="item2 in item.attr_value" :key="item2" border></el-checkbox>
              </el-checkbox-group>
              <!-- {{manyData}} -->
              </template>
              <template v-else>
                <el-checkbox-group v-model="item.attr_vals" @change="checkListChange">
                <el-checkbox :label="item2" v-for="item2 in item.attr_vals" :key="item2" border></el-checkbox>
              </el-checkbox-group>
              </template>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item v-for="item in onlyData" :key="item.attr_id" :label="item.attr_name">
              <el-input v-model="item.attr_value" v-if="$route.path.includes('edit')"></el-input>
              <el-input v-model="item.attr_vals" v-else></el-input>
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
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsFrom.goods_introduce" ref="myQuillEditor"></quill-editor>
            <el-button type="primary" class="top" @click="addGoodsSubmit">{{submitText}}</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mixinCascader } from '@/mixins/mixin.js'
import { getParamsList } from '@/network/params.js'
import { addNewGoods, getGoodsById, editGoodsById } from '@/network/goods.js'

export default {
  mixins: [mixinCascader],
  async created() {
    if (this.$route.path.includes('edit')) {
      console.log(949)
      const id = this.$route.query.id //939
      const { data: res } = await getGoodsById(id)
      console.log('ada')
      console.log('edit', res)
      if (res.meta.status !== 200) {
        this.$router.go(-1);
        return this.handleError(res)
      }
      res.data.goods_cat = res.data.goods_cat.split(',')
      // res.data.goods_cat.forEach(item => Number(item))
      res.data.pics.forEach(pic => {
        this.fileList.push({url:pic.pics_mid_url})
      })
      res.data.attrs.forEach(item => {
        // console.log(item)
        if (item.attr_sel === 'only') {
          this.onlyData.push(item)
        } else {
          item.attr_value = item.attr_value.split(' ')
          this.manyData.push(item)
        }
      })
      console.log(this.onlyData)
      console.log(this.manyData)
      this.addGoodsFrom = res.data
      this.addGoodsFrom.goods_cat = this.addGoodsFrom.goods_cat.map(item =>
        Number(item)
      )
      this.cascaderSelectArr = this.addGoodsFrom.goods_cat
      this.title2 = '编辑商品'
      this.submitText = '提交修改商品'
      // console.log(this.addGoodsFrom)
    }
    this._getcategories()
  },
  computed: {},
  data() {
    return {
      title2: '添加商品',
      submitText: '添加商品',
      activeName: '0',
      addGoodsFrom: {
        goods_name: '',
        goods_cat: [],
        goods_price: 1,
        goods_number: 1,
        goods_weight: 1,
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      fileList:[],
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
      dialogVisible: false,
      flag1: true,
      flag2: true
    }
  },
  methods: {
    tabControlClick() {
      // this.activeName += 1
      if(!this.$route.path.includes('edit')) {
        if (this.activeName === '1' && this.flag1) {
        this.flag1 = false
        this._getParamsList('many')
      }
      if (this.activeName === '2' && this.flag2) {
        this.flag2 = false
        this._getParamsList('only')
      }
      }
    },
    beforeLeave() {
      // console.log('cc')
      if (this.addGoodsFrom.goods_cat.length !== 3) {
        this.messageEvent('请先选择三级分类', 'error')
        return false
      }
      return true
    },
    handleChange() {
      // console.log(this.cascaderSelectArr)
      this.cascaderSelectArr = this.addGoodsFrom.goods_cat
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
    handleRemove(file) {
      // console.log(file)
     var filePath 
      if (this.$route.path.includes('edit')) {
        filePath = file.url.split('8888/')
      } else {
        filePath = file.response.data.tmp_path
      }
      const pics = this.addGoodsFrom.pics
      const index = pics.findIndex(item => item.pic === filePath)
      pics.splice(index, 1)
    },
    handlePictureCardPreview(file) {
      // console.log(file)
      if (this.$route.path.includes('edit')) {
        // console.log(file.url)
        this.dialogImageUrl = file.url
      }else {
        this.dialogImageUrl = file.response.data.url
      }
      this.dialogVisible = true
    },
    onSuccessUpload(res) {
      const picInfo = { pic: res.data.tmp_path }
      this.addGoodsFrom.pics.push(picInfo)
    },
    addGoodsSubmit() {
      // console.log('submit')
      this.$refs.addGoodsFromRef.validate(async valid => {
        if (!valid) {
          // console.log('vvv')
          return this.messageEvent('请先填写前面的必填内容', 'error')
        }
        // console.log('ok')
        console.log(this.manyData)
        this.addGoodsFrom.attrs = []
        const isEdit = this.$route.path.includes('edit') 
        this.manyData.forEach(item => {
          const newData = {
            attr_id: item.attr_id,
            attr_value: isEdit ? item.attr_value.join(' ') : item.attr_vals.join(' ')
          }
          this.addGoodsFrom.attrs.push(newData)
        })
        this.onlyData.forEach(item => {
          const newData = { attr_id: item.attr_id, attr_value: isEdit ? item.attr_value : item.attr_vals }
          this.addGoodsFrom.attrs.push(newData)
        })
        // form.attrs = this.addGoodsFrom.attrs
        const form = JSON.parse(JSON.stringify(this.addGoodsFrom))
        form.goods_cat = form.goods_cat.join(',')
        console.log(form)
        // console.log(this.addGoodsFrom)
        // console.log('ddd')
        // console.log(addNewGoods)
        if (this.$route.path.includes('edit')) {
          const id = this.addGoodsFrom.goods_id
          // console.log(this.addGoodsFrom.goods_id,this.$route.query.id)
          const { data: res } = await editGoodsById(id, form)
          if (res.meta.status !== 200) {
            return this.handleError({meta:{msg:'修改失败'}})
          }
          this.messageEvent('修改成功')
        } else {
          console.log('from',form)
          const { data: res } = await addNewGoods(form)
          console.log('add', res)
          if (res.meta.status !== 201) {
            console.log(this.addGoodsFrom)
            return this.handleError(res)
          }
          this.messageEvent(res.meta.msg)
        }
        this.$router.push('/goods')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.top {
  margin-top: 15px;
}
</style>