<template>
  <div>
    <c-header text1="数据统计" text2="数据报表"></c-header>
    <el-card>
      <div id="main" style="width: 900px;height:450px;"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
import { getReports } from '@/network/reports.js'
export default {
  data() {
    return {
      option: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
    // this._getReports()
  },
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await getReports()
    if (res.meta.status !== 200) {
      return this.handleError(res)
    }
    // console.log(res.data)
    const option = res.data
    const {grid, title, tooltip, xAxis} = this.option
    // console.log(this.option)
    option.grid = grid
    option.title = title
    option.tooltip = tooltip
    option.xAxis.forEach((item, index) => {
      item.type = xAxis[index].type
    })
    myChart.setOption(option)
  },
  methods: {
    // async _getReports() {
    //   const { data: res } = await getReports()
    //   if (res.meta.status !== 200) {
    //     return this.handleError(res)
    //   }
    //   this.option1 = res.data
    // }
  }
}
</script>

<style lang="scss" scoped>
</style>