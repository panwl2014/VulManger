<template>
  <div class="com">
    <p class="part-title">
      <span>{{title}}</span>
    </p>
    <div class="chart" ref="chart">
      <ul>
        <li v-for="(item, index) in chartData" :key="index">
          <span class="name text-overflow" :title="item.name">{{item.name}}</span>
          <span class="bg">
            <span
              class="data animate-left"
              :style="{width: (item.value/chartData[0].value * 100) + '%'}"
            ></span>
          </span>
          <span class="value">{{item.value}}</span>
        </li>
      </ul>
    </div>
    <div class="no-data" v-if="chartData.length == 0">暂无数据</div>
  </div>
</template>
<style lang="scss" scoped>
.com {
  width: 100%;
  height: 100%;
  .chart {
    ul {
      color: "#666666";
      height: 100%;
      width: 100%;
      padding: 5rem 10rem;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      font-size: 16rem;
      li {
        width: 100%;
        height: 25rem;
        display: flex;
        justify-content: space-between;
        margin: 4rem;
        width: 100%;
        .name {
          width: 30%;
          color: #666666;
        }
        .value {
          text-align: right;
          width: 12%;
          color: #666666;
          line-height: 22rem;
        }
        .bg {
          text-align: left;
          flex: 1;
          margin: 0 10rem;
          background-color: rgba(0, 0, 0, 0.05);
          height: 8rem;
          width: 50%;
          border-radius: 8rem;
          position: relative;
          top: 7rem;
          overflow: hidden;
          .data {
            animation: animate_chart 1s ease;
            @keyframes animate_chart {
              0% {
                left: -100%;
              }
              100% {
                left: 0%;
              }
            }
            position: absolute;
            height: 100%;
            border-radius: 8rem;
            background-color: #7fb3e7;
          }
        }
      }
    }
  }
}
</style>

<script>
import config from "../com_charts/charts_config";
export default {
  props: ['chartData'],
  data() {
    return {
      title: "漏洞名称排名TOP10",
      // chartData: [
      //   { name: "SNMP漏洞扫描", value: 90 },
      //   { name: "SNMP漏洞扫描", value: 80 },
      //   { name: "SNMP漏洞扫描", value: 70 },
      //   { name: "SNMP漏洞扫描", value: 60 },
      //   { name: "SNMP漏洞扫描", value: 50 },
      //   { name: "SNMP漏洞扫描", value: 40 },
      //   { name: "SNMP漏洞扫描", value: 30 },
      //   { name: "SNMP漏洞扫描", value: 30 },
      //   { name: "SNMP漏洞扫描", value: 20 },
      //   { name: "SNMP漏洞扫描", value: 10 },
      // ],
    };
  },
};
</script>