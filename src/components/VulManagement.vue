<template>
  <div class="page-com" v-title data-title="态势感知">
    <img :src="require(`../../static/imgs/vul_management_imgs/icon_${ full ? 'exitfull': 'full'}.png`)" class="full" @click="fullScrren" alt="">
    <div class="header">
      <h2>漏洞管理平台</h2>
      <p class="vul-time">
        <span>最近漏洞导入时间:</span>
        <span class="time">{{nearImprotTime}}</span>
      </p>
    </div>
    <div class="main">
      <div class="main-top">
        <div class="part-left">
          <VMLeft></VMLeft>
        </div>
        <div class="part-center">
          <!-- 公司名称 -->
          <div class="center-title">
            <p>{{comName}}</p>
          </div>
          <div class="animate-box" id="animate_box">
            <img src="../../static/imgs/vul_management_imgs/center_gif.gif" alt />
          </div>
          <div class="center-left">
            <ul>
              <el-carousel
                class="swiper-box"
                :interval="5000"
                arrow="never"
                indicator-position="none"
                :loop="true"
              >
                <el-carousel-item
                  v-for="(item, index) in Math.ceil(chartData.length / 5)"
                  :key="index"
                  class="swiper-box-item"
                >
                  <li
                    class="department-part"
                    v-for="(item, index) in chartData.slice(index * 5, (index + 1) * 5)"
                    :key="index"
                  >
                    <img
                      :src="require(`../../static/imgs/vul_management_imgs/0${index + 1}leftborder.png`)"
                      alt
                    />
                    <div class="department-score">
                      <p class="department">{{item.name}}</p>
                      <p class="score" :style="{color: colorList.score[item.scoreColorIndex]}">
                        <span>{{item.score}}</span>分
                      </p>
                    </div>
                    <div class="department-info">
                      <li v-for="(item1, index1) in item.type" :key="index1">
                        <span class="pin" :style="{backgroundColor: colorList.lv[index1]}"></span>
                        <span class="lv">{{item1.name + ': '}}</span>
                        <span class="value">{{item1.value}}</span>
                      </li>
                    </div>
                  </li>
                </el-carousel-item>
              </el-carousel>
            </ul>
          </div>
          <div class="center-right-chart" ref="chart_score"></div>
          <div class="center-right-chart-info">
            <li v-for="(item, index) in chartData.slice(0, 5)" :key="index">
              <p class="name">{{item.name}}</p>
              <p class="value">{{item.assetsNum}}</p>
            </li>
          </div>
        </div>
        <div class="part-right">
          <VMRight></VMRight>
        </div>
      </div>
      <div class="main-bottom">
        <VMBottom></VMBottom>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  list-style: none;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.part-title1 {
  height: 23rem;
  font-size: 18rem;
  line-height: 23rem;
  color: #fff;
  padding-left: 30rem;
  background-image: url("../../static/imgs/vul_management_imgs/img_btleft.png");
  background-repeat: no-repeat;
  background-position: 0 center;
  .title-line {
    display: inline-block;
    border-right: 3rem solid #fbc015;
    padding-right: 15rem;
  }
}
</style>
<style lang="scss" scoped>
.page-com {
  .full {
    top: 25rem;
    right: 15rem;
    position: absolute;
    width: 24rem;
    height: 24rem;
    z-index: 1000;
    opacity: .3;
  }
  width: 100%;
  height: 100vh;
  background-image: url("../../static/imgs/vul_management_imgs/bg.png");
  background-size: 100% 100%;
  .header {
    position: relative;
    .vul-time {
      font-size: 12rem;
      color: #cccccc;
      position: absolute;
      top: 7rem;
      left: 3%;
      .time,
      .day {
        color: #fabf3e;
      }
      .time {
        margin-right: 20rem;
      }
    }
    height: 80rem;
    width: 100%;
    background-image: url("../../static/imgs/vul_management_imgs/img_titlebg.png");
    background-size: 100% 100%;
    h2 {
      font-size: 32rem;
      color: #fff;
      text-align: center;
      font-weight: normal;
      line-height: 70rem;
    }
  }
  .main {
    height: calc(100vh - 80rem);
    width: 100%;
    padding: 15rem;
    .main-top {
      height: 60vh;
      width: 100%;
      display: flex;
      .part-center {
        position: relative;
        height: 100%;
        flex: 1;
        margin: 0 15rem;
        background-image: url("../../static/imgs/vul_management_imgs/img_mainbg(2).png");
        background-size: 100% 100%;
        .animate-box {
          // opacity: .8;
          position: absolute;
          left: 27.3%;
          top: 14%;
          width: 45%;
          img {
            width: 130%;
          }
        }
        .center-title {
          z-index: 100;
          position: absolute;
          left: 42%;
          bottom: 5%;
          width: 300rem;
          height: 70rem;
          background-image: url("../../static/imgs/vul_management_imgs/img_Companybg.png");
          background-size: 100% 100%;
          p {
            text-align: center;
            line-height: 65rem;
            font-size: 26rem;
            color: rgba(255, 255, 255, 1);
            background: linear-gradient(
              0deg,
              rgba(200, 165, 27, 1) 54.3701171875%,
              rgba(255, 255, 255, 1) 100%
            );
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
        }
        .center-left {
          left: 40rem;
          top: 0;
          width: 380rem;
          height: 100%;
          padding-top: 3vh;
          padding-bottom: 3vh;
          position: absolute;
          ul {
            background-image: url("../../static/imgs/vul_management_imgs/img_line.png");
            background-repeat: no-repeat;
            background-size: auto 100%;
            background-position: 95%;
            height: 100%;
            .swiper-box {
              width: 100%;
              height: 100%;
              .swiper-box-item {
                height: 54vh;
                width: 100%;
                .department-part {
                  display: flex;
                  .department-score {
                    display: flex;
                    flex-wrap: wrap;
                    align-content: center;
                    padding-left: 30rem;
                    width: 35%;
                    height: 100%;
                    .department {
                      width: 100%;
                      font-size: 16rem;
                      color: #fff;
                      margin-bottom: 5rem;
                    }
                    .score {
                      width: 100%;
                      color: #6eff16;
                      font-size: 12rem;
                      span {
                        font-size: 22rem;
                      }
                    }
                  }
                  .department-info {
                    flex: 1;
                    display: flex;
                    flex-wrap: wrap;
                    align-content: center;
                    li {
                      color: #ccc;
                      font-size: 12rem;
                      display: flex;
                      align-items: center;
                      width: 100%;
                      margin: 0;
                      height: 24rem;
                      // background-color: #fff;
                      .lv {
                        margin: 0 5rem;
                      }
                      .pin {
                        width: 6rem;
                        height: 6rem;
                        border-radius: 50%;
                      }
                    }
                  }
                  position: relative;
                  width: 100%;
                  height: 16%;
                  img {
                    height: 100%;
                    width: 100%;
                    position: absolute;
                    left: 3rem;
                  }
                }
                & li:not(:last-of-type) {
                  margin-bottom: calc(54vh * 0.2 / 4);
                }
              }
            }
          }
        }
        .center-right-chart {
          padding: 20rem 0;
          position: absolute;
          right: 120rem;
          height: 100%;
          width: 120rem;
        }
        .center-right-chart-info {
          padding: 4vh 0;
          position: absolute;
          right: 30rem;
          height: 100%;
          width: 90rem;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          li {
            width: 100%;
            height: 13%;
            background-image: url("../../static/imgs/vul_management_imgs/img_bumenbg.png");
            background-size: 100% 100%;
            color: #ccc;
            font-size: 14rem;
            text-align: center;
            display: flex;
            flex-wrap: wrap;
            align-content: center;
            p {
              width: 100%;
              margin: 2rem 0;
            }
          }
          & li:not(:last-of-type) {
            margin-bottom: calc(62vh * 0.29 / 4);
          }
        }
      }
      .part-left,
      .part-right {
        width: 22%;
        // background:rgba(2,16,33,0.05);
        // background:rgba(2,16,33,0.35);
      }
    }

    .main-bottom {
      padding: 15rem;
      height: calc(40vh - 80rem - 45rem);
      background:rgba(2,16,33,0.35);
      // background: rgba(16, 46, 87, 0.37);
      margin-top: 15rem;
    }
  }
}
</style>

<script>
import screenfull from "screenfull";
import config from "./com_charts/charts_config";
let { getRem } = config;
// import "../assets/js/flexible";
import VMLeft from "../components/com_charts/VMLeft";
import VMBottom from "../components/com_charts/VMBottom";
import VMRight from "../components/com_charts/VMRight";
export default {
  components: { VMLeft, VMBottom, VMRight },
  data() {
    return {
      full: false,
      nearImprotTime: "",
      comName: "中国移动杭州分公司",
      colorList: {
        score: ["#6EFF16", "#FFEC16", "#E69230"],
        lv: ["#ED684E", "#D2B011", "#148DE1"],
      },
      chartData: "",
    };
  },

  methods: {
    initChart() {
      let chart = this.$echarts.init(this.$refs.chart_score);
      let value = 55;
      let seriesArr = [];
      let titleArr = [];
      let me = this;
      this.chartData.slice(0, 5).forEach((item, index) => {
        titleArr.push({
          text: "{a|" + item.score + "分" + "}",
          x: "center",
          y: 8 + 20 * index + "%",
          textStyle: {
            rich: {
              a: {
                fontSize: getRem(14),
                color: "#ccc",
              },
            },
          },
        });

        seriesArr.push(
          {
            type: "gauge",
            center: ["50%", 10 + 20 * index + "%"],
            radius: "63%",
            clockwise: false,
            startAngle: "0",
            endAngle: (360 * item.score) / 100,
            // 刻度线数量
            splitNumber: (24 * item.score) / 100,
            detail: {
              offsetCenter: [0, -20],
              formatter: " ",
            },
            pointer: {
              show: false,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: [
                  [0, "rgba(32,187,252,0)"],
                  [1, "rgba(32,187,252,0)"],
                ],
                // width: 100,
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              length: getRem(6),
              lineStyle: {
                color: "#aa3526",
                width: getRem(6),
              },
            },
            axisLabel: {
              show: false,
            },
          },
          {
            type: "pie",
            name: "内层细圆环",
            center: ["50%", 10 + 20 * index + "%"],
            radius: ["46%", "48%"],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: "rgba(210, 49, 17, 0.53)",
              },
            },
            label: {
              show: false,
            },
            data: [100],
          },
          {
            type: "pie",
            center: ["50%", 10 + 20 * index + "%"],
            name: "内层环",
            radius: [0, "48%"],
            hoverAnimation: false,
            clockWise: false,
            itemStyle: {
              normal: {
                color: "rgba(74,22,19,0.32)",
              },
            },
            label: {
              show: false,
            },
            data: [100],
          }
        );
      });

      let option = {
        series: seriesArr,
        title: titleArr,
      };

      chart.setOption(option, true);
      window.addEventListener("resize", () => {
        chart.resize();
      });
    },
    fullScrren() {
      screenfull.toggle();
      this.full = !this.full
    },
  },

  mounted() {
    // this.initChart();
  },

  created() {
    document.getElementsByTagName("html")[0].style.fontSize =
      document.documentElement.clientWidth / 100 / 19.2 + "px";
    (window.onresize = function () {
      var em = document.documentElement.clientWidth / 100 / 19.2;
      if (document.documentElement.clientWidth < 1000) {
        return;
      }
      document.getElementsByTagName("html")[0].style.fontSize = em + "px";
    }),
      this.axios.get("/riskBigScreen/findFlawDistributed").then(({ data }) => {
        console.log('allall',data)
        let arr = [];
        data.data.forEach((item, index) => {
          let colorIndex;
          if (item.vulnerabilityIndex >= 80) {
            colorIndex = 0;
          } else if (
            item.vulnerabilityIndex < 80 &&
            item.vulnerabilityIndex >= 60
          ) {
            colorIndex = 1;
          } else {
            colorIndex = 2;
          }
          arr.push({
            scoreColorIndex: colorIndex,
            name: item.deptName,
            assetsNum: item.assetsNum,
            score: item.vulnerabilityIndex,
            type: [
              { name: "高危", value: item.high },
              { name: "中危", value: item.inDanger },
              { name: "低危", value: item.lowRisk },
            ],
          });
        });
        this.chartData = arr.sort((a, b) => {
          return b.score - a.score;
        });
      });

    this.axios.get("/riskBigScreen/loadOverall").then(({ data }) => {
      console.log('time',data)
      this.nearImprotTime =
        new Date(Number(data.data.recentDate))
          .toLocaleDateString()
          .replace(/\//g, ".") +
        "  " +
        new Date(Number(data.data.recentDate)).toTimeString().slice(0, 5);
    });
  },
  watch: {
    chartData() {
      this.initChart();
    },
  },
};
</script>