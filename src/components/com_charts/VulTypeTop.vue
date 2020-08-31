<template>
  <div class="com">
    <p class="part-title">
      <span>{{title}}</span>
    </p>
    <div class="chart" ref="chart"></div>
    <div class="no-data" v-if="chartData.length == 0">暂无数据</div>
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

export default {
  props: ['chartData'],
  data() {
    return {
      title: "漏洞类型排名TOP10",
      colorList: [
        "#FF6F7E",
        "#FF924E",
        "#FFD57B",
        "#72BCFE",
        "#79D6A3",
        "#DCBDFF",
        "#FFBAE2",
        "#5BD3DF",
        "#B5A685",
        "#BAA9BC",
      ],
    };
  },
  methods: {
    initChart() {
      const chart = this.$echarts.init(this.$refs.chart);
    let me = this;
    let option = {
      color: this.colorList,
      // tooltip: tooltip[0],
      tooltip: {
        backgroundColor: "rgba(0,0,0,0)",
        formatter(e) {
          return `<div style="padding: 9rem 10rem 5rem 10rem; background-color: rgba(255,255,255,.9); color: #333; border-radius: 5px; box-shadow:1px 2px 28px 0px rgba(98,98,98,0.4)">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 27">
            <path id="路径_47" data-name="路径 47" d="M0,0H24V27L12.24,22.761,0,27Z" fill="${
              me.colorList[e.dataIndex]
            }"/>
             <text x="${e.dataIndex + 1 == 10 ? 3 : 8}" y="17" fill="#fff">${
            e.dataIndex + 1
          }</text>
          </svg>
          <span style="position: relative; top: -3rem; color: #333">${
            e.data.name + "：" + "   " + e.data.rate
          }</span>
          </div>`;
        },
      },
      legend: {
        orient: "vertical",
        left: "60%",
        top: "center",
        icon: "react",
        height: "100%",
        itemWidth: getRem(16),
        itemHeight: getRem(16),
        itemGap: getRem(15),
        textStyle: {
          color: "#666666",
          fontSize: getRem(16),
        },
      },
      series: [
        {
          name: "",
          type: "pie",
          radius: ["0", "50%"],
          center: ["25%", "50%"],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          color: me.colorList,
          label: {
            show: false,
          },
          // 显示文字
          emphasis: {
            label: {
              show: false,
            },
          },
          labelLine: {
            show: false,
          },
          data: this.chartData,
        },
      ],
    };
    chart.setOption(option);
    window.addEventListener("resize", () => {
      chart.resize();
    });
    }
  },
  mounted() {
    this.initChart()
  },
  watch: {
    chartData(a, b) {
      if (a != b) {
        this.initChart()
      }
    }
  }
};
</script>