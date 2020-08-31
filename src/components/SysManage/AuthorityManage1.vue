<template>
  <div class="log">
    <con-title :name="titlename"></con-title>
    <el-card shadow="never" class="mr-1 mt-1">
      <filter-data :FilterList="FilterList" :FilterForm="FilterForm">
        <template v-slot:ButtonContent>
          <div class="el-col-8">
            <el-form-item>
              <el-button type="primary" size="small">查询</el-button>
              <el-button type="primary" size="small">重置</el-button>
            </el-form-item>
          </div>
        </template>
      </filter-data>

      <asset-table
        :selection="fales"
        :HandleConfig="HandleConfig"
        pagination
        :pageTotal="pageTotal"
        :tableTitle="tableTitle"
        :tableData="tableData"
        @MonitorEvent="monitor_event"
      ></asset-table>
    </el-card>
  </div>
</template>

<script>
import ConTitle from "@/components/components/ConTitle";
import FilterData from "@/components/components/FilterData";
import AssetTable from "@/components/components/AssetTable";

export default {
  name: "LogList",
  components: {
    ConTitle,
    FilterData,
    AssetTable,
  },
  methods: {
    monitor_event(EventName, EventArgs) {
      this.EventName = EventName;
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs;
    },
    authority_delete() {
      alert("删除权限");
    },
    authority_edit() {
      alert("编辑权限");
    },
  },
  data() {
    return {
      titlename: "权限管理",
      pageTotal: 100,
      MenuTitleName: [
        { index: "all", name: "全部类型" },
        { index: "asset", name: "资产日志" },
        { index: "risk", name: "风险日志" },
        { index: "report", name: "报表日志" },
        { index: "config", name: "配置日志" },
        { index: "other", name: "其他日志" },
      ],
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
      FilterList: [
        {
          name: "find_date",
          label: "权限名称",
          type: "input",
          placeholder: "请输入权限名称",
        },
        {
          name: "desc",
          label: "权限编码",
          type: "input",
          placeholder: "请输入权限编码",
        },
      ],
      FilterForm: {
        find_date: ["", ""],
        desc: "",
      },
      tableTitle: [
        {
          key: "id",
          label: "ID",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "mmenu_id",
          label: "菜单ID",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "auth_name",
          label: "权限名称",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "auth_code",
          label: "权限编码",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "can_use",
          label: "是否可用",
          is_show: true,
          text_algin: "center",
        },
        {
          key: "slot_code",
          label: "排序码",
          is_show: true,
          text_algin: "center",
        },
      ],
      tableData: [
        {
          id: 67,
          mmenu_id: 14,
          auth_name: "部门查询",
          auth_code: "depv:sd",
          can_use: "可用",
          slot_code: 23,
        },
        {
          id: 67,
          mmenu_id: 14,
          auth_name: "部门查询",
          auth_code: "depv:sd",
          can_use: "可用",
          slot_code: 23,
        },
        {
          id: 67,
          mmenu_id: 14,
          auth_name: "部门查询",
          auth_code: "depv:sd",
          can_use: "可用",
          slot_code: 23,
        },
        {
          id: 67,
          mmenu_id: 14,
          auth_name: "部门查询",
          auth_code: "depv:sd",
          can_use: "可用",
          slot_code: 23,
        },
        {
          id: 67,
          mmenu_id: 14,
          auth_name: "部门查询",
          auth_code: "depv:sd",
          can_use: "可用",
          slot_code: 23,
        },
        {
          id: 67,
          mmenu_id: 14,
          auth_name: "部门查询",
          auth_code: "depv:sd",
          can_use: "可用",
          slot_code: 23,
        },
        {
          id: 67,
          mmenu_id: 14,
          auth_name: "部门查询",
          auth_code: "depv:sd",
          can_use: "可用",
          slot_code: 23,
        },
        {
          id: 67,
          mmenu_id: 14,
          auth_name: "部门查询",
          auth_code: "depv:sd",
          can_use: "可用",
          slot_code: 23,
        },
      ],
    };
  },
  watch: {
    EventName (newValue, oldValue) {
      if (newValue !== '') {
        // 通过监控EventName值的变化来执行相应的函数
        // eslint-disable-next-line
        eval('this.' + newValue + "(this.EventArgs)")
      }
      this.EventName = ''
      this.EventArgs = ''
    }
  }
};
</script>

<style scoped>
.log >>> .title-button {
  position: absolute;
  left: 90%;
  margin-top: -60px;
}
</style>
