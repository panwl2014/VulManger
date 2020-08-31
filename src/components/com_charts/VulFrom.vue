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
  props: ["chartData"],
  data() {
    return {
      title: "漏洞来源分布",
      colorList: [
        "#d3c1ff",
        "#fd877f",
        "#ffd678",
        "#80baff",
        "#f3c2e3",
        "#95cfa1",
      ],
    };
  },
  methods: {
    initChart() {
      const chart = this.$echarts.init(this.$refs.chart);
      let me = this;
      let option = {
        color: this.colorList,
        tooltip: tooltip[0],
        legend: {
          orient: "vertical",
          left: "45%",
          top: "center",
          icon: "react",
          height: "100%",
          itemWidth: getRem(16),
          itemHeight: getRem(11),
          itemGap: getRem(30),
          textStyle: {
            color: "#808080",
            fontSize: getRem(19),
            rich: {
              name: {
                padding: [0, 0, 0, 5],
                fontSize: getRem(19),
                width: getRem(150),
                align: "left",
                // backgroundColor: 'orange'
              },
              value: {
                fontSize: getRem(19),
                width: getRem(70),
                align: "right",
                //   backgroundColor: 'red'
              },
            },
          },
          formatter(name) {
            let data = option.series[0].data;
            let num = 0;
            let cur_nums = 0;
            for (let i = 0; i < data.length; i++) {
              if (name == data[i].name) {
                cur_nums = data[i].rate;
              }
            }
            num = "{name|" + name + "}" + "{value|" + cur_nums + "}";
            return num;
          },
        },
        series: [
          {
            name: "",
            type: "pie",
            //   roseType: "radius",
            radius: ["40%", "60%"],
            center: ["23%", "50%"],
            avoidLabelOverlap: false,
            //   hoverAnimation: false,
            color: me.colorList,
            label: {
              normal: {
                padding: [5, 0, 0, 0],
                textStyle: {
                  color: "#666666",
                  fontSize: getRem(16),
                  lineHeight: getRem(30),
                },
                formatter: function () {
                  return `漏洞(个)\n${me.chartData.reduce(
                    (prev, item) => prev + item.value,
                    0
                  )}`;
                },
                position: "center",
                show: true,
              },
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