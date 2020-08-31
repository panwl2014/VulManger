<template>
  <div>
    <con-title :name="titlename"></con-title>
    <el-card class="mr-1 mt-1">
      <filter-data :FilterList="FilterList" :FilterForm="FilterForm">
        <template v-slot:ButtonContent>
          <div class="el-col-8">
            <el-form-item>
              <el-button type="primary" size="small" @click="search">查询</el-button>
              <vul-button size="small" @click="addAuthority">添加权限</vul-button>
            </el-form-item>
          </div>
        </template>
      </filter-data>
      <asset-table
        pagination
        :loading="loading"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :HandleConfig="HandleConfig"
        :pageTotal="pageTotal"
        @MonitorEvent="monitor_event"
        @page-currentsize-change="page_currentsize_change"
        @page-current-change="page_current_change"
      >
      </asset-table>

      <el-dialog
        :title="submitType == 'add' ? '添加权限' :'修改权限'"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <el-form label-width="85px" :model="authorityDdata" ref="authorityDdata">
          <el-form-item label="选择菜单">
            <tree-select
              :options="menuList"
              v-model="authorityDdata.pid"
              :defaultExpandLevel="Infinity"
              placeholder="请选择归属部门"
            ></tree-select>
          </el-form-item>
          <el-form-item label="权限名称" prop="title">
            <el-input v-model="authorityDdata.title"></el-input>
          </el-form-item>
          <el-form-item label="权限编码" prop="percode">
            <el-input v-model="authorityDdata.percode"></el-input>
          </el-form-item>
          <el-form-item label="是否展开">
            <el-radio-group v-model="authorityDdata.available">
              <el-radio :label="0">展开</el-radio>
              <el-radio :label="1">不展开</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否可用">
            <el-radio-group v-model="authorityDdata.open">
              <el-radio :label="0">可用</el-radio>
              <el-radio :label="1">不可用</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="排序码" prop="ordernum">
            <el-input v-model="authorityDdata.ordernum"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button type="primary" @click="submitEditAdd()">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import ConTitle from "@/components/components/ConTitle";
