<template>
  <div>
    <c-header text1="订单管理" text2="订单列表"></c-header>

    <el-card>
      <!-- <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            clearable
            @clear="clearEvent"
            @keyup.native.enter="searchOrder"
          >
            <el-button slot="append" icon="el-icon-search" @click="searchOrder"></el-button>
          </el-input>
        </el-col>
      </el-row> -->

      <el-table :data="ordersList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <template>{{scope.row.is_send}}</template>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showBox"></el-button>
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgressBox"></el-button>
            <el-button size="mini" type="warning" icon="el-icon-search" @click="searchOrder(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="订单详情" :visible.sync="detailVisible">
      <el-row>
       下单时间：{{detailOrder.create_time | dateFormat}}
      </el-row>
      <el-row>
       是否发货：{{detailOrder.is_send}}
      </el-row>
      <el-row>
       发票公司/个人：{{detailOrder.order_fapiao_company || detailOrder.order_fapiao_title}}
      </el-row>
      <el-row>
       订单编号：{{detailOrder.order_number}}
      </el-row>
      <el-row>
       支付方式：{{orderPay}}
      </el-row>
      <el-row>
       订单价格：{{detailOrder.order_price}}
      </el-row>
      <el-row>
       支付状态：{{payStatus}}
      </el-row>
      <el-row>
       最后更新时间：{{detailOrder.update_time | dateFormat}}
      </el-row>
    </el-dialog>

    <el-dialog title="物流进度" :visible.sync="progressVisible">
       <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progressInfo"
      :key="index"
      :timestamp="activity.ftime">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrdersList, getOrdersDetail, getOrderProgress } from '@/network/orders.js'
import cityData from '@/utils/citydata'
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      ordersList: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      progressVisible: false,
      progressInfo: [],
      detailVisible: false,
      detailOrder: {}
    }
  },
  created() {
    this._getOrdersList()
  },
  computed: {
    orderPay() {
      const pay = this.detailOrder.order_pay
      if( pay === '0') {
        return '未支付'
      } else if(pay === '1') {
        return '支付宝'
      } else if (pay === '2') {
        return '微信'
      } else {
        return '银行卡'
      }
    },
    payStatus() {
      const status = this.detailOrder.order_pay
      if( status === '0') {
        return '未付款'
      } else {
        return '已付款'
      }
    }
  },
  methods: {
    async _getOrdersList() {
      const { data: res } = await getOrdersList(this.queryInfo)
      if (res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.total = res.data.total
      this.ordersList = res.data.goods
      // console.log(this.ordersList)
    },
    clearEvent() {},
    async searchOrder(row) {
      console.log(row)
      const {data:res} = await getOrdersDetail(row.order_id)
      if(res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.detailOrder = res.data
      console.log(this.detailOrder)
      this.detailVisible = true
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this._getOrdersList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this._getOrdersList()
    },
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      const {data:res} = await getOrderProgress()
      // console.log(res)
      if(res.meta.status !== 200) {
        return this.handleError(res)
      }
      this.progressInfo = res.data
      this.progressVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>