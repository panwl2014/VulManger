<template>
  <div class="vul-analysis">
    <div class="fliter" v-if="isSysemUser">
      <el-select v-model="checkDeptId" placeholder="请选择">
        <el-option
          v-for="item in DeptList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
          :disabled="item.disabled"
        ></el-option>
      </el-select>
    </div>
    <div class="part-top1">
      <li ref="vul_level">
        <VulLevel :chartData="VulLevelData"></VulLevel>
      </li>
      <li ref="vul_name_top">
        <VulNameTop :chartData="VulNameTopData"></VulNameTop>
      </li>
      <li ref="vul_type-top">
        <VulTypeTop :chartData="VulTypeTopData"></VulTypeTop>
      </li>
    </div>
    <div class="part-top2" ref="vul_trend">
      <VulTrend :chartData="VulTrendData"></VulTrend>
    </div>
    <div class="part-top3">
      <li>
        <HosTrisklLevel :chartData="HosTrisklLevelData"></HosTrisklLevel>
      </li>
      <li>
        <HosTrisklTop :chartData="HosTrisklToplData"></HosTrisklTop>
      </li>
    </div>
    <div class="part-top4">
      <li>
        <VulFrom :chartData="VulFromData"></VulFrom>
      </li>
      <li>
        <VulScanTool :chartData="VulScanToolData" :length="toolLength"></VulScanTool>
      </li>
    </div>
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  list-style: none;
  box-sizing: border-box;
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
.text-overflow {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.part-title {
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
  //   border: 1rem solid red;
  margin-top: 20rem;
}
</style>

<style lang="scss" scoped>
.vul-analysis {
  width: 100%;
  padding-top: 10rem;
  .fliter {
    width: 350rem;
    position: absolute;
    right: 250px;
    top: 10px;
  }
  & > div {
    li {
      position: relative;
      padding: 20rem;
      background-color: #fff;
      border-radius: 7rem;
      box-shadow: 1px 2px 16px 0px rgba(204, 204, 204, 0.4);
    }
    display: flex;
    margin-bottom: 20rem;
    justify-content: space-between;
    & li:not(:last-of-type) {
      margin-right: 20rem;
    }
    & li:first-of-type {
      margin-left: 10rem;
    }
  }
  .part-top1 {
    li {
      height: 406rem;
      width: 33.33%;
    }
  }
  .part-top2 {
    position: relative;
    width: calc(100% - 10rem);
    height: 548px;
    margin-left: 10rem;
    padding: 20rem;
    background-color: #fff;
    border-radius: 7rem;
    box-shadow: 1px 2px 16px 0px rgba(204, 204, 204, 0.4);
  }
  .part-top3,
  .part-top4 {
    & li:first-of-type {
      width: 35%;
      height: 387rem;
    }
    & li:last-of-type {
      flex: 1;
      height: 387rem;
    }
  }
}
</style>

<script>
import Vue from "vue";
import "../../assets/js/flexible";
import VulLevel from "../com_charts/VulLevel";
import VulNameTop from "../com_charts/VulNameTop";
import VulTypeTop from "../com_charts/VulTypeTop";
import VulTrend from "../com_charts/VulTrend";
import HosTrisklLevel from "../com_charts/HosTrisklLevel";
import VulFrom from "../com_charts/VulFrom";
import HosTrisklTop from "../com_charts/HosTrisklTop";
import VulScanTool from "../com_charts/VulScanTool";


export default {
  components: {
    VulLevel,
    VulNameTop,
    VulTypeTop,
    VulTrend,
    HosTrisklLevel,
    VulFrom,
    HosTrisklTop,
    VulScanTool,
  },

  data() {
    return {
      toolLength: "",
      isSysemUser: false,
      checkDeptId: 0,
      userDeptId: "",
      DeptList: "",
      VulLevelData: "",
      VulNameTopData: [],
      VulTypeTopData: [],
      VulTrendData: [],
      HosTrisklLevelData: [],
      HosTrisklToplData: [],
      VulFromData: [],
      VulScanToolData: "",
    };
  },
  methods: {
    mapName(e) {
      let RiskSrcList = {
        normal: "标准模板导入",
        nsfocus: "绿盟极光导入",
        nusass: "Nessus导入",
        tianjin: "天镜导入",
        moan: "默安云导入",
        manual: "手动添加",
      };
      if (RiskSrcList[e]) {
        return RiskSrcList[e];
      } else {
        return e;
      }
    },
    getData() {
      let filtersSelf = Vue.filter('RiskSrcFilter');
      let deptUrl =
        "?deptId=" + (this.checkDeptId == 0 ? "" : this.checkDeptId);
      // 漏洞等级分布
      this.axios
        .get("/riskBigScreen/findFlawLvCount" + deptUrl)
        .then(({ data }) => {
          this.VulLevelData = [
            { name: "漏洞总数", value: data.data.counts },
            { name: "高危", value: data.data.highNum },
            { name: "中危", value: data.data.inDangerNum },
            { name: "低危", value: data.data.lowRiskNum },
          ];
        });

      // 漏洞名称排名TOP10
      this.axios
        .get("/riskBigScreen/findFlawNameRankTop" + deptUrl)
        .then(({ data }) => {
          this.VulNameTopData = data.data.map((item) => ({
            name: item.flawName,
            value: item.flawNum,
          }));
        });

      // 漏洞类型排名TOP10
      this.axios
        .get("/riskBigScreen/findFlawTypeRankTop" + deptUrl)
        .then(({ data }) => {
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

      // 漏洞数量趋势 riskBigScreen/findFlawNumDay
      this.axios
        .get("/riskBigScreen/findFlawNumDay" + deptUrl)
        .then(({ data }) => {
          let dataArr = [];
          for (let key in data.data) {
            dataArr.push(
              data.data[key].reverse().map((item) => {
                if (key == "weeks") {
                  return {
                    name:
                      item.weeks.slice(0, 4) +
                      "年第" +
                      item.weeks.slice(4) +
                      "周",
                    h: item.highNum,
                    l: item.lowRiskNum,
                    m: item.inDangerNum,
                  };
                } else if (key == "months") {
                  return {
                    name: item.months.slice(0, 4) + "." + item.months.slice(4),
                    h: item.highNum,
                    l: item.lowRiskNum,
                    m: item.inDangerNum,
                  };
                } else if (key == "day") {
                  return {
                    name:
                      item.days.slice(0, 4) +
                      "." +
                      item.days.slice(4, 6) +
                      "." +
                      item.days.slice(6),
                    h: item.highNum,
                    l: item.lowRiskNum,
                    m: item.inDangerNum,
                  };
                }
              })
            );
          }

          this.VulTrendData = dataArr;
        });

      // 主机风险等级分布 riskBigScreen/findAseFlawLv
      this.axios
        .get("/riskBigScreen/findAseFlawLv" + deptUrl)
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
        });

      // 主机风险排名TOP10 riskBigScreen/findHostFlawTop
      this.axios
        .get("/riskBigScreen/findHostFlawTop" + deptUrl)
        .then(({ data }) => {
          this.HosTrisklToplData = data.data.map((item) => {
            return { name: item.host, value: item.counts };
          });
        });

      // 漏洞来源分布 riskBigScreen/findFlawSource
      this.axios
        .get("/riskBigScreen/findFlawSource" + deptUrl)
        .then(({ data }) => {
          let all = data.data.reduce((prev, item) => item.count + prev, 0);
          this.VulFromData = data.data.map((item) => {
            return {
              // name: item.source ? item.source.trim() : "未知来源",
              name: filtersSelf(item.source) ? filtersSelf(item.source): '来源待处理',
              value: item.count,
              rate: ((item.count / all) * 100).toFixed(2) + "%",
            };
          });

          console.log(99999, this.VulFromData);
        });

      // 漏洞扫描工具对比 riskBigScreen/findFlawSourceCompared
      this.axios
        .get("/riskBigScreen/findFlawSourceCompared" + deptUrl)
        .then(({ data }) => {
          let dataArr = [];
          let arr = "";
          let arr1 = "";
          // 过滤没有意义的IP
          if (data.data.length != 0) {
            arr = data.data.filter((item) => item.hostData.length !== 0);
            // 根据扫描工具数量排序
            arr1 = arr.sort((a, b) => {
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
            }
            this.VulScanToolData = JSON.parse(JSON.stringify(dataArr));
            this.toolLength = this.VulScanToolData.length;
          } else {
            this.VulScanToolData = "";
            this.toolLength = this.VulScanToolData.length;
          }
        });
    },
  },
  computed: {},
  created() {
    this.axios.get("/login/getUser").then(({ data }) => {
      console.log("user", data.data);
      this.userDeptId = data.data.user.deptid;
      this.isSysemUser = data.data.user.id == 1 ? true : false;
      this.checkDeptId = this.isSysemUser ? 0 : data.data.user.deptid;

      if (this.isSysemUser) {
        this.getData();
      }
    });

    this.axios.get("/dept/loadDeptManagerLeftTreeJson").then(({ data }) => {
      console.log("list", data.data);
      this.DeptList = data.data.map((item) => {
        if (this.isSysemUser) {
          return { value: item.id, label: item.title, disabled: false };
        } else {
          return {
            value: item.id,
            label: item.title,
            disabled: this.userDeptId == item.id ? false : true,
          };
        }
      });
      this.DeptList.unshift({ value: 0, label: "全部", disabled: false });
    });
  },
  watch: {
    checkDeptId(a, b) {
      this.getData();
    },
  },
};
</script>
