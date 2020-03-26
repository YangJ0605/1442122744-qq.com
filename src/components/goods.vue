<template>
  <div>
    <c-header text1="商品管理" text2="商品列表"></c-header>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable v-model.trim="paramsInfo.query" @clear='inputClear'>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table border :data="goodsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="400px"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间"></el-table-column>
        <el-table-column label="操作">
          <template>
             <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="paramsInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList } from '@/network/goods.js'
export default {
  data() {
    return {
      goodsList: [],
      paramsInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10 
      },
      total: 0,

    }
  },
  created() {
    this._getGoodsList()
  },
  methods: {
   async _getGoodsList() {
      const {data: res} = await getGoodsList(this.paramsInfo)
      if(res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize) {
      this.paramsInfo.pagesize = newSize
      this._getGoodsList()
    },
    handleCurrentChange(newPageNum) {
      this.paramsInfo.pagenum = newPageNum
      this._getGoodsList()
    },
    inputClear() {
      this._getGoodsList()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>