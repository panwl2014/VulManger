<template>
  <div class="aaa">
    <con-title :name="titlename"></con-title>
    <el-card shadow="never" class="mr-1 mt-1">
      <vul-button size="small" plain @click="dialogVisible = true">添加报表</vul-button>
      <vul-button size="small" plain @click="batchDel">批量删除</vul-button>
      <asset-table
        selection
        pagination
        :pageTotal="pageTotal"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :HandleConfig="HandleConfig"
        @select-change-data="select_change_data"
        @page-currentsize-change="page_currentsize_change"
        @page-current-change="page_current_change"
        @MonitorEvent="monitor_event"
      ></asset-table>
    </el-card>
    <el-dialog :title="'添加报表'" :visible.sync="dialogVisible" width="600px">
      <el-form label-width="85px" ref="authorityDdata" :model="reportData">
        <el-form-item
          label="报表名称"
          prop="reportName"
          :rules="[{required: true, message: '请输入报表名称', trigger: 'blur'}]"
        >
          <el-input placeholder="请输入报表名称" v-model="reportData.reportName"></el-input>
        </el-form-item>
        <el-form-item label="资产信息" prop="assetType">
          <el-radio v-model="reportData.assetType" label="1">按单个资产</el-radio>
          <el-radio v-model="reportData.assetType" label="2">按部门</el-radio>
          <el-radio v-model="reportData.assetType" label="3">全部资产</el-radio>
        </el-form-item>
        <el-form-item
          v-if="reportData.assetType == 1"
          prop="assetRange"
          :rules="[{required: true, message: '请输入资产ip或名称', trigger: 'blur'}]"
        >
          <el-input placeholder="请输入资产名称（ip或网址）" v-model="reportData.assetRange"></el-input>
        </el-form-item>
        <el-form-item v-else-if="reportData.assetType == 2" prop="deptId">
          <el-select
            placeholder="请选择"
            v-model="reportData.assetRange"
            :rules="[{required: true, message: '请选择部门', trigger: 'blur'}]"
          >
            <el-option
              v-for="(item, index) in deptList"
              :key="index"
              :label="item.title"
              :value="item.pid.toString()"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item width="100%" prop="importStartTime">
          <el-date-picker
            is-range
            width="100%"
            v-model="importStartEndTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始月份"
            end-placeholder="结束月份"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="处置状态">
          <el-select placeholder="请选择" multiple v-model="reportData.handleStatus">
            <el-option
              v-for="(item, index) in handleStatusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="漏洞类型" prop="flawType">
          <el-select placeholder="请选择" multiple v-model="reportData.flawType">
            <el-option
              v-for="(item, index) in flawTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addReport">确 定</el-button>
        <el-button @click="dialogVisible=false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ConTitle from "@/components/components/ConTitle";
import AssetTable from "@/components/components/AssetTable";

