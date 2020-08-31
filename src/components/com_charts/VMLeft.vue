<template>
  <div class="com">
    <div class="top">
      <div class="part-title1">
        <span class="title-line">{{title[0]}}</span>
      </div>
      <div class="chart-main">
        <div class="chart" ref="chart"></div>
        <div class="chart-label">
          <li v-for="(item, index) in vulIndexData" :key="index">
            <span class="name">{{item.name + ':'}}</span>
            <span class="value">{{item.value}}</span>
            <span class="line"></span>
          </li>
        </div>
        <p class="chart-title">整体脆弱性指数</p>
        <p class="chart-month">
          <span>月同比:</span>
          <span
            class="num"
            :style="{color: addReduce  == 0 ? '#FABF3E': '#53f64c'}"
          >{{percentage + '%'}}</span>
          <img
            class="icon"
            :src="require(`../../../static/imgs/vul_management_imgs/icon_${addReduce == 0 ? 'add': 'reduce'}.png`)"
            alt
          />
        </p>
      </div>
    </div>
    <div class="bottom">
      <div class="part-title1">
        <span class="title-line">{{title[1]}}</span>
      </div>
      <ul>
        <li v-for="(item, index) in topData" :key="index">
          <span class="name text-overflow" :title="item.detpName">{{item.detpName}}</span>
          <span class="bg">
            <span class="data animate-left" :style="{width: (item.num/topData[0].num * 100) + '%'}"></span>
          </span>
          <span class="value">{{item.num}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.com {
  padding: 15rem;
  height: calc(100% + 30rem);
  width: 100%;
  position: relative;
  top: -30rem;
  // background: rgba(16, 46, 87, 0.37);
  background:rgba(2,16,33,0.35);
  .top {
    height: 40%;
    width: 100%;
    .chart-main {
      width: 100%;
      height: calc(100% - 30rem);
      position: relative;
      display: flex;
      .chart {
        position: relative;
        top: -10rem;
        width: 50%;
        height: 100%;
      }
      .chart-label {
        padding: 10rem 10rem;
        width: 50%;
        height: 100%;
        display: flex;
        flex-wrap: wrap;
        align-content: center;
        li {
          position: relative;
          border-bottom: 1rem solid #3b4f67;
          width: 100%;
          margin-bottom: 10rem;
          padding: 3rem 10rem;
          display: flex;
          font-size: 14rem;
          color: #b3b3b3;
          background: rgba(40, 73, 105, 0.49);
          .name {
            width: 75%;
          }
          .value {
            text-align: right;
            flex: 1;
          }
          .line {
            position: absolute;
            left: 0;
            bottom: 0;
            width: 10rem;
            height: 1rem;
            background-color: #c29e26;
          }
        }
      }
      .chart-title {
        font-size: 12rem;
        line-height: 30rem;
        color: #b3b3b3;
        position: absolute;
        width: 35%;
        height: 30rem;
        text-align: center;
        top: 65%;
        left: 7.5%;
        background: rgba(32, 91, 150, 0.55);
        border-radius: 3rem;
      }
      .chart-month {
        display: flex;
        justify-content: space-between;
        position: absolute;
        width: 35%;
        top: 83%;
        left: 7.5%;
        border-radius: 3rem;
        font-size: 13rem;
        .icon {
          height: 100%;
          position: relative;
          top: 3rem;
        }
        span {
          color: #b3b3b3;
        }
      }
    }
  }
  .bottom {
    height: 60%;
    width: 100%;
    ul {
      margin-top: 10rem;
      color: "#666666";
      height: 100%;
      width: 100%;
      padding: 5rem 15rem;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      font-size: 16rem;
      li {
        height: 7%;
        display: flex;
        justify-content: space-between;
        margin: 4rem;
        width: 100%;
        .name {
          width: 20%;
          color: #b3b3b3;
        }
        .value {
          text-align: right;
          width: 12%;
          color: #b3b3b3;
          line-height: 22rem;
        }
        .bg {
          flex: 1;
          margin: 0 10rem;
          border: 1rem solid rgba(76, 107, 129, 0.4);
          height: 8rem;
          width: 50%;
          border-radius: 8rem;
          position: relative;
          top: 7rem;
          overflow: hidden;
          .data {
            background: linear-gradient(
              90deg,
              rgba(108, 167, 222, 1),
              rgba(108, 199, 222, 0.1)
            );
            border-radius: 4rem;
            animation: animate_chart 1s ease;
            @keyframes animate_chart {
              0% {
                left: -100%;
              }
              100% {
                left: 0;
              }
            }
            position: absolute;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>
<script>
import config from "../com_charts/charts_config";
let { tooltip, dataZoom, lineStyle, getRem } = config;
export default {
  data() {
    return {
      nearTime: '',
      title: ["整体脆弱性指数", "中高危漏洞数部门排名"],
      scoreNum: 0,
      percentage: 0,
      addReduce: 0,
      // 脆弱指数
      vulIndexData: [],
      // 排名数据
      topData: [],
    };
  },
  methods: {
    initChart() {
      let chart = this.$echarts.init(this.$refs.chart);
      var dataArr = [
        {
          value: this.scoreNum,
        },
      ];
      var colorSet = [
        [dataArr[0].value / 100, "#16c2ff"],
        [1, "#1a5b99"],
      ];
      var rich = {
        // fenshu
        white: {
          fontSize: getRem(17),
          color: "#ccc",
          fontWeight: "500",
        },
        bule: {
          fontSize: getRem(25),
          color: "#ccc",
          fontWeight: "500",
        },
        radius: {
          width: 350,
          height: 80,
          borderWidth: 1,
          borderColor: "#0092F2",
          fontSize: 20,
          color: "#fff",
          backgroundColor: "#1B215B",
          borderRadius: 20,
          textAlign: "center",
        },
      };
      let option = {
        tooltip: {
          formatter: "{a} <br/>{b} : {c}%",
        },

        series: [
          // 最外层
          {
            type: "gauge",
            name: "最外层",
            radius: "74%",
            startAngle: "215",
            endAngle: "-35",
            splitNumber: "100",
            pointer: {
              show: false,
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 1,
              },
            ],
            axisLine: {
              show: true,
              lineStyle: {
                color: [[1, "#4676a7"]],
                width: 2,
                opacity: 1,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
          },
          // 数据条
          {
            type: "gauge",
            radius: "65%",
            startAngle: "215",
            endAngle: "-35",
            pointer: {
              show: false,
            },
            detail: {
              formatter: function (value) {
                var num = Math.round(value);
                return "{bule|" + num + "}{white|分}";
              },
              rich: rich,
              offsetCenter: ["0%", "0%"],
            },
            data: dataArr,
            title: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: colorSet,
                width: 5,
                // shadowBlur: 15,
                // shadowColor: '#B0C4DE',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                opacity: 1,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: false,
              length: 25,
              lineStyle: {
                color: "#00377a",
                width: 2,
                type: "solid",
              },
            },
            axisLabel: {
              show: false,
            },
          },
          // 刻度圆弧
          {
            name: "灰色内圈", //刻度背景
            type: "gauge",
            z: 2,
            radius: "52%",
            startAngle: "215",
            endAngle: "-35",
            axisLine: {
              // 坐标轴线
              lineStyle: {
                // 属性lineStyle控制线条样式
                color: [[1, "#123f6e"]],
                width: 1.5,
                opacity: 1, //刻度背景宽度
              },
            },
            splitLine: {
              show: false,
            },
            axisLabel: {
              show: false,
            },
            pointer: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            detail: {
              show: 0,
            },
          },
          // 刻度
          {
            name: "白色圈刻度",
            type: "gauge",
            radius: "52%",
            startAngle: 215, //刻度起始
            endAngle: -35, //刻度结束
            z: 4,
            axisTick: {
              show: false,
            },
            splitLine: {
              length: 5, //刻度节点线长度
              lineStyle: {
                width: 1.5,
                color: "#123f6e",
              },
            },
            axisLabel: {
              show: false,
            }, //刻度节点文字颜色
            pointer: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                opacity: 0,
              },
            },
            detail: {
              show: false,
            },
            data: [
              {
                value: 0,
                name: "",
              },
            ],
          },
          // 圆形
          {
            type: "pie",
            radius: "40%",
            center: ["50%", "50%"],
            z: 1,
            itemStyle: {
              normal: {
                color: {
                  type: "linear",
                  x: 0,
                  y: 0,
                  x2: 0,
                  y2: 1,
                  colorStops: [
                    {
                      offset: 0,
                      color: "#3790cc", // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: "#084da1", // 100% 处的颜色
                    },
                  ],
                  global: false, // 缺省为 false
                },
                label: {
                  show: false,
                },
                labelLine: {
                  show: false,
                },
              },
            },
            hoverAnimation: false,
            label: {
              show: false,
            },
            tooltip: {
              show: false,
            },
            data: [100],
          },
        ],
      };

      chart.setOption(option, true);
      window.addEventListener("resize", () => {
        chart.resize();
      });
    },
  },
  mounted() {
    this.initChart();
  },
  watch: {
    scoreNum() {
      this.initChart();
    },
  },
  created() {
    this.axios.get("/riskBigScreen/loadOverall").then(({ data }) => {
      console.log('test123123', data.data)

      this.scoreNum = data.data.vulnerabilityIndex;
      this.percentage = data.data.MonthOnYear;
      this.addReduce = data.data.increaseOrDecline;
      this.vulIndexData = [
        {
          name: "已发现漏洞数",
          value: data.data.flawNums.foundVb || 0,
        },
        {
          name: "已忽略",
          value: data.data.flawNums.Ignored || 0,
        },
        {
          name: "处置中",
          value: data.data.flawNums.disposal || 0,
        },
        {
          name: "已修复",
          value: data.data.flawNums.fixed || 0,
        },
      ];
    });
    this.axios.get("/riskBigScreen/findDeptTo").then(({ data }) => {
      this.topData = data.data;
    });
  },
};
</script>