import FilterData from "@/components/components/FilterData";
import AssetTable from "@/components/components/AssetTable";
import TreeSelect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "AssetManage",
  components: {
    ConTitle,
    AssetTable,
    FilterData,
    TreeSelect,
  },
  data() {
    return {
        // 提交类型 修改 添加
      submitType: "",

      // 编辑数据
      authorityDdata: {
        pid: null,
        permissionTree_select_input: "",
        id: null,
        title: null,
        percode: null,
        open: null,
        available: null,
        ordernum: null,
      },
      // 菜单列表
      menuList: "",
      // 修改添加弹窗
      dialogVisible: false,
      // 查询携带字段
      loading: true,
      TestForm: {
        page: 1,
        limit: 10,
        title: "",
        percode: "",
      },
      titlename: "权限管理",
      pageTotal: 100,
      dialogVisible: false,
      AssetDialog: false,
      EventName: "",
      EventArgs: "",
      FilterList: [
        {
          name: "authority_name",
          label: "权限名称",
          type: "input",
          placeholder: "请输入权限名称",
        },
        {
          name: "authority_code",
          label: "权限编码",
          type: "input",
          placeholder: "请输入权限编码",
        },
      ],
      FilterForm: {
        authority_name: "",
        authority_code: "",
      },
      ColumnList: [],
      tableTitle: [
        {
          key: "id",
          label: "ID",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "pid",
          label: "菜单ID",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "title",
          label: "权限名称",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "percode",
          label: "权限编码",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "availableText",
          label: "是否可用",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "ordernum",
          label: "排序码",
          is_show: true,
          text_algin: "center",
        },
      ],
      tableData: [],
      AssetForm: {
        asset_name: "",
        asset_orgin: "",
      },
      HandleConfig: {
        width: "180",
        fixed: "right",
        text_algin: "center",
        buttonList: [
          {
            title: "编辑",
            icon_name: "#iconbianji",
            size: "mini",
            event_name: "authority_edit",
            event_args: "",
          },
          {
            title: "删除",
            icon_name: "#iconshanchu",
            size: "mini",
            event_name: "authority_delete",
            event_args: "",
          },
        ],
      },
    };
  },
  methods: {
    // 获取排序
    addAuthority() {
      this.dialogVisible = true;
      this.submitType = "add";
      this.axios
        .post("/permission/loadPermissionMaxOrderNum")
        .then(({ data }) => {
          this.authorityDdata.ordernum = data.value;
        });
    },

    // 添加修改权限
    submitEditAdd() {
      this.$refs["authorityDdata"].validate((e) => {
        if (!e) {
          return;
        } else {
          let url = "";
          if (this.submitType == "add") {
            url = "/permission/addPermission";
          } else {
            url = "/permission/updatePermission";
          }
          let data = this.qs.stringify(this.authorityDdata);
          this.axios.post(url, data).then((Response) => {
            const d = Response.data;
            if (d.code === 200) {
              this.message_box(d.msg);
              this.search();
            } else {
              this.$message.error(d.msg);
            }
          });
          this.authorityDdata = {
            pid: null,
            permissionTree_select_input: "",
            id: "",
            title: "",
            percode: "",
            open: "",
            available: "",
            ordernum: "",
          };
          this.dialogVisible = false;
        }
      });
    },
    // 取消修改
    cancelEdit() {
      this.authorityDdata = {
        pid: null,
        permissionTree_select_input: "",
        id: "",
        title: "",
        percode: "",
        open: "",
        available: "",
        ordernum: "",
      };
      this.dialogVisible = false;
    },
    monitor_event(EventName, EventArgs) {
      this.EventName = EventName;
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs;
    },

    // 编辑
    authority_edit(e) {
      this.dialogVisible = true;
      this.submitType = "edit";
      // 取消编辑数据改变
      this.authorityDdata = JSON.parse(JSON.stringify(e[0]));
      this.menuList.forEach((item) => {
        item.children.forEach((item1) => {
          if (item1.id == this.authorityDdata.pid) {
            console.log(111333, item1.label);
            this.authorityDdata.currentMenuId = item1.id;
          }
        });
      });
    },
    // 删除
    authority_delete(e) {
      console.log(e);
      this.$confirm("你是否确认删除权限？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        showClose: false,
        type: "warning",
      }).then(() => {
        this.loading = true;
        const url = "/permission/deletePermission";
        this.pageTotal -= 1;
        this.axios.post(url, "id=" + e[0].id).then((Response) => {
          const d = Response.data;
          if (d.code === 200) {
            this.message_box(d.msg);
            this.riskCount();
            this.page_current_change(this.TestForm.page);
          } else {
            this.$message.error(d.msg);
          }
          this.loading = true;
        });
      });
    },

    page_currentsize_change(val) {
      this.TestForm.limit = val;
      this.search();
    },
    page_current_change(val) {
      this.TestForm.page = val;
      this.search();
    },
    riskCount() {
      const url = "/flaw/findFlawCount";
      this.axios.get(url).then((Response) => {
        const d = Response.data;
        if (d.code === 0) {
          for (let key in this.datalist) {
            this.datalist[key]["value"] = d.data[key];
            if (key !== "flawCount") {
              this.datalist[key]["percentage"] =
                (this.datalist[key]["value"] / d.data["flawCount"]) * 100;
            }
          }
          console.log(this.datalist);
        } else {
          this.$message.error("获取漏洞统计数据失败！");
        }
      });
    },
    message_box(msg, type = "success") {
      this.$message({
        message: msg,
        type: type,
      });
    },
    handleClose(done) {
      done();
    },
    handleChange(value) {
      console.log(value);
    },
    search() {
      this.loading = true;
      let data =
        "page=" +
        this.TestForm.page +
        "&limit=" +
        this.TestForm.limit +
        "&title=" +
        this.FilterForm.authority_name +
        "&percode=" +
        this.FilterForm.authority_code;
      // let formatDate = Vue.filter("formatDate");
      // let HandleStatusFilter = Vue.filter("HandleStatusFilter");
      const url = "/permission/loadAllPermission";
      console.log(2334, data);
      this.axios.post(url, data).then(({ data }) => {
        console.log(9999999999, data.data);
        this.pageTotal = data.count;
        let d = data.data.map((item, index) => ({
          id: item.id,
          pid: item.pid,
          title: item.title,
          percode: item.percode,
          open: item.open,
          available: item.available,
          ordernum: item.ordernum,
          availableText: item.available == 1 ? "可用" : "不可用",
          openText: item.open == 1 ? "可用" : "不可用",
        }));
        this.tableData = d;
        this.loading = false;
      });
    },
    // 获取菜单列表
    getMenuList() {
      let url = "/menu/loadIndexLeftMenuJson";
      this.axios.get(url).then(({ data }) => {
        console.log("menu", data.data);
        this.menuList = data.data.map((item, index) => {
          if (item.children.length !== 0) {
            return {
              label: item.title,
              id: item.id,
              children: item.children.map((item1, index1) => ({
                label: item1.title,
                id: item1.id,
              })),
            };
          }
        });
        console.log(88888, this.menuList);
      });
    },
  },
  watch: {
    EventName(newValue, oldValue) {
      if (newValue !== "") {
        // 通过监控EventName值的变化来执行相应的函数
        // eslint-disable-next-line
        eval("this." + newValue + "(this.EventArgs)");
      }
      this.EventName = "";
      this.EventArgs = "";
    },
  },
  computed: {
    getCurMenu() {
      let curMenu = "";
      this.menuList.forEach((item) => {
        return item.children.forEach((item1) => {
          if (item1.id == 16) {
            curMenu = item.label;
          }
        });
      });
      return curMenu;
    },
  },
  created() {
    this.search();
    this.getMenuList();
  },
};
</script>

<style scoped>
.el-dialog .el-input {
  width: 70% !important;
}
</style>
