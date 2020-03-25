<template>
  <div>
    <c-header text1="商品管理" text2="参数列表"></c-header>
    <el-card>
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" type="warning" show-icon :closable='false'></el-alert>
      <el-row class="el-row">
        <span>选择商品分类</span>
        <el-cascader></el-cascader>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import {
  getCategories,
} from '@/network/params.js'
export default {
  data() {
    return {
      cateList: []
    }
  },
  created() {
    this._getcategories()
  },
  methods: {
    async _getcategories() {
      const {data:res} = await getCategories()
      console.log(res)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin: 14px 0;
  span {
    margin-right: 5px;
  }
}
</style>