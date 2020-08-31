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
      title: "漏洞等级分布",
      colorList1: [
        "rgba(244, 132, 124,1)",
        "rgba(255, 237, 127,1)",
        "rgba(125, 185, 255,1)",
      ],
      colorList2: [
        "rgba(244, 132, 124,.3)",
        "rgba(255, 237, 127,.3)",
        "rgba(125, 185, 255,.3)",
      ],
      colorList3: [
        "rgba(244, 132, 124,.05)",
        "rgba(255, 237, 127,.05)",
        "rgba(125, 185, 255,.05)",
      ],
    };
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      console.log('test5', this.chartData)
      const chart = this.$echarts.init(this.$refs.chart);
      let me = this;
      let option = {
        color: this.colorList1,
        legend: {
          orient: "vertical",
          right: "3%",
          top: "center",
          icon: "react",
          height: "100%",
          itemWidth: getRem(5),
          itemHeight: getRem(19),
          itemGap: getRem(30),
          textStyle: {
            color: "#666666",
            fontSize: getRem(19),
            rich: {
              name: {
                padding: [0, 0, 0, 5],
                fontSize: getRem(19),
                width: getRem(100),
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
                cur_nums = data[i].value;
              }
            }
            num =
              "{name|" +
              name +
              "}" +
              "{value|" +
              "【" +
              cur_nums +
              "个】" +
              "}";
            return num;
          },
        },
        series: [
          //   外层
          {
            name: "",
            type: "pie",
            radius: ["42%", "50%"],
            center: ["23%", "50%"],
            avoidLabelOverlap: false,
            hoverAnimation: false,
            color: me.colorList,
            label: {
              normal: {
                padding: [5, 0, 0, 0],
                textStyle: {
                  color: "#666666",
                  fontSize: getRem(20),
                  lineHeight: getRem(30),
                },
                formatter: function () {
                  return `${me.chartData[0].name}\n${me.chartData[0].value}`;
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
            data: this.chartData.slice(1),
          },

          // 内层
          {
            hoverAnimation: false,
            name: "",
            type: "pie",
            radius: ["17%", "25%"],
            center: ["23%", "50%"],
            avoidLabelOverlap: false,
            // 显示文字
            labelLine: {
              show: false,
            },
            label: {
              show: false,
            },
            itemStyle: {
              color: (e) => {
                return me.colorList3[e.dataIndex];
              },
            },
            data: this.chartData.slice(1),
          },
          {
            hoverAnimation: false,
            name: "",
            type: "pie",
            radius: ["30%", "38%"],
            center: ["23%", "50%"],
            avoidLabelOverlap: false,
            // 显示文字
            labelLine: {
              show: false,
            },
            label: {
              show: false,
            },
            itemStyle: {
              color: (e) => {
                return me.colorList2[e.dataIndex];
              },
            },
            data: this.chartData.slice(1),
          },
        ],
      };
      // (option.formatter = "{a} <br/>{b}: {c} ({d}%)");
      chart.setOption(option);
      window.addEventListener("resize", () => {
        chart.resize();
      });
    },
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