<template>
  <div class="details">
    <con-title :name="titlename">
      <div style="margin-top: -45px;margin-left: 100px;">
        <vul-button size="small" @click="goback" plain>返回</vul-button>
      </div>
      <div>
        <svg class="icon" aria-hidden="true">
          <use :xlink:href="iconName" />
        </svg>
        <span class="pb-2 mt-1 risktitle" v-text="RiskInfo.flawName.value"></span>
      </div>
    </con-title>
    <el-card class="mr-1 mt-1">
      <div>
        <div class="risk-title">漏洞处置</div>
        <el-divider></el-divider>
        <flow-step :stepsList="stepsList" :finshStepId="flowPos"></flow-step>
      </div>
    </el-card>
    <el-row class="flow-box" type="flex">
      <el-col :span="span_n" v-if="stepsList2.length !== 0">
        <el-card class="mr-1 mt-1">
          <div class="flow-box2">
            <div class="risk-title">历史记录</div>
            <!-- eslint-disable-next-line -->
            <div class="coll-button" @click="IsCol = !IsCol"><</div>
            <el-divider></el-divider>
            <el-steps direction="vertical" :active="1" :space="100">
              <el-step v-for="s in stepsList2" :key="s.title">
                <template slot="icon">&nbsp;</template>
                <template slot="title">
                  【{{s.title}}】
                  <div
                    class="button_status"
                    :class="{'pass_status': s.status === '通过', 'back_status': s.status === '退回', 'finsh_status': s.status === '完成'}"
                    v-if="s.status !== '下发' && s.status !== '' && s.status !== 'null'"
                  >{{ s.status }}</div>
                </template>
                <template slot="description">
                  <div class="description">
                    <p class="text-overfllow">{{'处理人: ' + s.deptname + ' ' + s.persion}}</p>
                    <p class="text-overfllow">备注：{{ s.description }}</p>
                  </div>
                  <div class="description-date">
                    {{ s.date }}
                    <br />
                    {{ s.time }}
                  </div>
                </template>
              </el-step>
            </el-steps>
          </div>
        </el-card>
      </el-col>
      <!-- eslint-disable-next-line -->
      <div class="coll-button float-l more" :class="{'isDisaple': IsCol}" @click="IsCol = !IsCol">></div>
      <el-col :span="24 - span_n">
        <el-card class="mr-1 mt-1 riskinfo">
          <div>
            <div class="risk-title">概述</div>
            <el-divider></el-divider>
            <div class="risk-content">
              <el-form label-width="250px">
                <el-form-item v-for="d in RiskInfo" :key="d.name" :label="d.name">
                  <span v-if="d.type === 'level'">{{d.value | RiskStatusFilter}}</span>
                  <span v-else-if="d.type === 'status'">{{d.value | FlawStatusFilter}}</span>
                  <span v-text="d.value" v-else></span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="right-box">
            <div class="risk-title">风险描述</div>
            <el-divider></el-divider>
            <div class="risk-content">
              <span v-text="RiskInfo.flawDescription.value"></span>
            </div>
          </div>
          <div class="right-box">
            <div class="risk-title">风险危害</div>
            <el-divider></el-divider>
            <div class="risk-content">
              <span v-text="RiskInfo.flawHazard.value"></span>
            </div>
          </div>
          <div class="right-box">
            <div class="risk-title">风险详情</div>
            <el-divider></el-divider>
            <div class="risk-content">
              <span v-text="RiskInfo.flawDescription.value"></span>
            </div>
          </div>
          <div class="right-box">
            <div class="risk-title">修复建议</div>
            <el-divider></el-divider>
            <div class="risk-content">
              <span v-text="RiskInfo.flawSolution.value"></span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from "vue";
import ConTitle from "@/components/components/ConTitle";
import FlowStep from "@/components/components/FlowStep";

