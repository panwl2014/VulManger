<template>
  <div class="com">
    <p class="part-title">
      <span>{{title}}</span>
    </p>
    <div class="chart" ref="chart" :style="{display: isShow}"></div>
    <div class="no-data" v-if="chartData.length == 0">暂无数据</div>
  </div>
</template>
<style lang="scss" scoped>
.com {
  width: 100%;
  height: 100%;
  position: relative;
  .chart {
    margin-top: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }
}
</style>


<script>
import Vue from 'vue';
import config from "../com_charts/charts_config";
let { tooltip, dataZoom, lineStyle, getRem } = config;
let { axisLabel, axisLine, axisTick, splitLine, nameTextStyle } = lineStyle;

export default {
  props: ["chartData"],
  data() {
    return {
      isShow: 'block',
      title: "漏洞扫描工具对比",
      colorList: ["#d3c1ff", "#fd877f", "#ffd678", "#80baff", "#f3c2e3"],
      end: 10,
      start: 0,
    };
  },
  methods: {
    initChart() {
      let filtersSelf = Vue.filter('RiskSrcFilter')
      let chart = this.$echarts.init(this.$refs.chart);
      let me = this;
      let seriesArr = [];

      this.chartData.forEach((item, index) => {
        seriesArr.push({
          name: filtersSelf(item[0].flaw_source) ? filtersSelf(item[0].flaw_source) : "来源待处理",
          type: "bar",
          barWidth: getRem(8),
          data: item,
          itemStyle: {
            normal: {
              color: this.colorList[index],
            },
          },
        });
      });
      let option = {
        legend: {
          // orient: "vertical",
          right: "3%",
          top: "0",
          width: '70%',
          icon: "react",
          height: "100%",
          itemWidth: getRem(16),
          itemHeight: getRem(11),
          itemGap: getRem(15),
          textStyle: {
            color: "#808080",
            fontSize: getRem(16),
          },
        },
        tooltip: tooltip[1],
        grid: {
          top: "20%",
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
            data: this.chartData[0].map((item) => item.name),
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

                if (me.chartData[0].length > 5) {
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
        series: seriesArr,
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
      if (this.chartData.length == 0) {
        this.isShow = 'none'
        return
      } else {
        this.isShow = 'block'
        this.initChart();
      }
    },
  },
};
</script>