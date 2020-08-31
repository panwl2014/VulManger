<template>
  <el-container>
    <el-aside :style="'width:'+AsideWidth+';background-color:'+MenuBackgroundColor">
      <el-card class="menu-title">
        <img src="../../static/imgs/logo.png" class="icon-logo" />
        漏洞管理
      </el-card>
      <!-- :default-active="display.showMenuName.get()[2]" -->
      <el-menu
        class="b-0"
        unique-opened
        router
        :default-active="curUrl"
        @select="selectMenu"
        :collapse="IsCollapse"
        :background-color="MenuBackgroundColor"
        :text-color="MenuTextColor"
        :active-text-color="MenuActiveColor"
      >
        <template v-for="menu in menu_list">
          <el-submenu :index="menu.id" :key="menu.id" v-if="!menu.display">
            <template slot="title">
              <svg class="icon" aria-hidden="true">
                <use :xlink:href="menu.icon" />
              </svg>
              <span v-text="menu.title"></span>
            </template>
            <template v-for="children in menu.children">
              <el-menu-item
                @click="test(children)"
                :key="children.id"
                :index="children.target"
                v-if="!children.display"
              >
                <span v-text="children.title"></span>
              </el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="header-left">
          <svg class="icon" aria-hidden="true" @click="icon_width_change">
            <use :xlink:href="menu_icon" />
          </svg>

          <span class="breadcrumb">
            <span style="color:#4D4D4D">{{display.showMenuName.get()[0]}} /</span>
            <span style="color:#0E76D7">{{display.showMenuName.get()[1]}}</span>
          </span>
        </div>
        <div class="header-right">
          <span class="user-circul">
            <svg class="user-icon" aria-hidden="true">
              <use xlink:href="#iconuser" />
            </svg>
          </span>
          <el-dropdown class="cursor-pointer">
            <span>
              <span>{{roleName}}&nbsp;&nbsp;</span>
              <span>{{loginName}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePass">修改密码</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <svg class="tuichu-icon cursor-pointer" aria-hidden="true" @click="toLogin">
            <use xlink:href="#icontuichu" />
          </svg>
        </div>
      </el-header>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
        <span>
          <el-form :model="PassForm" ref="PassForm" label-width="100px" :rules="rules">
            <el-form-item
              prop="oldPwd"
              :rules="[{required: true, message: '请输入旧密码', trigger: 'blur'}]"
              label="旧密码"
            >
              <el-input v-model="PassForm.oldPwd" maxlength="20" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item
              prop="newPwd"
              :rules="[{required: true, message: '请输入新密码', trigger: 'blur'}]"
              label="新密码"
            >
              <el-input v-model="PassForm.newPwd" maxlength="20" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item prop="confirmNewPwd" label="确认新密码">
              <el-input v-model="PassForm.confirmNewPwd" maxlength="20" placeholder="请再次确认新密码"></el-input>
            </el-form-item>
          </el-form>
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="updateSubmit">确 定</el-button>
          <el-button @click="cancle">取 消</el-button>
        </span>
      </el-dialog>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Index",
  data() {
    const checkPass = (rule, value, callback) => {
      if (value !== this.PassForm.newPwd) {
        callback(new Error("两次输入密码不一致"));
      } else {
        callback();
      }
    };
    return {
      curUrl: "",
      dialogVisible: false,
      /* 菜单样式 */
      MenuBackgroundColor: "#fff",
      MenuTextColor: "#808080",
      MenuActiveColor: "#0E76D7",
      AsideWidth: "216px",
      menu_icon: "#iconshousuo",
      IsCollapse: false,
      OpenMenu: "14",
      roleName: "系统管理员",
      loginName: "admin",
      /* */
      menu_list: [],
      PassForm: {
        newPwd: "",
        confirmNewPwd: "",
        oldPwd: "",
      },
      rules: {
        confirmNewPwd: [
          { required: true, message: "请确认密码", trigger: "blur" },
          { validator: checkPass, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    selectMenu(index, indexPath) {
      console.log("router", this.$route.path);
      if (index == "/vulIndex") {
        window.open("#/blank_vulIndex", "_blank");
        this.$router.go(0);
      } else {
        this.curUrl = index;
      }
    },
    icon_width_change() {
      this.IsCollapse = !this.IsCollapse;
      if (this.IsCollapse) {
        this.AsideWidth = "60px";
        this.menu_icon = "#iconzhankai";
      } else {
        this.AsideWidth = "216px";
        this.menu_icon = "#iconshousuo";
      }
    },
    test(row) {
      // this.label1 = row.pname
      // this.label2 = row.title
      this.display.showMenuName.set([row.pname, row.title, row.target]);
    },
    toLogin() {
      let url = "/login/loginOut";
      this.axios.get(url).then((Response) => {
        if (Response.data.code === 200) {
          this.message_box("退出成功");
          window.location.href = "/index.html#/login";
        } else {
          this.$message.error("操作失败");
        }
      });
    },
    // 修改密码
    updatePass() {
      this.dialogVisible = true;
    },
    updateSubmit() {
      let url = "/login/updatePassword";
      this.$refs["PassForm"].validate((valid) => {
        if (valid) {
          let form = {
            newPwd: this.PassForm.newPwd,
            oldPwd: this.PassForm.oldPwd,
          };
          this.axios.post(url, this.qs.stringify(form)).then((Response) => {
            const d = Response.data;
            if (d.code === 200) {
              this.message_box(d.msg);
            } else {
              this.$message.error(d.msg);
            }
            this.dialogVisible = false;
            for (let key in this.PassForm) {
              this.PassForm[key] = "";
            }
          });
        } else {
          return false;
        }
      });
    },
    cancle() {
      this.dialogVisible = false;
      for (let key in this.PassForm) {
        this.PassForm[key] = "";
      }
    },
    handleClose(done) {
      done();
      this.cancle();
      this.$refs["PassForm"].resetFields();
    },
    message_box(msg, type = "success") {
      this.$message({
        message: msg,
        type: type,
      });
    },
  },
  beforeMount() {
    // 获取用户信息
    let url = "/login/getUser";
    this.axios.get(url).then((response) => {
      const d = response.data;
      if (d.code === 0) {
        this.roleName = d.data.user.name;
        this.loginName = d.data.user.loginname;
      } else {
        this.$message.error(d.msg);
      }
    });
  },
  created() {
    this.curUrl = this.$route.path == "/" ? "/home/vulAnalysis" : this.$route.path;
    if (this.$route.path == "/") {
      this.$router.push("/home/vulAnalysis");
    }
    // if (typeof(this.$session.get('username')) === 'undefined') {
    //   this.$router.push('/index.html#/login')
    // }
    const url = "/menu/loadIndexLeftMenuJson";
    this.axios
      .get(url)
      .then((Response) => {
        const d = Response.data;
        console.log(d);
        for (let key in d.data) {
          if (this.display.displayMenu.indexOf(d.data[key].title) >= 0) {
            d.data[key]["display"] = true;
            this.display.setValue(d.data[key]["id"]);
            continue;
          }
          d.data[key].id = d.data[key].id.toString();
          d.data[key]["display"] = false;
          d.data[key]["children"].map(function (data, index, arr) {
            if (
              this.display.displayMenu.indexOf(
                d.data[key]["children"][index]["title"]
              ) >= 0
            ) {
              d.data[key]["children"][index]["display"] = true;
              this.display.setValue(d.data[key]["children"][index]["id"]);
            } else {
              d.data[key]["children"][index]["pname"] = d.data[key]["title"];
              d.data[key]["children"][index]["display"] = false;
            }
          }, this);
        }
        this.menu_list = [...d.data];
        console.log("m_list", this.menu_list);
        this.display.setMenuList(d.data);
        this.display.showMenuName.set([
          d.data[0]["children"][0]["pname"],
          d.data[0]["children"][0]["title"],
          d.data[0]["children"][0]["target"],
        ]);
        // this.$router.push(d.data[0]["children"][0]["target"]);
      })
      .catch((error) => {
        console.log("Cookie失效");
        window.location.href = "/index.html#/login";
      });
  },
};
</script>

<style scoped>
.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
  overflow: hidden;
}
.is-opened > .icon {
  fill: #0e76d7 !important;
}
.user-icon {
  width: 20px;
  height: 20px;
  overflow: hidden;
  margin-top: 1px;
  margin-left: 2px;
}
.tuichu-icon {
  width: 21px;
  height: 21px;
  overflow: hidden;
  vertical-align: -3px;
}
.header-left > .icon:hover {
  cursor: pointer;
}
.el-container {
  width: 100%;
  min-height: 100vh;
}
.el-header {
  background-color: #fff;
  padding-top: 18px;
  margin-left: 1px;
}
.header-left {
  float: left;
}
.header-right {
  position: absolute;
  top: 15px;
  right: 20px;
}
.breadcrumb {
  display: inline-block;
  position: relative;
  left: 30px;
  top: -4px;
  font-size: 16px;
}
.el-main {
  padding: 10px !important;
  overflow: hidden;
}
/* 菜单样式 */
.is-opened >>> .el-submenu__title {
  color: #fff !important;
}
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 216px;
  min-height: 400px;
}
.el-menu--inline > .is-active {
  background-color: #e6e9ee !important;
  border-right-style: solid;
  border-right-width: 5px !important;
  border-right-color: #0e76d7;
}
.is-opened > .el-submenu__title > * {
  font-weight: bold;
  font-size: 15px;
  color: #0e76d7 !important;
}
.el-menu-item {
  padding-left: 70px !important;
}
.menu-title {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  font-size: 24px;
  color: #0e76d7;
  box-shadow: 1px 2px 12px 0px rgba(204, 204, 204, 0.54) !important;
}
.icon-logo {
  position: relative;
  top: 5px;
  width: 42px;
  height: 30px;
}
.el-aside {
  transition: width 0.3s;
  overflow: hidden;
}
.menu-title >>> .el-card__body {
  padding: 0px !important;
}
.user-circul {
  display: inline-block;
  position: relative;
  top: 5px;
  width: 25px;
  height: 25px;
  background-color: #d8d8d8;
  border-radius: 50%;
  margin-right: 10px;
}
.el-dropdown {
  margin-right: 30px;
}
</style>