export default {
  name: "VulDetails",
  components: {
    ConTitle,
    FlowStep,
  },
  data() {
    return {
      titlename: "漏洞详情",
      iconName: "",
      RiskAllInfo: {},
      RiskInfo: {
        flawName: { name: "漏洞名称", value: "" },
        flawGrade: { name: "漏洞等级", value: "", type: "level" },
        flawDetails: { name: "漏洞细节", value: "" },
        flawDescription: { name: "漏洞描述", value: "" },
        flawHazard: { name: "漏洞影响", value: "" },
        flawSolution: { name: "解决方案", value: "" },
        flawCvss: { name: "漏洞cvss分值（主机漏洞与基线）", value: "" },
        flawIdentifying: { name: "漏洞标识（CVE/CNVD）", value: "" },
        flawClassification: { name: "漏洞分类（WEB漏洞）", value: "" },
        flawUrl: { name: "相关端口（主机漏洞与基线）", value: "" },
        flawIp: { name: "关联资产", value: "" },
        flawStatus: { name: "漏洞状态", value: "", type: "status" },
        handle_Status: { name: "处置状态", value: "" },
      },
      stepsList: [],
      stepsList2: [],
      span_n: 0,
      IsCol: true,
      flowPos: 0,
    };
  },
  methods: {
    search() {
      // asdasdas
    },
    iconF(index) {
      console.log(index);
      let c = {
        0: "#icondiwei",
        1: "#iconzhongwei",
        2: "#icongaowei",
      };
      this.iconName = c[index.value];
      console.log(this.iconName);
    },
    goback() {
      history.back();
    },
    gain_flaw() {
      const url = "/flaw/activitiList?id=" + this.RiskAllInfo.id;
      this.axios.get(url).then((Response) => {
        let d = Response.data;
        // 总流程图
        let taskAll = [...d.data.allTask];
        let taskKey = [];
        let taskHistory = d.data.hisTask;
        let formatDate = Vue.filter("formatDate");
        // 将开始放在第一位
        for (let key in d.data.allTask) {
          taskKey.push(taskAll[key].id);
          if (taskAll[key].id === "startTask") {
            let temp = { ...taskAll[key] };
            taskAll.splice(key, 1);
            taskAll.unshift(temp);
          }
        }

        taskKey.splice(taskKey.indexOf("startTask"), 1);
        taskKey.unshift("startTask");
        console.log(taskKey);
        for (let i in taskHistory) {
          for (let j in taskAll) {
            if (taskHistory[i].activityId === taskAll[j].id) {
              taskAll[j].persion = taskHistory[i].assignee;
              taskAll[j].time = formatDate(taskHistory[i].time);
            }
          }
          // 按照最后一个流程，之前的数据都清空
          if (Number(i) === taskHistory.length - 1) {
            // let stopId = taskHistory[i].activityId
            let stopPos = taskKey.indexOf(taskHistory[i].activityId);
            this.flowPos = stopPos;
            if (taskHistory[i].activityId === "endTask") {
              this.flowPos += 1;
            }
            for (let k in taskAll) {
              if (k > stopPos) {
                taskAll[k].persion = "";
                taskAll[k].time = "";
              }
            }
          }
        }
        this.stepsList = [...taskAll];
      });
    },
    loading_flaw() {
      let url = "/flaw/loadCommentsByFlawId?id=" + this.RiskAllInfo.id;
      this.axios
        .get(url)
        .then((Response) => {
          let data = Response.data;
          if (data.code === 0) {
            let info = [];
            data.data = data.data.reverse();
            console.log(data.data);
            data.data.map(function (d, i, a) {
              let temp = {};
              let time = d.time.split(" ");
              let arr = [];
              arr.push(d.message.slice(1, d.message.length - 1).split("]")[0]);
              arr.push(
                d.message
                  .slice(1, d.message.length - 1)
                  .split("]")[1]
                  .split("[")[0]
              );
              arr.push(
                d.message
                  .slice(1, d.message.length - 1)
                  .split("]")[1]
                  .split("[")[1]
                  .split(",")
              );
              console.log(arr);
              // let bt = d.message.match(/\[.+?\]/g)
              // // let bt = d.message.match(new RegExp('(?<=\\[)(.+?)(?=\\])', '/g'))
              // let remark = d.message.match(/(?<=\])(.+?)(?=\[)/g)
              // // let remark = d.message.match(new RegExp('(?<=\])(.+?)(?=\[)', '/g'))
              let remark = arr[1];

              if (arr[2].length === 2) {
                temp.title = arr[2][1];
                temp.deptname = arr[2][0];
                temp.status = arr[0];
                temp.description = remark;
              }
              temp.date = time[0];
              temp.time = time[1];
              temp.persion = d.userId;
              info.push(temp);
            });
            if (info.length === 0) {
              this.span_n = 0;
            } else {
              this.span_n = 9;
            }
            this.stepsList2 = [...info];
          }
          // eslint-disable-next-line
        })
        .catch((error) => {
          this.span_n = 0;
          console.log(error);
        });
    },
  },
  beforeMount() {
    // console.log('是否存在', this.$route.params)
    if (typeof this.$route.params.assetsId === "undefined") {
      this.RiskAllInfo = this.$session.get("riskObject");
    } else {
      this.$session.set("riskObject", { ...this.$route.params });
      this.RiskAllInfo = this.$session.get("riskObject");
    }
    for (let key in this.RiskInfo) {
      this.RiskInfo[key].value = this.RiskAllInfo[key];
    }
    this.iconF(this.RiskInfo["flawGrade"]);
    this.gain_flaw();
    this.loading_flaw();
  },
  watch: {
    IsCol(newValue, oldValue) {
      if (newValue) {
        this.span_n = 9;
      } else {
        this.span_n = 0;
      }
    },
  },
};
</script>

