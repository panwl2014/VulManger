<template>
  <div class="com" @mouseenter="mouseEnter" @mouseleave="mouseLeave">
    <p class="part-title1">
      <span class="title-line">{{title}}</span>
      <span class="tab-bar" @click="changeTab">
        <span :class="isCheck == 'day' ? 'active': ''" :data-index="'day'">日</span>
        <span :class="isCheck == 'week' ? 'active': ''" :data-index="'week'">周</span>
        <span :class="isCheck == 'month' ? 'active': ''" :data-index="'month'">月</span>
      </span>
    </p>
    <div class="chart" ref="chart"></div>
  </div>
</template>
<style lang="scss" scoped>
.com {
  position: relative;
  width: 100%;
  height: 100%;
  .chart {
    left: 0;
    top: 0;
    position: absolute;
    height: calc(100%);
    width: 100%;
  }
  .part-title1 {
    position: relative;
    .tab-bar {
      z-index: 10;
      position: absolute;
      right: 0;
      top: 0;
      width: 150rem;
      height: 30rem;
      display: flex;
      border-radius: 4rem;
      & span:nth-of-type(2) {
        border-top: solid 1rem #808080;
        border-bottom: solid 1rem #808080;
      }
      & span:nth-of-type(3) {
        border: solid 1rem #808080;
        border-radius: 0 4rem 4rem 0;
      }
      & span:nth-of-type(1) {
        border: solid 1rem #808080;
        border-radius: 4rem 0 0 4rem;
      }
      span {
        text-align: center;
        font-size: 14rem;
        font-weight: normal;
        color: #808080;
        flex: 1;
        line-height: 30rem;
        &.active {
          color: #34d2ff;
          border: 1rem solid #34d2ff;
          border-radius: 4rem;
        }
      }
    }
  }
}
</style>

<script>
import config from "../com_charts/charts_config";
let { tooltip, dataZoom, lineStyle, getRem } = config;

