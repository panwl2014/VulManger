<template>
  <div>
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
        <vul-button  size="small" @click="batch_delete" plain>批量删除</vul-button>
        <AssetTable
          selection
          pagination
          :loading="loading"
          @select-change-data="select_change_data"
          :pageTotal="pageTotal"
          @page-currentsize-change="page_currentsize_change"
          @page-current-change="page_current_change"
          :tableTitle="tableTitle"
          :tableData="tableData"
          :HandleConfig="HandleConfig"
          @MonitorEvent="monitor_event"
          >
        </AssetTable>
    </el-card>
    <el-dialog
      :title="flowchart.title"
      :visible.sync="dialogVisible"
      width="70%"
      :before-close="handleClose">
        <img :src="flowchart.data" width="900px" height="800px" />
    </el-dialog>
  </div>
</template>

<script>
import FilterData from '@/components/components/FilterData'
import AssetTable from '@/components/components/AssetTable'

export default {
  name: 'FlowManage2',
  components: {
    FilterData,
    AssetTable
  },
  data () {
    return {
      SelectRowList: [],
      loading: true,
      FilterList: [
        {name: 'deploymentId', label: '编号', type: 'input', options: [], placeholder: '请输入编号'},
        {name: 'deploymentName', label: '流程名称', type: 'input', placeholder: '请输入流程名称'}
      ],
      FilterForm: {
        deploymentId: '',
        deploymentName: '',
        page: 1,
        limit: 10
      },
      // 表格
      EventName: '',
      EventArgs: '',
      pageTotal: 0,
      tableTitle: [
        {key: 'id', label: '编号', is_show: true},
        {key: 'name', label: '流程名称', is_show: true},
        {key: 'deploymentTime', label: '创建时间', is_show: true}
      ],
      tableData: [],
      HandleConfig: {
        text_algin: 'center',
        buttonList: [
          {title: '查看流程图', size: 'mini', event_name: 'look_flow', event_args: ''},
          {title: '删除', size: 'mini', event_name: 'asset_delete', event_args: ''}
        ]
      },
      flowchart: {
        title: '',
        data: ''
      },
      dialogVisible: false
    }
  },
  methods: {
    search () {
      this.loading = true
      let data = {...this.FilterForm}

      data = this.qs.stringify(data)
      const url = '/prodeploy/loadAllDeployment?' + data
      this.axios.get(url, data).then((Response) => {
        const d = Response.data
        this.pageTotal = d.count
        this.tableData = d.data.reverse()
        this.loading = false
      })
    },
    page_currentsize_change (val) {
      this.FilterForm.limit = val
      this.search()
    },
    page_current_change (val) {
      this.FilterForm.page = val
      this.search()
    },
    look_flow (row) {
      this.flowchart.title = '【' + row[0].name + '】流程图'
      this.dialogVisible = true
      const url = '/prodeploy/viewProcessImage?deploymentId=' + row[0].id
      this.flowchart.data = url
    },
    asset_delete (row) {
      const url = '/prodeploy/deleteworkflow'
      this.$confirm('是否要删除【' + row[0].name + '】流程图？', '提示', {
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
      // 批量删除
      const url = '/prodeploy/batchDeleteworkflow'
      if (this.SelectRowList.length === 0) {
        this.$message.error('请选择要删除的流程信息！')
        return
      }
      this.$confirm('你确定要批量删除所勾选的流程信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = this.qs.stringify({ids: this.SelectRowList})
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
    handleClose (done) {
      done()
      this.flowchart = {title: '', data: ''}
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
    message_box (msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    }
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
  },
  beforeMount () {
    this.search()
  }
}
</script>
