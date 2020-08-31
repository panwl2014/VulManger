<template>
  <div class="com" @mouseenter="mouseEnter" @mouseleave="mouseLeave" v-if="chartData">
    <p class="part-title">
      <span>{{title}}</span>
      <span class="tab-bar" @click="changeTab">
        <span :class="isCheck == 'day' ? 'active': ''" :data-index="'day'">日</span>
        <span :class="isCheck == 'week' ? 'active': ''" :data-index="'week'">周</span>
        <span :class="isCheck == 'month' ? 'active': ''" :data-index="'month'">月</span>
      </span>
    </p>
    <div class="chart" ref="chart"></div>
    <!-- <div class="no-data" v-if="chartData[0].length == 0">暂无数据</div> -->
  </div>
</template>
<style lang="scss" scoped>
.com {
  width: 100%;
  height: 100%;
  .part-title {
    position: relative;
    .tab-bar {
      position: absolute;
      right: 0;
      top: -9rem;
      margin-right: 40rem;
      width: 150rem;
      height: 40rem;
      display: flex;
      border-radius: 4rem;
      & span:nth-of-type(2) {
        border-top: solid 1rem #b3b3b3;
        border-bottom: solid 1rem #b3b3b3;
      }
      & span:nth-of-type(3) {
        border: solid 1rem #b3b3b3;
        border-radius: 0 4rem 4rem 0;
      }
      & span:nth-of-type(1) {
        border: solid 1rem #b3b3b3;
        border-radius: 4rem 0 0 4rem;
      }
      span {
        text-align: center;
        font-size: 19rem;
        font-weight: normal;
        color: #808080;
        flex: 1;
        line-height: 40rem;
        &.active {
          color: #0e76d7;
          border: 1rem solid #0e76d7;
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
  props: ["chartData"],
  data() {
    return {
      // 2 日、 0 周、 1月
      chartIndex: 2,
      title: "漏洞数量趋势",
      colorList: [
        {
          start: "rgba(240, 83, 120,.3)",
          end: "rgba(240, 83, 120,0)",
          line: "rgba(240, 83, 120,1)",
        },
        {
          start: "rgba(246, 194, 61,.3)",
          end: "rgba(246, 194, 61,0)",
          line: "rgba(246, 194, 61,1)",
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
      nameList: ["高危漏洞", "中危漏洞", "低危漏洞"],
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
                return item.l;
                break;
              case 1:
                return item.m;
                break;
              case 2:
                return item.h;
                break;
            }
          }),
        });
      });
      let option = {
        tooltip: tooltip[1],
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
          right: "7%",
          top: "10%",
          bottom: "5%",
          containLabel: true,
        },
        xAxis: [
          {
            name: "日期",
            nameTextStyle,
            type: "category",
            boundaryGap: true,
            axisLabel,
            axisLine,
            axisTick: {
              show: true,
            },
            splitLine,
            data: this.chartData[this.chartIndex].map((item) => item.name),
          },
        ],
        yAxis: [
          {
            minInterval: 1,
            name: "漏洞数",
            nameTextStyle,
            type: "value",
            axisLabel,
            axisLine: {
              show: false,
            },
            axisTick,
            splitLine: {
              show: true,
              lineStyle: {
                type: "dashed",
                color: "rgba(214, 208, 220, 1)",
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
          zoomOnMouseWheel: false,
          preventDefaultMouseMove: true,
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
    this.initChart();
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
    chartData(a, b) {
      if (a !== b) {
        this.initChart();
      }
    },
  },
};
</script>