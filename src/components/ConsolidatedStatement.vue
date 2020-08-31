<template>
  <div class="page">
    <!-- <div class="tem" v-html="pdfCentent">111</div> -->
    <!-- <el-button type="primary" class="btn" size @click="downPage1">保存</el-button> -->
    <!-- <el-button type="primary" class="btn" size @click="downPage2">保存</el-button> -->
    <!-- <el-button type="primary" class="btn" size="" @click="downPage">保存</el-button> -->
    <!-- <el-button type="primary" class="btn" size="" v-print="'#pdfCentent'">保存</el-button> -->
    <el-button type="primary" class="btn" size="" @click="ExportSavePdf(htmlTitle,nowTime)">保存</el-button>
    <div class="pdfCentent" id="pdfCentent" ref="content">
      <h2>漏洞管理安全评估综合报表</h2>
      <img class="logo" src="../../static/imgs/logo.png" alt />
      <!-- 主机资产统计分布 -->
      <div class="part-host">
        <p class="title-1">1.主机资产统计分布</p>
        <div class="chart-host-top chart-box">
          <HosTrisklLevel :chartData="HosTrisklLevelData"></HosTrisklLevel>
        </div>
        <div class="chart-host-lv chart-box">
          <HosTrisklTop :chartData="HosTrisklToplData"></HosTrisklTop>
        </div>
      </div>
      <div class="part-host-info">
        <div class="title-2">主机风险等级分布</div>
        <asset-table
          class="my-tabel"
          :tableTitle="hostLv.tabTitle"
          border
          :tableData="hostLv.tabData"
        ></asset-table>
        <div class="title-2">主机风险排名TOP10</div>
        <asset-table
          class="my-tabel"
          :tableTitle="hostTop.tabTitle"
          border
          :tableData="hostTop.tabData"
        ></asset-table>
      </div>

      <!-- 漏洞风险统计分布 -->
      <div class="part-vul">
        <p class="title-1">2.漏洞风险统计分布</p>
        <div class="chart-box">
          <VulLevel :chartData="VulLevelData"></VulLevel>
        </div>
        <div class="chart-box">
          <VulNameTop :chartData="VulNameTopData"></VulNameTop>
        </div>
        <div class="chart-box">
          <VulTypeTop :chartData="VulTypeTopData"></VulTypeTop>
        </div>
      </div>
      <div class="part-host-info">
        <div class="title-2">漏洞等级分布</div>
        <asset-table
          class="my-tabel"
          :tableTitle="vulLv.tabTitle"
          border
          :tableData="vulLv.tabData"
        ></asset-table>
        <div class="title-2">漏洞名称排名TOP10</div>
        <asset-table
          class="my-tabel"
          :tableTitle="vulNameTop.tabTitle"
          border
          :tableData="vulNameTop.tabData"
        ></asset-table>
        <div class="title-2">漏洞类型排名TOP10</div>
        <asset-table
          class="my-tabel"
          :tableTitle="vulTypeTop.tabTitle"
          border
          :tableData="vulTypeTop.tabData"
        ></asset-table>
      </div>

      <!-- 漏洞扫描工具统计分布 -->
      <div class="part-vul-scan-tool">
        <p class="title-1">3.漏洞扫描工具统计分布</p>
        <div class="chart-box">
          <VulFrom :chartData="VulFromData"></VulFrom>
        </div>
        <div class="chart-box">
          <VulScanTool :chartData="VulScanToolData"></VulScanTool>
        </div>
      </div>
      <div class="part-host-info">
        <div class="title-2">漏洞来源分布</div>
        <asset-table
          v-if="vulFrom.tabTitle && vulFrom.tabTitle"
          class="my-tabel"
          :tableTitle="vulFrom.tabTitle"
          border
          :tableData="vulFrom.tabData"
        ></asset-table>
        <div class="title-2">漏洞扫描工具对比（风险主机TOP10）</div>
        <asset-table
          v-if="VulScanTool.tabTitle.length != 0"
          class="my-tabel"
          :tableTitle="VulScanTool.tabTitle"
          border
          :tableData="VulScanTool.tabData"
        ></asset-table>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.tem {
  width: 100%;
  height: 1000px;
  background-color: red;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.part-title {
  margin-bottom: 10px;
  text-align: left;
  span {
    color: "#FFF";
  }
  position: relative;
  height: 20rem;
  line-height: 20rem;
  color: #666666;
  font-weight: bold;
  font-size: 20rem;
  border-left: 5rem solid #0e76d7;
  padding-left: 10rem;
}
.chart {
  width: 100%;
  height: calc(100% - 40rem);
}
.no-data {
  z-index: 1000;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(196, 196, 196);
  font-size: 14rem;
}
</style>


<style lang="scss" scoped>
// 图表容器
.btn {
  position: fixed;
  text-align: center;
  width: 400px;
  height: 60px;
  bottom: 50px;
  z-index: 1000;
  left: 0;
  right: 0;
  margin: auto;
  font-size: 20px;
}
.chart-box {
  border-radius: 5px;
  border: 1px solid rgba(204, 204, 204, 0.4);
  // box-shadow: 1px 2px 16px 0px rgba(204, 204, 204, 0.4);
  padding-left: 20px;
  padding-top: 20px;
  position: relative;
  padding-right: 10px;
}
// 大标题test
.title-1 {
  padding-left: 20px;
  font-size: 26rem;
  line-height: 60rem;
  height: 60rem;
  background-color: #7f838e;
  color: #fff;
  text-align: left;
  margin-bottom: 30px;
}
// 小标题
.title-2 {
  padding-left: 20px;
  font-size: 20rem;
  line-height: 60rem;
  height: 60rem;
  color: #333;
  text-align: left;
}
// 数据表格
.my-tabel {
  margin-bottom: 100px;
}
.page {
  width: 100%;
  .pdfCentent {
    margin-left: -750px;
    position: relative;
    left: 50%;
    width: 1500px;
    background-color: #fff;
    padding: 20px;
    h2 {
      text-align: center;
      font-size: 52px;
      color: #333;
      margin-top: 50px;
      line-height: 100px;
      margin-bottom: 200px;
    }
    .logo {
      position: absolute;
      top: 50px;
      left: 50px;
      width: 200px;
    }
    .part-host {
      margin-bottom: 50px;
      p {
        width: 100%;
      }
      flex-wrap: wrap;
      display: flex;
      width: 100%;
      .chart-host-top {
        width: 40%;
        height: 350px;
      }
      .chart-host-lv {
        flex: 1;
        margin-left: 20px;
        height: 350px;
      }
    }
    .part-vul {
      display: flex;
      flex-wrap: wrap;
      p {
        width: 100%;
      }
      & .chart-box:nth-of-type(2) {
        margin: 0 20px;
      }
      .chart-box {
        width: 30%;
        height: 400px;
        flex: 1;
        .chart {
        }
      }
    }
    .part-vul-scan-tool {
      display: flex;
      flex-wrap: wrap;
      p {
        width: 100%;
      }
      & .chart-box:first-of-type {
        width: 40%;
        height: 300px;
        margin-right: 20px;
      }
      & .chart-box:last-of-type {
        flex: 1;
        height: 300px;
      }
    }
  }
}
</style>
<script>
import Vue from "vue";
import htmlToPdf from "../assets/js/htmlToPdf";
import vueToPdf from 'vue-to-pdf';
import Print from 'vue-print-nb';

Vue.use(Print);
Vue.use(vueToPdf);
Vue.use(htmlToPdf);

import "../assets/js/flexible";
import AssetTable from "./components/AssetTable";
import HosTrisklTop from "../components/com_charts/HosTrisklTop";
import HosTrisklLevel from "../components/com_charts/HosTrisklLevel";
import VulLevel from "../components/com_charts/VulLevel";
import VulNameTop from "../components/com_charts/VulNameTop";
import VulTypeTop from "../components/com_charts/VulTypeTop";
import VulFrom from "../components/com_charts/VulFrom";
import VulScanTool from "../components/com_charts/VulScanTool";

export default {
  components: {
    HosTrisklTop,
    HosTrisklLevel,
    VulLevel,
    VulNameTop,
    VulTypeTop,
    VulScanTool,
    VulFrom,
    AssetTable,
  },
  methods: {
    downPage() {
      window.print();
    },
    downPage1() {
      this.axios
        .get("index.html#/assetreportDownpage")
        .then((res) => console.log(res.data));
    },
    downPage2() {
      let pdfCentent = document.getElementsByTagName("html")[0];
    },
    createPDf() {
      setTimeout(() => {
        console.log(233, document.documentElement.outerHTML)
        this.axios
          .post("/report/findFlawLvCount", { html:  document.documentElement.outerHTML})
          .then(({ data }) => {
            console.log(data)
          });
      }, 3000);
    },
  },
  data() {
    return {
      pdfCentent: "",
      VulScanTool: {
        tabTitle: [],
        tabData: [],
      },
      hostLv: {
        tabTitle: [
          { key: "1", label: "非常危险", is_show: true, text_algin: "center" },
          { key: "2", label: "比较危险", is_show: true, text_algin: "center" },
          { key: "3", label: "比较安全", is_show: true, text_algin: "center" },
          { key: "4", label: "非常安全", is_show: true, text_algin: "center" },
          { key: "0", label: "总计", is_show: true, text_algin: "center" },
        ],
        tabData: [],
      },
      hostTop: {
        tabTitle: [
          {
            key: "host",
            label: "主机资产IP",
            is_show: true,
            text_algin: "center",
          },
          { key: "counts", label: "总计", is_show: true, text_algin: "center" },
        ],
        tabData: [{ host: 1, counts: 1111 }],
      },
      vulLv: {
        tabTitle: [
          {
            key: "highNum",
            label: "高危",
            is_show: true,
            text_algin: "center",
          },
          {
            key: "inDangerNum",
            label: "中危",
            is_show: true,
            text_algin: "center",
          },
          {
            key: "lowRiskNum",
            label: "低危",
            is_show: true,
            text_algin: "center",
          },
          { key: "counts", label: "总计", is_show: true, text_algin: "center" },
        ],
        tabData: [],
      },
      vulNameTop: {
        tabTitle: [
          {
            key: "flawName",
            label: "漏洞名称",
            is_show: true,
            text_algin: "center",
          },
          {
            key: "flawNum",
            label: "总计",
            is_show: true,
            text_algin: "center",
          },
        ],
        tabData: [],
      },
      vulTypeTop: {
        tabTitle: [
          {
            key: "flawName",
            label: "漏洞类型",
            is_show: true,
            text_algin: "center",
          },
          {
            key: "flawNum",
            label: "总计",
            is_show: true,
            text_algin: "center",
          },
        ],
        tabData: [],
      },
      vulFrom: {
        tabTitle: "",
        tabData: "",
      },
      htmlTitle: "PDF名称",
      nowTime: "2020.8.6",
      tableTitle: [
        {
          key: "a",
          label: "aa",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "b",
          label: "bb",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "c",
          label: "cc",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "d",
          label: "dd",
          is_show: true,
          text_algin: "center",
        },
      ],
      tableData: [{ a: "111", b: "222", c: "333", d: "444" }],
      HosTrisklLevelData: [],
      HosTrisklToplData: [],
      VulLevelData: "",
      VulNameTopData: [],
      VulTypeTopData: [],
      VulFromData: [],
      VulScanToolData: [],
    };
  },
  created() {
    // assetType=3&importStartTime=2020-08-11 12:00:00&importEndTime=2020-08-21 12:00:00&handleStatuss=1,2,3,4,5,6&flawTypes=0,1,2&deptId=1&assetList=
    let filtersSelf = Vue.filter("RiskSrcFilter");
    let routerData = JSON.parse(this.$route.query.ids);

    let queryData = {
      assetType: routerData.assetType,
      importEndTime:
        new Date(routerData.importTimeEnd)
          .toLocaleDateString()
          .replace(/\//g, "-") + " 00:00:00",
      importStartTime:
        new Date(routerData.importTimeStart)
          .toLocaleDateString()
          .replace(/\//g, "-") + " 23:59:59",
      handleStatuss: routerData.handleStatus,
      flawTypes: routerData.flawType,
      deptId: routerData.deptId,
      assetList: routerData.assetRange,
      assetRange: routerData.assetRange,
    };
    let qs_QueryData = this.qs.stringify(queryData);

    //   主机风险等级
    this.axios
      .post("/report/findAseFlawLv", qs_QueryData)
      .then(({ data }) => {
        let dataArr = [];
        let arr1 = [];
        let arr2 = [];
        let arr3 = [];
        let arr4 = [];
        data.data.map((item) => {
          if (
            item.highNum == 0 &&
            item.inDangerNum == 0 &&
            item.lowRiskNum == 0
          ) {
            arr1.push(item);
          } else if (
            item.highNum == 0 &&
            item.inDangerNum <= 2 &&
            item.lowRiskNum <= 2
          ) {
            arr2.push(item);
          } else if (item.highNum <= 2 || 3 <= item.inDangerNum <= 5) {
            arr3.push(item);
          } else if (item.highNum >= 3 && item.inDangerNum >= 5) {
            arr4.push(item);
          }
        });
        dataArr.push({
          name: "主机资产",
          value: data.data.length,
        });
        dataArr.push({
          name: "非常危险",
          value: arr4.length,
        });
        dataArr.push({
          name: "比较危险",
          value: arr3.length,
        });
        dataArr.push({
          name: "比较安全",
          value: arr2.length,
        });
        dataArr.push({
          name: "非常安全",
          value: arr1.length,
        });
        this.HosTrisklLevelData = dataArr;
        let obj = {};
        dataArr.forEach((item, index) => {
          obj[index] = item.value;
        });
        this.hostLv.tabData = [obj];
      });

    // 主机风险排名TOP10 riskBigScreen/findHostFlawTop
    this.axios
      .post("/report/findHostFlawTop", qs_QueryData)
      .then(({ data }) => {
        this.hostTop.tabData = data.data;
        this.HosTrisklToplData = data.data.map((item) => {
          return { name: item.host, value: item.counts };
        });
      });

    // 漏洞等级分布
    this.axios
      .post("/report/findFlawLvCount", qs_QueryData)
      .then(({ data }) => {
        this.vulLv.tabData = [data.data];
        this.VulLevelData = [
          { name: "漏洞总数", value: data.data.counts },
          { name: "高危", value: data.data.highNum },
          { name: "中危", value: data.data.inDangerNum },
          { name: "低危", value: data.data.lowRiskNum },
        ];
      });

    // 漏洞名称排名TOP10
    this.axios
      .post("/report/findFlawNameRankTop", qs_QueryData)
      .then(({ data }) => {
        this.vulNameTop.tabData = data.data;
        this.VulNameTopData = data.data.map((item) => ({
          name: item.flawName,
          value: item.flawNum,
        }));
      });

    // 漏洞类型排名TOP10
    this.axios
      .post("/report/findFlawTypeRankTop", qs_QueryData)
      .then(({ data }) => {
        this.vulTypeTop.tabData = data.data;
        let all = data.data.reduce((prev, item) => item.flawNum + prev, 0);
        this.VulTypeTopData = data.data.map((item) => {
          switch (item.flawType) {
            case 0:
              return {
                name: "主机漏洞",
                value: item.flawNum,
                rate: ((item.flawNum / all) * 100).toFixed(2) + "%",
              };
              break;
            case 1:
              return {
                name: "应用漏洞",
                value: item.flawNum,
                rate: ((item.flawNum / all) * 100).toFixed(2) + "%",
              };
              break;

            case 2:
              return {
                name: "基线漏洞",
                value: item.flawNum,
                rate: ((item.flawNum / all) * 100).toFixed(2) + "%",
              };
              break;

            default:
              return {
                name: "未知漏洞",
                value: item.flawNum,
                rate: ((item.flawNum / all) * 100).toFixed(2) + "%",
              };
              break;
          }
        });
      });

    // 漏洞来源分布 riskBigScreen/findFlawSource
    this.axios
      .post("/report/findFlawSource", qs_QueryData)
      .then(({ data }) => {
        let all = data.data.reduce((prev, item) => item.count + prev, 0);
        this.VulFromData = data.data.map((item) => {
          return {
            // name: item.source ? item.source.trim() : "未知来源",
            name: filtersSelf(item.source)
              ? filtersSelf(item.source)
              : "来源待处理",
            value: item.count,
            rate: ((item.count / all) * 100).toFixed(2) + "%",
          };
        });
        let nameObj = {};
        let valueObj = {};
        this.VulFromData.forEach((item, index) => {
          nameObj[index] = item.name;
          valueObj[index] = item.value;
        });
        let labelArr = [];
        for (let key in nameObj) {
          labelArr.push({
            key: key,
            label: nameObj[key],
            is_show: true,
            text_algin: "center",
          });
        }
        this.vulFrom.tabData = [valueObj];
        this.vulFrom.tabTitle = labelArr;
      });

    // 漏洞扫描工具对比 riskBigScreen/findFlawSourceCompared
    this.axios
      .post("/report/findFlawSourceCompared", qs_QueryData)
      .then(({ data }) => {
        let dataArr = [];
        // 过滤没有意义的IP
        let arr = data.data.filter((item) => item.hostData.length !== 0);
        // 根据扫描工具数量排序
        let arr1 = arr.sort((a, b) => {
          return b.hostData.length - a.hostData.length;
        });
        // 获取扫描工具数量
        let typeNum = arr1[0].hostData.length;
        // 循环输出二维数组
        for (let i = 0; i < typeNum; i++) {
          let arr2 = arr1.map((item) => {
            return {
              name: item.hostData[0].ip,
              value: item.hostData[i] ? item.hostData[i].count : 0,
              flaw_source: item.hostData[i]
                ? item.hostData[i].flaw_source
                : null,
            };
          });
          dataArr.push(arr2);
          this.VulScanToolData = dataArr;
        }
        this.VulScanTool.tabData = arr1;

        this.VulScanTool.tabTitle.push({
          key: "ip",
          label: "风险主机",
          is_show: true,
          text_algin: "center",
        });
        arr1[0].hostData.forEach((item) => {
          this.VulScanTool.tabTitle.push({
            key: item.flaw_source,
            label: filtersSelf(item.flaw_source),
            is_show: true,
            text_algin: "center",
          });
        });

        let listArr = [];
        arr1.forEach((item) => {
          let obj = {};
          item.hostData.forEach((item1) => {
            obj[item1.flaw_source] = item1.count;
            obj["ip"] = item1.ip;
          });
          listArr.push(obj);
        });
        this.VulScanTool.tabData = listArr;

      });
  },
  mounted() {
    this.createPDf();
    // setTimeout(() => {
    //   this.$PDFSave(this.$refs['content'], '我的文件')
    // }, 2000);
  },
};
</script>