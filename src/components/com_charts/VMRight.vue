<template>
  <div class="com">
    <div class="top">
      <div class="part-title1">
        <span class="title-line">{{title[0]}}</span>
      </div>
      <ul>
        <li v-for="(item, index) in todaySecurityData" :key="index">
          <div class="icon-out"></div>
          <img
            class="icon-in"
            :src="require(`../../../static/imgs/vul_management_imgs/${iconList[index + 1]}.png`)"
            alt
          />
          <div class="info">
            <p class="num">{{item.value}}</p>
            <p class="name">{{item.name}}</p>
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom">
      <div class="part-title1">
        <span class="title-line">{{title[1]}}</span>
      </div>
      <ul>
        <li class="li-title">
          <span class="type">任务名称</span>
          <span class="type">操作人</span>
          <span class="type">操作时间</span>
        </li>
        <vueSeamlessScroll :data="monitorData" :class-option="scrollOption" class="scroll-box" v-if="monitorData.length !== 0">
          <div class="scroll-box-main">
            <li v-for="(item, index) in monitorData" :key="index">
              <span>{{item.type}}</span>
              <span class="">{{item.user.split(':')[1]}}</span>
              <span :style="{fontSize: '12rem'}">{{item.time}}</span>
            </li>
          </div>
        </vueSeamlessScroll>
      </ul>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.com {
  padding: 15rem;
  height: calc(100% + 30rem);
  width: 100%;
  position: relative;
  top: -30rem;
  // background: rgba(16, 46, 87, 0.37);
  background:rgba(2,16,33,0.35);
  .top {
    height: 40%;
    width: 100%;
    ul {
      padding-top: 10rem;
      width: 100%;
      height: calc(100% - 25rem);
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      li {
        margin-left: 4%;
        margin-top: 4%;
        height: 50rem;
        position: relative;
        font-size: 14rem;
        color: #b3b3b3;
        display: flex;
        width: 44%;
        .info {
          //   background-color: #fff;
          padding-left: 20rem;
          flex: 1;
          .num {
            font-size: 18rem;
            color: #34d2ff;
          }
        }
        .icon-in {
          width: 44rem;
          height: 44rem;
          transform: scale(0.7);
        }
        .icon-out {
          animation: roate 3s infinite linear;
          @keyframes roate {
            0% {
              transform: rotate(0);
            }
            100% {
              transform: rotate(360deg);
            }
          }
          position: absolute;
          left: 0;
          top: 0;
          height: 44rem;
          width: 44rem;
          background-image: url("../../../static/imgs/vul_management_imgs/img_rotate.png");
          background-size: 100%;
        }
      }
    }
  }
  .bottom {
    overflow: hidden;
    margin-top: 20rem;
    height: 60%;
    width: 100%;
    ul {
      padding: 20rem;
      padding-top: 0;
      width: 100%;
      height: calc(100% - 30rem);
      .scroll-box {
        height: 310rem;
        width: 100%;
        overflow: hidden;
        .scroll-box-main {
          width: 100%;
          height: 150%;
        }
        & li:not(:last-of-type) {
          border-bottom: 1px dashed rgba(122, 126, 127, 0.5);
        }
        & li:first-of-type {
          font-size: 14rem;
          color: #34d2ff;
          height: 45px;
          border: 1px solid #34d2ff;
        }
      }
      li {
        padding: 0 10rem;
        height: 45px;
        display: flex;
        align-items: center;
        font-size: 13rem;
        color: #b3b3b3;
        & span:nth-of-type(1) {
          width: 25%;
        }
        & span:nth-of-type(2) {
          width: 40%;
        }
        & span:nth-of-type(3) {
          width: 40%;
        }
      }
      .li-title {
        font-size: 14rem;
        color: #b3b3b3;
        font-weight: bold;
      }
    }
  }
}
</style>
<script>
import vueSeamlessScroll from "vue-seamless-scroll";
export default {
  components: {
    vueSeamlessScroll,
  },
  data() {
    return {
      scrollOption: {
        step: 0.4, // 数值越大速度滚动越快
        limitMoveNum: 7, // 开始无缝滚动的数据量 this.dataList.length
        hoverStop: true, // 是否开启鼠标悬停stop
        direction: 1, // 0向下 1向上 2向左 3向右
        openWatch: true, // 开启数据实时监控刷新dom
        singleHeight: "", // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
        singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
        waitTime: 2000, // 单步运动停止的时间(默认值1000ms)
      },
      iconList: [
        "img_rotate",
        "icon_daoru",
        "icon_shenhe",
        "icon_xiafa",
        "icon_xiufu",
        "icon_guanbi",
        "icon_hulve",
      ],
      date: null,
      todaySecurityData: [],
      monitorData: [],
      testData: [
        {
          index: 1,
          user: "zhangsan",
          type: "system1",
          time: 20202020,
        },
        {
          index: 2,
          user: "zhangsan",
          type: "system2",
          time: 20202020,
        },
        {
          index: 3,
          user: "zhangsan",
          type: "system3",
          time: 20202020,
        },
        {
          index: 4,
          user: "zhangsan",
          type: "system4",
          time: 20202020,
        },
        {
          index: 5,
          user: "zhangsan",
          type: "system5",
          time: 20202020,
        },
        {
          index: 6,
          user: "zhangsan",
          type: "system6",
          time: 20202020,
        },
        {
          index: 7,
          user: "zhangsan",
          type: "system",
          time: 20202020,
        },
        // {
        //   index: 8,
        //   user: "zhangsan",
        //   type: "system7",
        //   time: 20202020,
        // },
        // {
        //   index: 9,
        //   user: "zhangsan",
        //   type: "system8",
        //   time: 20202020,
        // },
        // {
        //   index: 10,
        //   user: "zhangsan",
        //   type: "system9",
        //   time: 20202020,
        // },
      ],
      title: ["今日安全", "实时监测"],
    };
  },
  created() {
    // this.scrollOption.singleHeight = this.testData.length * 45;
    this.date = new Date();
    this.axios.get("/riskBigScreen/findSafeToday").then(({ data }) => {
      this.todaySecurityData = [
        { name: "漏洞添加", value: data.data.import },
        { name: "漏洞审核", value: data.data.audit },
        { name: "漏洞下发", value: data.data.issue },
        { name: "漏洞修复", value: data.data.fix },
        { name: "漏洞关闭", value: data.data.closed },
        { name: "漏洞忽略", value: data.data.ignored },
      ];
    });

    this.axios.get("/riskBigScreen/findFlawMonitoring").then(({ data }) => {
      console.log("test9", data.data);
      data.data.forEach((item, index) => {
        this.monitorData.push({
          index: index + 1,
          user: item.operator,
          type: item.taskName,
          // time: new Date(item.operatingTime).toLocaleDateString().replace(/\//g, ".") + '  ' + new Date(item.operatingTime).toTimeString().slice(0, 5),
          time: item.operatingTime,
        });
      });
      this.scrollOption.singleHeight = (this.monitorData.length) * 45;

      console.log('datalength', this.monitorData.length)
    });
  },
  watch: {
    monitorData() {
      this.scrollOption.singleHeight = (this.monitorData.length) * 45;
    }
  }
};
</script>