export default {
  name: "SynReport",
  components: {
    ConTitle,
    AssetTable,
  },
  methods: {
    monitor_event(EventName, EventArgs) {
      this.EventName = EventName;
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs;
    },
    depTime(e) {
      let str =
        new Date(e[0]).toLocaleDateString().replace(/\//g, e[1]) +
        new Date(e[0]).toLocaleTimeString();
      if (e[2]) {
        return str;
      } else {
        return new Date(e[0]).toLocaleDateString().replace(/\//g, e[1]);
      }
    },
    addReport() {
      this.dialogVisible = true;
      this.$refs["authorityDdata"].validate((res) => {
        if (!res) {
          return;
        } else {
          if (this.importStartEndTime[0] && this.importStartEndTime[0]) {
            this.reportData.importStartTime =
              this.importStartEndTime[0]
                .toLocaleDateString()
                .replace(/\//g, "-") + " 00:00:00";
            this.reportData.importEndTime =
              this.importStartEndTime[1]
                .toLocaleDateString()
                .replace(/\//g, "-") + " 23:59:59";
            this.reportData.deptId = this.deptId;
            this.reportData.flawType = this.reportData.flawType.join(",");
            this.reportData.handleStatus = this.reportData.handleStatus.join(
              ","
            );
            let data = this.qs.stringify(this.reportData);
            this.axios
              .post("/report/addSyntheticalReport", data)
              .then(({ data }) => {
                if (data.code == 200) {
                  this.message_box(data.msg);
                  this.search();
                } else {
                  this.$message.error(data.msg);
                }
                this.dialogVisible = false;
                this.importStartEndTime = "";
                for (let key in this.reportData) {
                  this.reportData[key] = "";
                }
              });
          } else {
            this.$message.error("请选择日期");
          }
        }
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
    search() {
      const url = "/report/loadAllSyntheticalReports";
      this.axios
        .post(url, this.qs.stringify(this.TestForm))
        .then((Response) => {
          const d = Response.data;
          if (d.code === 0) {
            this.pageTotal = d.count;
            let tab_data = [...d.data];
            this.tableData = tab_data.reverse();
            this.tableData.map((item) => {
              if (item.importTimeStart && item.importTimeEnd) {
                item.startEndTime =
                  item.importTimeStart.slice(0, 10) +
                  "到" +
                  item.importTimeEnd.slice(0, 10);
              }
              let mapDeptName = "";
              if (item.assetRange) {
                this.deptList.forEach((item1, index) => {
                  if (item1.pid == item.assetRange) {
                    mapDeptName = item1.title;
                  }
                });
              }
              item.assetOf = mapDeptName || item.assetRange || "全部资产";
              item.createTime1 = this.depTime([item.createTime, ".", 1]);
              return item;
            });
            console.log("tabData", this.tableData);
          } else {
            this.$message.error("获取数据失败");
          }
        });
    },

    asset_delete(row) {
      this.$confirm("是否要删除此报表文件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        let url = "/report/batchDeleteReports?ids=" + row[0].id;
        this.axios.post(url).then((Response) => {
          const d = Response.data;
          if (d.code === 200) {
            this.message_box(d.msg);
            this.search();
          } else {
            this.$message.error(d.msg);
          }
        });
      });
    },
    message_box(msg, type = "success") {
      this.$message({
        message: msg,
        type: type,
      });
    },
    download(row) {
      let routeData = this.$router.resolve({
        path: "/assetreportDownpage",
        query: { ids: JSON.stringify(row[0]) },
      });
      window.open(routeData.href, "_blank");
    },
    select_change_data(row) {
      let SelectRowList = [];
      row.map(function (d, i, a) {
        SelectRowList.push(d.id);
      });
      this.SelectRowList = SelectRowList;
    },
    monitor_event(EventName, EventArgs) {
      this.EventName = EventName;
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs;
    },
    batchDel() {
      if (this.SelectRowList.length === 0) {
        this.$message.error("请选择要删除的报表");
        return;
      }
      this.$confirm("是否要批量删除被选择的报表文件？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const url = "/report/batchDeleteReports";
        let data = { ids: this.SelectRowList };
        this.axios.post(url, this.qs.stringify(data)).then((Response) => {
          const d = Response.data;
          if (d.code === 200) {
            this.message_box(d.msg);
            this.search();
          } else {
            this.$message.error(d.msg);
          }
        });
      });
    },
  },
  // report/addSyntheticalReport?reportName=测试导入1&assetType=1&assetRange=192.168.1.1&importStartTime=2020-08-01 12:00:00&importEndTime=2020-08-21 12:00:00&handleStatus=1&flawType=1&deptId=22
  // reportName=test1&assetType=3&assetRange=&importStartTime=2020-5-22&importEndTime=2020-8-20&handleStatus=1&flawType=0&deptId=

  data() {
    return {
      deptId: "",
      importStartEndTime: "",
      reportData: {
        // 报表名称d
        reportName: "",
        // 资产信息
        assetType: "1",
        // 资产归属/资产ip
        assetRange: "",
        importStartTime: "",
        importEndTime: "",
        // 处置状态
        handleStatus: "",
        // 漏洞类型
        flawType: "",
        deptId: "",
      },
      dialogVisible: false,
      titlename: "综合报表",
      pageTotal: 0,
      EventName: "",
      EventArgs: "",
      tableTitle: [
        { key: "reportName", label: "报表名称", is_show: true },
        { key: "assetOf", label: "资产范围", is_show: true },
        { key: "startEndTime", label: "风险发现时间", is_show: true },
        { key: "createTime", label: "创建时间", is_show: true },
        // { key: "importTimeStart", label: "生成状态", is_show: true },
      ],
      tableData: [],
      HandleConfig: {
        text_algin: "center",
        buttonList: [
          {
            title: "下载",
            icon_name: "#iconxiazai",
            size: "mini",
            event_name: "download",
            event_args: "",
          },
          {
            title: "删除",
            icon_name: "#iconshanchu",
            size: "mini",
            event_name: "asset_delete",
            event_args: "",
          },
        ],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      // pickerOptions: {
      //   shortcuts: [
      //     {
      //       text: "最近一周",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //     {
      //       text: "最近一个月",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //     {
      //       text: "最近三个月",
      //       onClick(picker) {
      //         const end = new Date();
      //         const start = new Date();
      //         start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      //         picker.$emit("pick", [start, end]);
      //       },
      //     },
      //   ],
      // },
      handleStatusList: [
        { label: "待审核", value: "1" },
        { label: "待下发", value: "2" },
        { label: "待修复", value: "3" },
        { label: "待复测", value: "4" },
        { label: "已修复", value: "6" },
        { label: "已忽略", value: "7" },
      ],
      flawTypeList: [
        { label: "主机漏洞", value: "0" },
        { label: "应用漏洞", value: "1" },
        { label: "基线漏洞", value: "2" },
      ],
      deptList: "",
      // rules: {
      //   reportName: [
      //     { required: true, message: "请输入报表名称", trigger: "blur" },
      //   ],
      // },
      SelectRowList: [],
      TestForm: {
        limit: 10,
        page: 1,
      },
    };
  },

  created() {
    this.axios.get("/login/getUser").then(({ data }) => {
      this.deptId = data.data.user.deptid;
    }),
      this.axios.get("/dept/loadAllDept").then(({ data }) => {
        this.deptList = data.data;
        console.log("部门列表", this.deptList);
      });
    this.search();
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
};
</script>