<style scoped>
.text-overfllow {
  display: block;
  width: 18vw;
  height: auto;
  word-wrap: break-word;
  word-break: break-all;
  /* overflow: hidden; */
}
.icon {
  width: 16px;
  height: 16px;
  vertical-align: -1px;
  fill: currentColor;
  overflow: hidden;
}
.risktitle {
  display: inline-block;
  font-weight: 600;
  font-size: 16px;
}
.title {
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 15px;
}
.el-divider {
  margin: 15px 0px;
}
.right-box {
  margin-top: 30px;
}
.risk-title {
  font-weight: bold;
  font-size: 16px;
}
.risk-title::before {
  content: "";
  display: inline-block;
  position: relative;
  top: 2px;
  width: 6px;
  height: 16px;
  margin-right: 6px;
  background: rgba(41, 85, 195, 1);
}
.risk-content {
  font-size: 16px;
}
.risk-content >>> .el-form-item__label {
  min-height: 40px;
  margin-left: 10px;
  padding-left: 20px;
  text-align: left;
  background-color: #e4e9f7;
}
.risk-content >>> .el-form-item__content {
  padding-left: 30px;
  background-color: #f7f8fa;
}
.risk-content >>> .el-form-item {
  margin: 0px;
  border-bottom: 1px solid #e0dfdf;
  background-color: #e4e9f7;
}
.details >>> .flow-box .el-card {
  margin-bottom: 20px;
}

.details >>> .el-card {
  height: 100%;
}
.details >>> .el-card > .el-card__body {
  height: 100%;
}

.flow-box .el-col:first-child {
  transition: width 1s;
}
.coll-button {
  float: right;
  width: 13px;
  height: 30px;
  line-height: 28px;
  margin-top: -25px;
  text-align: center;
  border-radius: 2px;
  background-color: #2955c3;
  color: #fff;
}
.coll-button:hover {
  cursor: pointer;
  user-select: none;
}
.isDisaple {
  display: none;
}
.more {
  margin-left: -10px;
  position: relative;
  bottom: -55px;
}
.align-items-stretch {
  align-items: stretch;
}
.flow-box >>> .el-steps {
  position: relative;
  left: 100px;
  top: 20px;
}
.flow-box >>> .el-step__title {
  position: relative;
  top: -10px;
  left: -5px;
  color: #4d4d4d;
  font-weight: bold;
}
.flow-box >>> .el-step__icon {
  position: relative;
  top: -10px;
  left: 6px;
  width: 12px;
  height: 12px;
  background-color: #b3b3b3;
  border: 0;
}
.description {
  position: absolute;
  top: 15px;
  left: 35px;
  font-size: 14px;
  color: #999999;
}
.description-date {
  position: absolute;
  top: -15px;
  left: -80px;
  color: #4d4d4d;
  font-size: 14px;
  font-weight: 400;
  text-align: right;
}
.button_status {
  position: absolute;
  left: 120px;
  top: 0px;
  width: 45px;
  height: 20px;
  line-height: 18px;
  border: 1px solid;
  padding-bottom: 3px;
  text-align: center;
  border-radius: 5px;
  font-size: 12px;
}
.pass_status {
  background-color: rgba(76, 149, 79, 0.2);
  border-color: rgba(76, 149, 79, 1);
  color: #4c954f;
}
.back_status {
  background-color: rgba(218, 40, 27, 0.2);
  border-color: rgba(218, 40, 27, 1);
  color: #da281b;
}
.finsh_status {
  background-color: rgba(92, 128, 215, 0.2);
  border-color: rgba(92, 128, 215, 1);
  color: #5c80d7;
}
</style>
