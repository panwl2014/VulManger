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
        <li>
          <span class="type">任务名称</span>
          <span class="type">操作人</span>
          <span class="type">操作时间</span>
        </li>
        <!-- v-if="startIndex < item.index && item.index < endIndex" -->
        <li
          v-for="(item, index) in monitorData"
          v-if="startIndex < item.index && item.index < endIndex"
          :key="index"
        >
          <span>{{item.type}}</span>
          <span>{{item.user}}</span>
          <span :style="{fontSize: '12rem'}">{{item.time.slice(0, item.time.length - 3)}}</span>
        </li>
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
  background: rgba(16, 46, 87, 0.37);
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
    height: 60%;
    width: 100%;
    ul {
      padding: 20rem;
      width: 100%;
      height: calc(100% - 30rem);
      & li:not(:first-of-type) {
        font-size: 13rem;
        color: #b3b3b3;
      }
      & li:not(:last-of-type) {
        border-bottom: 1rem dashed rgba(122, 126, 127, 0.5);
      }
      & li:first-of-type {
        font-size: 14rem;
        color: #b3b3b3;
        font-weight: bold;
      }
      & li:nth-of-type(6) {
        border-bottom: none;
      }
      & li:last-of-type {
        font-size: 14rem;
        color: #34d2ff;
        height: 12%;
        border: 1rem solid #34d2ff;
      }
      li {
        padding: 0 10rem;
        height: 15%;
        display: flex;
        align-items: center;
        & span:nth-of-type(1) {
          width: 30%;
        }
        & span:nth-of-type(2) {
          width: 40%;
        }
        & span:nth-of-type(3) {
          width: 40%;
        }
      }
    }
  }
}
</style>
<script>
export default {
  data() {
    return {
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
      startIndex: 0,
      endIndex: 7,
      todaySecurityData: [],
      monitorData: [],
      title: ["今日安全", "实时监测"],
    };
  },
  created() {
    // setInterval(() => {
    //   if (this.todaySecurityData.length - this.startIndex < 7) {
    //     this.startIndex = 0;
    //     this.endIndex = 7;
    //   } else {
    //     this.startIndex++;
    //     setTimeout(() => {
    //       this.endIndex++;
    //     }, 500);
    //   }
    // }, 2000);
    this.date = new Date();
    this.axios.get("/riskBigScreen/findSafeToday").then(({ data }) => {
      this.todaySecurityData = [
        { name: "漏洞导入", value: data.data.import },
        { name: "漏洞审核", value: data.data.audit },
        { name: "漏洞下发", value: data.data.issue },
        { name: "漏洞修复", value: data.data.fix },
        { name: "漏洞关闭", value: data.data.closed },
        { name: "漏洞忽略", value: data.data.ignored },
      ];
    });

    this.axios.get("/riskBigScreen/findFlawMonitoring").then(({ data }) => {
      data.data.forEach((item, index) => {
        this.monitorData.push({
          index: index + 1,
          user: item.operator,
          type: item.taskName,
          // time: new Date(item.operatingTime).toLocaleDateString().replace(/\//g, ".") + '  ' + new Date(item.operatingTime).toTimeString().slice(0, 5),
          time: item.operatingTime,
        });
      });
    });
  },
};
</script>