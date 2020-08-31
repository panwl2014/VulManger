<template>
  <div>
    <con-title
      CardTitleMenu
      :name='titlename'
      >
      </con-title>
      <el-card class="mr-1 mt-1">
      <filter-data
        :FilterList="FilterList"
        :FilterForm="FilterForm">
      </filter-data>
      <div style="float: right;" class="mr-nomarl">
        <vul-button type="primary" size="small" @click="search">查询</vul-button>
        <vul-button type="primary" size="small" @click="rest">重置</vul-button>
      </div>
      <div style="float: left;" class="mt-3 pb-2">
        <vul-button size="small" @click="batchTaskBack" plain>批量撤回</vul-button>
      </div>
      
      <asset-table
      selection
      pagination
      :loading="loading"
      :pageTotal="pageTotal"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :HandleConfig="HandleConfig"
      @MonitorEvent="monitor_event"
      @select-change-data="select_change_data"
      @page-currentsize-change="page_currentsize_change"
      @page-current-change="page_current_change"
    >
    </asset-table>
    </el-card>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'
import FilterData from '@/components/components/FilterData'
import AssetTable from '@/components/components/AssetTable'

export default {
  name: 'DisposedList',
  components: {
    ConTitle,
    FilterData,
    AssetTable
  },
  data () {
    return {
      titlename: '已办任务',
      pageTotal: 0,
      FilterList: [
        {name: 'id', label: '漏洞ID', type: 'input', placeholder: '请输入漏洞ID'},
        // {name: 'flawIp', label: '资产名称', type: 'input', placeholder: '请输入IP或域名'},
        {name: 'flawName', label: '漏洞名称', type: 'input', text_algin: 'left', placeholder: '请输入漏洞名称'},
        {name: 'handleStatus', label: '处理状态', type: 'select', options: []},
        {name: 'flawSource', label: '漏洞来源', type: 'select', multiple: true, options: []},
        {name: 'flawGrade', label: '漏洞等级', type: 'select', options: [{label: '低危', value: '0'}, {label: '中危', value: '2'}, {label: '高危', value: '3'}]},
        {name: 'deptId', label: '归属部门', type: 'treeselect', options: [], placeholder: '请选择部门'}
        // {name: 'findTime', label: '处置时间', type: 'date'}
      ],
      // 条件过滤框的options
      handleStatusList: [
        {label: '待审核', text: '待审核', value: '1'},
        {label: '待下发', text: '待下发', value: '2'},
        {label: '待修复', text: '待修复', value: '3'},
        {label: '待复测', text: '待复测', value: '4'},
        {label: '已修复', text: '已修复', value: '6'},
        {label: '已忽略', text: '已忽略', value: '7'}],
      FilterForm: {
        flawGrade: '',
        flawName: '',
        handleStatus: '',
        deptId: null,
        findTime: ['', ''],
        flawIp: '',
        flawType: '',
        flawSource: ''
      },
      EventName: '',
      EventArgs: '',
      tableTitle: [
        {key: 'id', label: '漏洞ID', is_show: true, width: '120', text_algin: 'center', component_config: {type: 'icon', rule: {key: 'flawGrade', content: {'0': '#icondiwei', '1': '#iconzhongwei', '2': '#icongaowei'}}}},
        {key: 'taskId', label: '任务ID', is_show: true, text_algin: 'center'},
        {key: 'flawIdentifying', label: '漏洞编号', is_show: true, text_algin: 'center'},
        {key: 'flawName', label: '漏洞名称', is_show: true, text_algin: 'center'},
        {key: 'flawType', label: '漏洞类型', is_show: true, filter: 'RiskTypeFilter', text_algin: 'center'},
        {key: 'findTime', label: '发现时间', is_show: true, text_algin: 'center'},
        {key: 'flawIp', label: '资产名称', is_show: true, text_algin: 'center'},
        {key: 'deptName', label: '所属部门', is_show: true, text_algin: 'center'},
        {key: 'handleStatus', label: '处置状态', is_show: true, filter: 'HandleStatusFilter', text_algin: 'center'},
        {key: 'manageTime', label: '收到时间', is_show: true, text_algin: 'center'}
      ],
      tableData: [],
      HandleConfig: {
        text_algin: 'center',
        width: '150',
        fixed: 'right',
        buttonList: [
          {title: '详情', type: 'text', line: false, icon_name: '', size: 'mini', event_name: 'asset_edit', event_args: ''},
          {title: '撤回', type: 'text', icon_name: '', size: 'mini', event_name: 'taskBack', event_args: ''}
        ]
      },
      loading: true,
      submitForm: {
        limit: 10,
        page: 1
      },
      SelectRowList: []
    }
  },
  methods: {
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs
    },
    search () {
      this.loading = true
      for (let key in this.FilterForm) {
        if (key === 'findTime') {
          if (this.FilterForm[key][0] !== '') {
            this.submitForm.startTime = this.FilterForm[key][0] ? this.FilterForm[key][0] + ' 00:00:00' : ''
            this.submitForm.endTime = this.FilterForm[key][1] ? this.FilterForm[key][1] + ' 23:59:59' : ''
          } 
        }else if (key === 'flawSource') {
          if (this.FilterForm['flawSource'] && this.FilterForm['flawSource'].length > 1) {
            delete this.submitForm.flawSource
            this.submitForm.flawSources = this.FilterForm['flawSource'].join(',')
          } else {
            delete this.submitForm.flawSources
            this.submitForm.flawSource = this.FilterForm['flawSource'][0]
          }
        } else {
          this.submitForm[key] = this.FilterForm[key]
        }
      }
      // const url = '/retainTask/loadMyRetainFlawTask'
      const url = '/retainTask/loadMyRetainFlawTaskNews'
      this.axios.post(url, this.qs.stringify(this.submitForm)).then((Response) => {
        const d = Response.data
        this.pageTotal = d.count
        let tableData = []
        // d.data.map(function (d, i, a) {
        //   if (d.flaw !== null) {
        //     let tmp = {...d.flaw}
        //     tmp.status = d.status.toString()
        //     tmp.taskId = d.id
        //     tmp.task = {...d}
        //     delete tmp.task.flaw
        //     tableData.push(tmp)
        //   }
        // })
        this.loading = false
        this.tableData = [...d.data]
      })
    },
    select_change_data (row) {
      let SelectRowList = []
      row.map(function (d, i, a) {
        SelectRowList.push(d)
      })
      this.SelectRowList = SelectRowList
    },
    asset_edit (row) {
      this.$router.push({name: 'riskdetails', params: row[0]})
    },
    page_currentsize_change (val) {
      this.submitForm.limit = val
      this.search()
    },
    page_current_change (val) {
      this.submitForm.page = (val - 1) * this.submitForm.limit
      this.search()
    },
    batchTaskBack () {
      if (this.SelectRowList.length === 0) {
        this.$message.error('请选择相应的信息')
        return
      }
      this.$confirm('是否要批量撤回被勾选的任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let success = 0
        let error = 0
        this.SelectRowList.map(function (d, i, a) {
        let url = '/task/jumpTask?processInstanceId=' + d.processInstanceId + '&taskDefinitionKey=' + d.taskDefinitionKey
          this.axios.get(url).then((Response) => {
            if (Response.data.code === 200) {
              success += 1
            } else {
              error += 1
            }
            if ((success + error) === this.SelectRowList.length) {
              if (success > 0) {
                this.message_box('成功:' + success + '条数据')
              }
              
              if (error > 0) {
                this.$message.error('失败: ' + error + '条数据')
              }
              this.search()
            }
          })
        }, this)
        
      })
      
    },
    rest () {
      console.log(this.FilterForm)
      for (let key in this.FilterForm) {
        if (key === 'deptId') {
          this.FilterForm[key] = null
        } else if (key === 'findTime') {
          this.FilterForm[key] = ''
        } else {
          this.FilterForm[key] = ''
        }
      }
      this.search()
    },
    taskBack (row) {
      console.log(row)
      let url = '/task/jumpTask?processInstanceId=' + row[0].processInstanceId + '&taskDefinitionKey=' + row[0].taskDefinitionKey
      this.$confirm('是否要撤回此任务？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
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
    message_box (msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    gain_orginlist () {
      const url = '/dept/loadDeptManagerLeftTreeJson'
      this.axios.get(url).then((Response) => {
        const d = Response.data.data
        // let List = []
        const l = d.length
        d.map(function (data, index, arr) {
          d[index].label = d[index].title
          d[index].open = true
          d.map(function (data1, index1, arr1) {
            if (data.id === data1.parentId) {
              d[index].children.push(data1)
            } else if (data.id !== data1.parentId && index1 + 1 === l) {
              if (d[index].children.length === 0) {
                delete d[index].children
              }
            }
          })
        })
        this.FilterList[5]['options'] = [d[0]]
      })
    },
  },
  mounted () {
    this.search()
    this.gain_orginlist()
    // 数据初始化
    this.FilterList[2]['options'] = this.handleStatusList
    for(let key in this.FilterList) {
      if (this.FilterList[key]['name'] === 'flawSource') {
        this.FilterList[key]['options'] = this.display.flawSouceList
      }
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
  }
}
</script>

<style scoped>
.el-col-8 .el-button{
  margin: 10px 0px 0px 10px;
  float: right;
}
.el-form-item{
  width: 80%;
}
</style>