let { axisLabel, axisLine, axisTick, splitLine, nameTextStyle } = lineStyle;
export default {
  data() {
    return {
      chartData: [],
      // 日 2 周 0 月 1
      chartIndex: 2,
      title: "中高危漏洞数量趋势",
      colorList: [
        {
          start: "rgba(247, 191, 119,.3)",
          end: "rgba(247, 191, 119,0)",
          line: "rgba(247, 191, 119,1)",
        },
        {
          start: "rgba(109, 181, 222,.3)",
          end: "rgba(109, 181, 222,0)",
          line: "rgba(109, 181, 222,1)",
        },
        {
          start: "rgba(162, 199, 251,.3)",
          end: "rgba(162, 199, 251,0)",
          line: "rgba(162, 199, 251,1)",
        },
      ],
      end: 30,
      start: 0,
      timer: null,
      nameList: ["主机漏洞", "应用漏洞"],
      isCheck: "day",
    };
  },
  methods: {
    mouseEnter() {
      clearInterval(this.timer);
      this.timer = null;
    },

    mouseLeave() {
      this.timer = setInterval(() => {
        if (this.start >= 70) {
          this.start = 0;
        }
        if (this.end >= 100) {
          this.end = 30;
        }
        this.start = this.start + 5;
        this.end = this.end + 5;
      }, 3000);
    },
    changeTab(e) {
      this.isCheck = e.target.dataset.index;
      switch (e.target.dataset.index) {
        case "day":
          this.chartIndex = 2;
          break;
        case "week":
          this.chartIndex = 0;
          break;
        case "month":
          this.chartIndex = 1;
          break;
      }
    },
    initChart() {
      let chart = this.$echarts.init(this.$refs.chart);
      let seriesArr = [];
      this.nameList.forEach((item, index) => {
        seriesArr.push({
          name: this.nameList[index],
          type: "line",
          symbol: "circle",
          symbolSize: 6,
          smooth: true,
          itemStyle: {
            normal: {
              color: this.colorList[index].line,
              lineStyle: {
                color: this.colorList[index].line,
                width: 1,
              },
              areaStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: this.colorList[index].end,
                  },
                  {
                    offset: 1,
                    color: this.colorList[index].start,
                  },
                ]),
              },
            },
          },
          data: this.chartData[this.chartIndex].map((item) => {
            switch (index) {
              case 0:
                return item.host;
                break;
              case 1:
                return item.app;
                break;
            }
          }),
        });
      });
      let option = {
        tooltip: {
          extraCssText: "box-shadow: 0 0 5px rgba(0, 0, 0, 0.3)",
          confine: true,
          trigger: "axis",
          axisPointer: {
            label: {
              show: false,
            },
            lineStyle: {
              width: 0,
            },
          },
          backgroundColor: "rgba(66,83,122,0.8);",
          textStyle: {
            fontSize: getRem(14),
            color: "rgba(204, 204, 204, 1)",
          },
          padding: [10, 10],
        },
        legend: {
          data: this.nameList,
          right: "center",
          top: "0%",
          itemGap: getRem(40),
          // icon: "diamond",
          // itemWidth: 8,
          // itemHeight: 8,

          textStyle: {
            fontSize: getRem(18),
            color: "#808080",
          },
        },
        grid: {
          left: "2%",
          right: "3%",
          top: "33%",
          bottom: "0%",
          containLabel: true,
        },
        xAxis: [
          {
            name: "日期",
            nameTextStyle: {
              fontSize: getRem(14),
              color: "#b3b3b3",
            },
            type: "category",
            boundaryGap: true,
            axisLabel: {
              fontSize: getRem(14),
              color: "#b3b3b3",
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitLine,
            data: this.chartData[this.chartIndex].map((item) => item.name),
          },
        ],
        yAxis: [
          {
            name: "漏洞数",
            nameTextStyle: {
              fontSize: getRem(14),
              color: "#b3b3b3",
            },
            minInterval: 1,
            type: "value",
            axisLabel: {
              fontSize: getRem(14),
              color: "#b3b3b3",
            },
            axisLine: {
              show: false,
            },
            axisTick,
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "rgba(247, 191, 119, .2)",
                width: 1,
              },
            },
          },
        ],
        series: seriesArr,
      };

      // 开启数据缩放
      let dataZoom = [
        {
          type: "inside",
          show: true,
          xAxisIndex: [0],
          start: this.start,
          end: this.end,
          // zoomOnMouseWheel: false,
          // preventDefaultMouseMove: true,
        },
      ];

      if (this.chartData[2].lenght >= 15) {
        option.dataZoom = dataZoom;
      }

      chart.setOption(option, true);
      window.addEventListener("resize", () => {
        chart.resize();
      });
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      if (this.start >= 70) {
        this.start = 0;
      }
      if (this.end >= 100) {
        this.end = 30;
      }
      this.start = this.start + 5;
      this.end = this.end + 5;
    }, 3000);
  },
  watch: {
    chartIndex(a, b) {
      if (a !== b) {
        this.initChart();
      }
    },
    chartData() {
      this.initChart();
    },
  },

  created() {
    this.axios.get("/riskBigScreen/findFlawCount").then(({ data }) => {
      console.log("data", data.data);
      for (let key in data.data) {
        this.chartData.push(
          data.data[key].reverse().map((item) => {
            if (key == "weeks") {
              return {
                name:
                  item.weeks.slice(0, 4) + "年第" + item.weeks.slice(4) + "周",
                app: item.appFlaw,
                host: item.hostFlaw,
              };
            } else if (key == "months") {
              return {
                name: item.months.slice(0, 4) + "." + item.months.slice(4),
                app: item.appFlaw,
                host: item.hostFlaw,
              };
            } else {
              return {
                name:
                  item.days.slice(0, 4) +
                  "." +
                  item.days.slice(4, 6) +
                  "." +
                  item.days.slice(6),
                app: item.appFlaw,
                host: item.hostFlaw,
              };
            }
          })
        );
      }
      console.log("test2", this.chartData);
    });
  },
};
</script>