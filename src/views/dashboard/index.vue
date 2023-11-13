<template>
  <div class="dashboard-container">
    <el-row :gutter="30">
      <el-col :span="8">
        <div class="grid-content header-item">
          <el-image
            class="header-item-img"
            src="http://qiniu.nansker.cn/20200624_005817.jpg"
            fit="fill"></el-image>
          <div class="header-item-right">
            <div class="header-item-right-title1">用户总数</div>
            <div class="header-item-right-title2">10001 人</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content header-item">
          <el-image
            class="header-item-img"
            src="http://qiniu.nansker.cn/20200624_005817.jpg"
            fit="fill"></el-image>
          <div class="header-item-right">
            <div class="header-item-right-title1">课程数量</div>
            <div class="header-item-right-title2">1203 节</div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="grid-content header-item">
          <el-image
            class="header-item-img"
            src="http://qiniu.nansker.cn/20200624_005817.jpg"
            fit="fill"></el-image>
          <div class="header-item-right">
            <div class="header-item-right-title1">视频点播</div>
            <div class="header-item-right-title2">10290 次</div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="30">
      <el-col :span="12">
        <div class="grid-title">用户周活跃</div>
        <div class="grid-content">
          <div style="height: 300px" ref="chart1"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-title">课程付费收入</div>
        <div class="grid-content">
          <div style="height: 300px" ref="chart2"></div>
        </div>
      </el-col>
    </el-row>

    <el-row :gutter="30">
      <el-col :span="14">
        <div class="grid-title">系统日历</div>
        <div class="grid-content">
          <el-calendar>
          </el-calendar>
        </div>
      </el-col>
      <el-col :span="10">
        <div class="grid-title">用户兴趣分布</div>
        <div class="grid-content">
          <div style="height: 300px" ref="chart3"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import {getDay7} from '@/utils/index'

const echarts = require('echarts')

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      days7:[]
    }
  },

  mounted() {
    this.days7 = getDay7()
    this.initEcharts()
  },

  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      // this.days7 = getDay7
    },

    initEcharts() {
      let myChart1 = echarts.init(this.$refs.chart1);
      // 绘制图表
      myChart1.setOption({
        color: ['#73c0de', '#fac858'],
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ['product', '管理员', '会员'],
          source: [
            {product: this.days7[6], '管理员': 7, '会员': 98},
            {product: this.days7[5], '管理员': 19, '会员': 23},
            {product: this.days7[4], '管理员': 43, '会员': 87},
            {product: this.days7[3], '管理员': 30, '会员': 65},
            {product: this.days7[2], '管理员': 12, '会员': 97},
            {product: this.days7[1], '管理员': 18, '会员': 42},
            {product: this.days7[0], '管理员': 21, '会员': 36},
          ]
        },
        xAxis: {type: 'category'},
        yAxis: {
          type: 'value',
          name:'（人）',
          nameLocation:'end',
        },
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            itemStyle: {normal: {barBorderRadius: [8]}}
          },
          {
            type: 'bar',
            itemStyle: {normal: {barBorderRadius: [8]}}
          }]
      });
      let myChart2 = echarts.init(this.$refs.chart2);
      myChart2.setOption({
        tooltip: {},
          xAxis: {
            type: 'category',
            data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月','十二月']
          },
          yAxis: {
            type: 'value',
            name:'（元）',
            nameLocation:'end',
          },
          series: [
            {
              data: [820, 932, 901, 934, 1290, 1330, 1320,1214,1214,667,1345,1214],
              type: 'line',
              smooth: true,
              itemStyle: {
                normal: {
                  color: '#00CED1', //改变折线点的颜色
                  lineStyle: {
                    color: '#00CED1' //改变折线颜色
                  }
                }
              },
            }
          ]
        }
      )
      ;

      let myChart3 = echarts.init(this.$refs.chart3);
      myChart3.setOption({
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          orient: "vertical",
          x: "left"
        },
        series: [
          {
            name: '感兴趣',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 1048, name: 'SpringBoot'},
              {value: 735, name: 'C++'},
              {value: 580, name: 'java'},
              {value: 484, name: 'Vue'},
              {value: 300, name: 'Python'},
              {value: 400, name: 'Android'}
            ],
          }
        ]
      });

    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  background-color: #f4f6f9;
  min-height: calc(100vh - 50px);
  padding: 20px 40px;
}

.el-row {
  margin-bottom: 30px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 10px;
}

.grid-title {
  margin-bottom: 16px;
  font-size: 20px;
  color: #3e4671;
}

.grid-content {
  border-radius: 10px;
  background-color: white;
  min-height: 60px;
  padding: 10px;
}

.header-item {
  display: flex;
  align-items: center;
  padding: 20px;

  .header-item-img {
    width: 70px;
    height: 70px;
    border-radius: 100%;
  }

  .header-item-right {
    margin-left: 20px;

    .header-item-right-title1 {
      font-size: 16px;
      margin-bottom: 10px;
      color: #3e4671;
    }

    .header-item-right-title2 {
      font-size: 20px;
      color: #3e4671;
    }
  }
}

</style>
