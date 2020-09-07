<template>
  <div class="log">
    <con-title
      CardTitleMenu
      @CurrentPageChange="CurrentPageChange"
      :name="titlename"
      :MenuTitleName="MenuTitleName">
      <template v-slot:bottom>
        <div class="title-button">
          <vul-button type="primary" size="small" @click="showLoadAll">归档设置</vul-button>
        </div>
      </template>
    </con-title>
    <el-card shadow="never" class="mr-1 mt-1">
      <filter-data
        :FilterList="FilterList"
        :FilterForm="FilterForm">
      </filter-data>
      <vul-button type="primary" size="small" @click="search">查询</vul-button>
      <vul-button type="primary" size="small" @click="exportData">批量导出</vul-button>
      <vul-button type="primary" size="small" @click="exportAll">全部导出</vul-button>
      <asset-table
        selection
        border
        pagination
        :pageTotal="pageTotal"
        :tableTitle="tableTitle"
        :tableData="tableData"
        @select-change-data="select_change_data"
        @page-currentsize-change="page_currentsize_change"
        @page-current-change="page_current_change">
    </asset-table>
    </el-card>
    <el-dialog
      title="归档设置"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <span>
        <el-date-picker
        is-range
          v-model="date"
          type="daterange"
          unlink-panels
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions">
        </el-date-picker>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="loadAll">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'
import FilterData from '@/components/components/FilterData'
import AssetTable from '@/components/components/AssetTable'

export default {
  name: 'LogList',
  components: {
    ConTitle,
    FilterData,
    AssetTable
  },
  data () {
    return {
      titlename: '系统日志',
      index: -1,
      pageTotal: 0,
      SelectRowList: [],
      MenuTitleName: [
        {index: 'all', name: '全部类型', id: -1},
        {index: 'asset', name: '登录日志', id: 0},
        {index: 'risk', name: '操作日志', id: 1},
        {index: 'report', name: '漏洞日志', id: 2},
        {index: 'config', name: '报表日志', id: 3},
        {index: 'other', name: '资产日志', id: 4}
      ],
      FilterList: [
        {name: 'loginip', label: '事件IP', type: 'input', placeholder: '请输入事件内容的关键字'},
        {name: 'logtime', label: '操作时间', type: 'date'},
        {name: 'loginname', label: '操作人', type: 'input', placeholder: '请输入操作人'}
      ],
      FilterForm: {
        logtime: ['', ''],
        loginip: '',
        loginname: ''
      },
      searchForm: {
        logtype: null,
        limit: 10,
        page: 1
      },
      tableTitle: [
        {key: 'loginip', label: '事件IP', is_show: true, text_algin: 'center'},
        {key: 'loginname', label: '操作人', is_show: true, text_algin: 'center'},
        {key: 'logtype', label: '日志类型', is_show: true, text_algin: 'center', filter: 'ReportTypeFilter'},
        {key: 'logremark', label: '事件描述', is_show: true, text_algin: 'center'},
        {key: 'logtime', label: '操作时间', is_show: true, text_algin: 'center'}
      ],
      tableData: [],
      dialogVisible: false,
      pickerOptions: {
          shortcuts: [{
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
          }
        }]
        },
      date: ''
    }
  },
  created() {
    this.search()
  },
  methods: {
    cancle () {
      this.date = null
      this.dialogVisible = false
    },
    CurrentPageChange (index) {
      this.searchForm.logtype = index
      if (index === -1) {
        this.searchForm.logtype = null
      }
      this.search()
    },
    search () {
      let data = {...this.searchForm}
      data.loginip = this.FilterForm.loginip
      data.startTime = this.FilterForm.logtime[0] !== '' ? this.FilterForm.logtime[0]: ''
      data.endTime = this.FilterForm.logtime[1] !== '' ? this.FilterForm.logtime[1]: ''
      data.loginname = this.FilterForm.loginname
      data = this.qs.stringify(data)
      let url = '/loginfo/loadAllLoginfo'
      this.axios.post(url, data).then((Response) => {
        const d = Response.data
        if (d.code === 0) {
          this.pageTotal = d.count
          this.tableData = [...d.data]
          console.log(d.data)
        } else {
          this.$message.error('获取日志列表数据失败')
        }
      })
    },
    showLoadAll () {
      this.dialogVisible = true
    },
    loadAll () {
      let data = {}
      if (!this.date) {
        this.$message.error('归档时间不能为空')
        return
      }
      console.log(this.date)
      data.startTime = this.date[0]
      data.endTime = this.date[1]
      let url = '/loginfo/logPigeonhole'
      this.axios.post(url, this.qs.stringify(data)).then((Response) => {
        const d = Response.data
        if (d.code === 200) {
          this.message_box('归档成功')
          // this.message_box('导出文件成功' + d.data[0].fileName)
          this.cancle()
          this.search()
        } else {
          console.log( 'dddd',d)
          this.$message.error(d.msg)
        }
      })
      this.dialogVisible = false
    },
    handleClose(done) {
      done()

    },
    exportAll () {
      const url = '/loginfo/exportLog'
      window.location.href = url
    },
    exportData () {
      if (this.SelectRowList.length === 0) {
        this.$message.error('未选择相应的信息')
        return
      }
      let data = this.qs.stringify({ids: this.SelectRowList})
      let url = '/loginfo/exportLog?' + data
      window.location.href = url
    },
    select_change_data (row) {
      let SelectRowList = []
      row.map(function (d, i, a) {
        SelectRowList.push(d.id)
      })
      console.log(SelectRowList)
      this.SelectRowList = SelectRowList
    },
    page_currentsize_change (val) {
      this.searchForm.limit = val
      this.search()
    },
    page_current_change (val) {
      while (val * this.searchForm.limit > this.pageTotal) {
        val -= 1
      }
      this.searchForm.page = val
      this.search()
    },
    message_box (msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    }
  }
}
</script>

<style scoped>
.log >>> .title-button{
  position: absolute;
  left: 90%;
  margin-top: -60px;
}
</style>
