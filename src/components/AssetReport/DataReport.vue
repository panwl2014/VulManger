<template>
  <div>
    <con-title :name="titlename"></con-title>
    <el-card shadow="never" class="mr-1 mt-1">
      <!-- <vul-button type="primary" size="small" @click="search">查询</vul-button> -->
      <vul-button size="small" @click="batchDel" plain>批量删除</vul-button>
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
    >
    </asset-table>
    </el-card>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'
import AssetTable from '@/components/components/AssetTable'

export default {
  name: 'DataReport',
  components: {
    ConTitle,
    AssetTable
  },
  data () {
    return {
      titlename: '数据报表',
      pageTotal: 0,
      EventName: '',
      EventArgs: '',
      tableTitle: [
        {key: 'name', label: '报表名称', is_show: true},
        {key: 'type', label: '报表类型', is_show: true},
        {key: 'format', label: '导出格式', is_show: true},
        {key: 'createTime', label: '创建时间', is_show: true},
        {key: 'createStatus', label: '生成状态', is_show: true, filter: 'ReportStatusFilter'}
      ],
      tableData: [],
      HandleConfig: {
        text_algin: 'center',
        buttonList: [
          {title: '下载', icon_name: '#iconxiazai', size: 'mini', event_name: 'download', event_args: ''},
          {title: '删除', icon_name: '#iconshanchu', size: 'mini', event_name: 'asset_delete', event_args: ''}
        ]
      },
      SelectRowList: [],
      TestForm: {
        limit: 10,
        page: 1
      }
    }
  },
  methods: {
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs
    },
    search () {
      const url = 'flawExcel/loadAll'
      this.axios.post(url, this.qs.stringify(this.TestForm)).then((Response) => {
        const d = Response.data
        if (d.code === 0) {
          this.pageTotal = d.count
          this.tableData = [...d.data]
        } else {
          this.$message.error('获取数据失败')
        }
      })
    },
    download (row) {
      window.location.href = row[0].filePath
    },
    asset_delete (row) {
      this.$confirm('是否要删除此报表文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = 'flawExcel/deleteEx?id=' + row[0].id
        this.axios.get(url).then((Response) => {
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
    batchDel () {
      if (this.SelectRowList.length === 0) {
        this.$message.error('请选择要删除的报表')
        return
      }
      this.$confirm('是否要批量删除被选择的报表文件？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = 'flawExcel/deleteListEx'
        let data = {ids: this.SelectRowList}
        this.axios.post(url, this.qs.stringify(data)).then((Response) => {
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
    },
    select_change_data (row) {
      let SelectRowList = []
      row.map(function (d, i, a) {
        SelectRowList.push(d.id)
      })
      this.SelectRowList = SelectRowList
    },
    page_currentsize_change (val) {
      this.TestForm.limit = val
      this.search()
    },
    page_current_change (val) {
      this.TestForm.page = val
      this.search()
    },
  },
  created() {
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
