<template>
  <div class="page-login">
    <img class="left-img" src="../../static/imgs/login_imgs/leftimg.gif" alt />
    <img class="shadow" src="../../static/imgs/login_imgs/img_ty.png" alt />
    <form class="main">
      <h2>漏洞管理平台</h2>
      <h3>用户登录</h3>
      <p>
        <span class="icon icon-user"></span>
        <input type="text" v-model="loginInfo.loginname" placeholder="请输入用户名" />
      </p>
      <p>
        <span class="icon icon-pwd"></span>
        <input type="password" v-model="loginInfo.pwd" placeholder="请输入密码" />
      </p>
      <p class="test-code">
        <span class="icon icon-yzm"></span>
        <input class="code-input" v-model="loginInfo.testCode" type="text" placeholder="请输入验证码" />
        <span class="code-img" @click="refreshCode">
          <SIdentify
            :identifyCode="identifyCode"
            :contentHeight="contentHeight"
            :contentWidth="contentWidth"
          ></SIdentify>
        </span>
      </p>
      <p>
        <button class="login" type="button" @click="login">登录</button>
      </p>
      <p class="rem-pwd" @click="loginInfo.isRemPwd = !loginInfo.isRemPwd">
        <img
          :src="require(`../../static/imgs/login_imgs/icon_${this.loginInfo.isRemPwd == true ? 'check': 'normal'}.png`)"
        />
        <span class="text">记住密码</span>
      </p>
    </form>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.login {
  padding: 0;
  font-size: 20px;
  line-height: 42px;
  color: #fff;
  border-radius: 5px;
  background-color: #1e82dd;
  border: none;
  margin-top: 20px;
  cursor: pointer;
}
.page-login {
  position: relative;
  background-color: orange;
  height: 100vh;
  width: 100%;
  background-image: url("../../static/imgs/login_imgs/img_loginbg.png");
  background-size: cover;
}

.page-login .left-img {
  width: 100%;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 0;
}

.page-login .shadow {
  width: 500px;
  height: 127px;
  position: absolute;
  left: calc(60% - 50px);
  top: calc(20% + 500px);
}

.page-login .main {
  background-color: #fff;
  position: absolute;
  width: 400px;
  height: 510px;
  box-shadow: 0px 0px 42px 0px rgba(177, 177, 177, 0.57);
  border-radius: 10px;
  padding: 30px 50px;
  left: 60%;
  top: 25%;
}

.page-login .main h3 {
  font-size: 28px;
  text-align: center;
  color: #216cb2;
  background-image: url("../../static/imgs/login_imgs/img_title.png");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100%;
  margin-bottom: 40px;
}

.page-login .main h2 {
  font-size: 33px;
  color: #216cb2;
  position: absolute;
  right: 0;
  top: -65px;
}

.page-login .main p {
  position: relative;
  margin-bottom: 25px;
}

.page-login .main .rem-pwd {
  height: 14px;
  font-size: 14px;
  line-height: 14px;
  color: #216cb2;
}
.page-login .main .rem-pwd .text {
  margin-left: 5px;
  position: relative;
  top: -2px;
}
.page-login .main .test-code {
  display: flex;
}
.page-login .main .test-code .code-input {
  flex: 1;
  border-radius: 5px 0 0 5px;
}
.page-login .main .test-code .code-img {
  width: 100px;
  height: 42px;
  border-radius: 0 5px 5px 0;
  overflow: hidden;
  cursor: pointer;
}

input,
button {
  width: 100%;
  height: 42px;
  border-radius: 5px;
  outline: none;
  border: 1px solid #b3b3b379;
  padding-left: 35px;
}

::-webkit-input-placeholder {
  color: rgba(179, 179, 179, 0.5);
  font-size: 14px;
}
.icon {
  display: block;
  width: 16px;
  height: 42px;
  position: absolute;
  left: 10px;
  background-repeat: no-repeat;
  background-position: center;
}
.icon-user {
  background-image: url("../../static/imgs/login_imgs/icon_user.png");
}
.icon-pwd {
  background-image: url("../../static/imgs/login_imgs/icon_pwd.png");
}
.icon-yzm {
  background-image: url("../../static/imgs/login_imgs/icon_code.png");
}
</style>>


<script>
import SIdentify from "./SIdentify";
export default {
  components: {
    SIdentify,
  },

  data() {
    return {
      // 随机数列
      identifyCodes: "1234567890",
      // 生成的验证码
      identifyCode: "",
      contentHeight: 42,
      contentWidth: 100,

      timer: null,

      // 登录信息
      loginInfo: {
        loginname: "",
        pwd: "",
        testCode: "",
        isRemPwd: true,
      },
    };
  },
  methods: {
    // 刷新验证码
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },

    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },

    // 随机数列， 随机个数
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    },

    getCookie() {
      console.log("getCookie");
    },
    login() {
      clearTimeout(this.timer);

      this.timer = setTimeout(() => {
        let { loginname, pwd, testCode, isRemPwd } = this.loginInfo;
        if (loginname.length == 0 || pwd.length == 0) {
          this.$message.error("请输入用户名和密码");
          return;
        } else if (testCode !== this.identifyCode) {
          this.$message.error("验证码错误");
          return;
        }
        let url = '/login/login'
        this.axios
          .post(url, "loginname=" + loginname + "&pwd=" + pwd)
          .then(({ data }) => {
            this.$session.set('username', loginname)
            if (data.code == 200) {
              this.$message({
                message: data.msg,
                type: "success",
              });
              // setCookie
              this.$router.push('/')
            } else {
              this.$message.error(data.msg);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }, 300);
    },
  },
  mounted() {
    this.getCookie();

    // 刷新验证码
    this.refreshCode();
  },
};
</script>