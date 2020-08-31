<template>
  <div class="com">
    <p class="part-title">
      <span>{{title}}</span>
    </p>
    <div class="chart" ref="chart"></div>
    <!-- <div class="no-data" v-if="chartData.length == 0">暂无数据</div> -->
  </div>
</template>
<style lang="scss" scoped>
.com {
  width: 100%;
  height: 100%;
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
      title: "主机风险排名TOP10",
      colorList1: [
        "rgba(255, 237, 127,1)",
        "rgba(244, 132, 124,1)",
        "rgba(125, 185, 255,1)",
        "rgba(149, 207, 161,1)",
      ],
    };
  },
  methods: {
    initChart() {
      let chart = this.$echarts.init(this.$refs.chart);
      let me = this;
      let option = {
        tooltip: tooltip[1],
        grid: {
          top: "10%",
          left: "2%",
          bottom: "5%",
          right: "10%",
          containLabel: true,
        },
        xAxis: [
          {
            name: "主机IP",
            nameTextStyle,
            type: "category",
            data: this.chartData.map((item) => item.name),
            axisTick,
            axisLabel: {
              // rotate: "10",
              interval: 0,
              show: true,
              fontSize: getRem(16),
              color: "#666",
              formatter: function (params) {
                var newParamsName = "";
                var paramsNameNumber = params.length;
                var provideNumber = 6; //一行显示几个字
                if (me.chartData.length > 5) {
                  return "..." + params.slice(params.length - provideNumber);
                } else {
                  return params;
                }
              },
            },
            axisLine: {
              show: false,
            },
            axisTick,
            splitLine,
          },
        ],
        yAxis: [
          {
            minInterval: 1,
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
        series: [
          {
            name: "漏洞个数",
            type: "bar",
            barWidth: "20%",
            label: {
              fontSize: getRem(15),
              show: true,
              position: "insideTop",
            },
            data: this.chartData.map((item) => ({
              name: item.name,
              value: item.value,
            })),
            itemStyle: {
              normal: {
                color: "#7fb3e7",
              },
            },
          },
        ],
      };

      chart.setOption(option);
      window.addEventListener("resize", () => {
        chart.resize();
      });
    },
  },
  mounted() {
    this.initChart();
  },
  watch: {
    chartData(a, b) {
      if (a != b) {
        this.initChart();
      }
    },
  },
};
</script>