<template>
  <div>
    <c-header text1="商品管理" text2="商品列表"></c-header>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" clearable v-model.trim="paramsInfo.query" @clear='inputClear' @keyup.native.enter="searchGoods">
            <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goToAddGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <el-table border :data="goodsList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="400px"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{scope.row.add_time * 1000 | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
             <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editGoodsBtn(scope.row.goods_id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoodsBtn(scope.row.goods_id)"
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
import { getGoodsList, deleteGoodsById} from '@/network/goods.js'
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
      isClear: false
    }
  },
  created() {
    this._getGoodsList()
  },
   watch: {
    'paramsInfo.query': function(newVal) {
      if (newVal === '' && !this.isClear) {
        console.log('watch')
        this._getGoodsList()
      }
    }
  },
  methods: {
   async _getGoodsList() {
      const {data: res} = await getGoodsList(this.paramsInfo)
      if(res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.goodsList = res.data.goods
      this.total = res.data.total
      this.isClear = false
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
      this.isClear = true
      this._getGoodsList()
    },
    searchGoods() {
      this._getGoodsList()
    },
    async deleteGoodsBtn(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then( async () => {
          const {data: res} = await deleteGoodsById(id)
          // console.log(res)
          if (res.meta.status !== 200)
            return this.handleError(res)
          this.messageEvent(res.meta.msg)
          this._getGoodsList()
        })
        .catch(() => {
          this.messageEvent('已取消删除', 'info')
        })
    },
    editGoodsBtn(id) {
      this.$router.push(`/goods/edit?id=${id}`)
    },
    goToAddGoods() {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>