<template>
  <div v-if="!HtmlData">
    <con-title
      :name="titlename"
      CardTitleMenu
      @CurrentPageChange="CurrentPageChange"
      :MenuTitleName="MenuTitleName"></con-title>
    <template v-if="viewname">
      <el-card class="mt-1 mr-1">
        <filter-data :FilterList="FilterList" :FilterForm="FilterForm">
          <template v-slot:ButtonContent>
            <div class="el-col-8">
              <el-form-item>
                <vul-button type="primary" size="small" @click="search">查询</vul-button>
              </el-form-item>
            </div>
          </template>
        </filter-data>
        <vul-button size="small" @click="flow_add" plain>添加流程</vul-button>
        <vul-button size="small" @click="batch_delete" plain>批量删除</vul-button>
        <AssetTable
          selection
          pagination
          :loading="loading"
          @select-change-data="select_change_data"
          :pageTotal="pageTotal"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :HandleConfig="HandleConfig"
          @page-currentsize-change="page_currentsize_change"
          @page-current-change="page_current_change"
          @MonitorEvent="monitor_event"
          >
        </AssetTable>
      </el-card>
      <el-dialog
        title="流程图管理"
        :visible.sync="dialogVisible"
        class="MyDialog"
        :before-close="handleClose"
        >
          <iframe :src="flowurl" width="100%" height="100%" frameborder=0 scroll="yes"></iframe>
      </el-dialog>
    </template>
    <template v-else>
      <router-view></router-view>
    </template>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'
import FilterData from '@/components/components/FilterData'
import AssetTable from '@/components/components/AssetTable'

export default {
  name: 'FlowManage',
  components: {
    ConTitle,
    FilterData,
    AssetTable
  },
  data () {
    return {
      titlename: '流程管理',
      pageTotal: 0,
      dialogVisible: false,
      MenuTitleName: [
        {index: 'one', name: '流程模型管理', id: 'one'},
        {index: 'two', name: '流程部署管理', id: 'two'}
      ],
      viewname: true,
      flowurl: '',
      HtmlData: '',
      loading: true,
      FilterList: [
        {name: 'modelId', label: '编号', type: 'input', options: [], placeholder: '请输入编号'},
        {name: 'modelName', label: '流程名称', type: 'input', placeholder: '请输入流程名称'}
      ],
      FilterForm: {
        modelId: '',
        modelName: '',
        page: 1,
        limit: 10
      },
      tableTitle: [
        {key: 'id', label: '编号', is_show: true},
        {key: 'name', label: '流程名称', is_show: true},
        {key: 'createTime', label: '创建时间', is_show: true},
        {key: 'lastUpdateTime', label: '最后更新时间', is_show: true}
      ],
      tableData: [],
      EventName: '',
      EventArgs: '',
      HandleConfig: {
        text_algin: 'center',
        width: '250',
        buttonList: [
          {title: '编辑', size: 'mini', event_name: 'asset_edit', event_args: ''},
          {title: '流程发布', size: 'mini', event_name: 'asset_release', event_args: ''},
          {title: '删除', size: 'mini', event_name: 'asset_delete', event_args: ''}
        ]
      },
      SelectRowList: []
    }
  },
  methods: {
    CurrentPageChange (index) {
      if (index === 'one') {
        this.viewname = true
        this.search()
      } else {
        this.viewname = false
      }
    },
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      this.EventArgs = EventArgs
    },
    select_change_data (row) {
      let SelectRowList = []
      row.map(function (d, i, a) {
        SelectRowList.push(d.id)
      })
      this.SelectRowList = SelectRowList
    },
    page_currentsize_change (val) {
      this.FilterForm.limit = val
      this.search()
    },
    page_current_change (val) {
      this.FilterForm.page = val
      this.search()
    },
    search () {
      this.loading = true
      let data = {...this.FilterForm}
      data = this.qs.stringify(data)
      const url = '/promodel/loadAllProcessModel?' + data
      this.axios.get(url).then((Response) => {
        const d = Response.data
        this.pageTotal = d.count
        this.tableData = d.data.reverse()
        this.loading = false
      })
    },
    handleClose (done) {
      done()
      this.flowurl = ''
    },
    flow_add () {
      this.dialogVisible = true
      const url = '/promodel/onlineModel'
      this.axios.get(url).then((Response) => {
        const u = '/editor?modelId=' + Response.data.data
        this.flowurl = u
        this.search()
      })
    },
    asset_edit (row) {
      this.dialogVisible = true
      const url = '/editor?modelId=' + row[0].id
      this.flowurl = url
    },
    asset_delete (row) {
      const url = '/promodel/deleteProcessModel'
      this.$confirm('你确定要删除【' + row[0].name + '】这条流程图信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(url, 'id=' + row[0].id).then((Response) => {
          const d = Response.data
          if (d.code === 200) {
            this.message_box(d.msg)
            this.search()
          } else {
            this.$message.error(d.msg)
          }
        })
      })
    },
    asset_release (row) {
      const url = '/promodel/deployModel'
      this.$confirm('确定要发布【' + row[0].name + '】流程图吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(url, 'id=' + row[0].id).then((Response) => {
          const d = Response.data
          if (d.code === 200) {
            this.message_box(d.msg)
            this.search()
          } else {
            this.$message.error(d.msg)
          }
        })
      })
    },
    batch_delete () {
      const url = '/promodel/batchdeleteProcessModel'
      if (this.SelectRowList.length === 0) {
        this.$message.error('请选择要删除的记录')
        return
      }
      this.$confirm('你确定要批量删除所选中的记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let data = {'ids': this.SelectRowList}
        data = this.qs.stringify(data)
        this.axios.post(url, data).then((Response) => {
          const d = Response.data
          if (d.code === 200) {
            this.message_box(d.msg)
            this.search()
          } else {
            this.$message.error(d.msg)
          }
        })
      })
    },
    message_box (msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    }
  },
  beforeMount () {
    this.search()
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
}
</script>

<style scoped>
.MyDialog >>> .el-dialog {
  width: 1050px !important;
  height: 800px !important;
}
.MyDialog >>> .el-dialog__body {
  width: 1000px !important;
  height: 700px !important;
}
</style>
