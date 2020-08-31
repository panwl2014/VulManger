<template>
  <div class="vulreport">
    <con-title :name="titlename"></con-title>
    <el-card class="mt-1 mr-1">
      <el-form label-width="80px">
        <el-row>
          <el-col
          v-for="i in FilterList"
          :key="i.name"
          :span="8">
            <el-form-item :label="i.label">
              <template v-if="i.type === 'input'">
                <el-input v-model="FilterForm[i.name]" :placeholder="i.placeholder"></el-input>
              </template>
              <template v-else-if="i.type === 'select'">
                <el-select v-model="FilterForm[i.name]" :placeholder="i.placeholder">
                  <el-option
                    v-for="o in i.options"
                    :key="o.value"
                    :label="o.label"
                    :value="o.value">
                    </el-option>
                </el-select>
              </template>
              <template v-else-if="i.type === 'date'">
                <el-date-picker
                  v-model="FilterForm[i.name]"
                  type="daterange"
                  unlink-panels
                  :clearable="false"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </template>
              <template v-else-if="i.type === 'treeselect'">
                <tree-select :options="i.options" v-model="FilterForm[i.name]"  :clearable="false" appendToBody :normalizer="normalizer" :defaultExpandLevel="Infinity" :placeholder="i.placeholder"></tree-select>
              </template>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="float: right;" class="mr-nomarl">
        <vul-button type="primary" size="small" @click="search">查询</vul-button>
        <vul-button size="small" @click="rest">重置</vul-button>
      </div>
      <div style="float: left;" class="mt-3 pb-2">
        <vul-button size="small" @click="batchDelete" plain>批量移除</vul-button>
        <vul-button size="small" @click="show_add_dialog" plain>添加</vul-button>
        <!-- <vul-button size="middle" plain>批量导出</vul-button> -->
      </div>
      <asset-table
        selection
        pagination
        :loading="loading"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :HandleConfig="HandleConfig"
        :pageTotal="pageTotal"
        @MonitorEvent="monitor_event"
        @select-change-data="select_change_data"
        @page-currentsize-change="page_currentsize_change"
        @page-current-change="page_current_change"
      ></asset-table>
    </el-card>
    <el-dialog
    title="白名单信息"
    :visible.sync="dialogVisible"
    width="45%"
    :before-close="handleClose">
    <span>
      <el-form label-width="100px" :model="RiskAddForm" ref="RiskAddForm">
        <el-row type="flex" class="flex-wrap-wrap">
          <el-col :span="12">
            <el-form-item
              prop="type"
              :rules="[
                {required: true, message: '请选择白名单类型', trigger: 'blur'}
              ]"
              label="白名单类型"
              :disabled="editModel">
              <el-select v-model="RiskAddForm.type" @change="test" placeholder="请选择白名单类型">
                <el-option label="例外库" value="0"></el-option>
                <el-option label="报备库" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="flawName"
              :rules="[{required: true, message: '请输入漏洞名称', trigger: 'blur'}]"
              label="漏洞名称">
              <el-input :disabled="editModel" v-model="RiskAddForm.flawName" placeholder="请填写漏洞名称" maxlength="50"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="flawIp"
              :rules="[
                {required: true, message: '请输入资产名称', trigger: 'blur'}
              ]"
              label="关联资产">
              <el-input v-model="RiskAddForm.flawIp" placeholder="请填写漏洞关联资产"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="RiskAddForm.type === '1'">
            <el-form-item
              prop="reportTimeStr"
              :rules="[{required: true, message: '请输入报备结束时间', trigger: 'blur'}]"
              label="结束时间"
              :disabled="editModel">
              <el-date-picker
                v-model="RiskAddForm.reportTimeStr"
                type="datetime"
                :picker-options="pickerOptions"
                value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="请选择报备结束时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="归属部门">
              <tree-select
                :disabled="editModel"
                v-model="RiskAddForm.deptName"
                :options="OrgOptions"
                :normalizer="normalizer"
                :defaultExpandLevel="Infinity"
                placeholder="请选择归属部门"></tree-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item
              prop="flawType"
              :rules="[
                {required: true, message: '请选择漏洞类型', trigger: 'blur'}
              ]"
              label="漏洞类型"
              :disabled="editModel">
              <el-select v-model="RiskAddForm.flawType" placeholder="请选择漏洞类型">
                <el-option label="主机漏洞" value="0"></el-option>
                <el-option label="应用漏洞" value="1"></el-option>
                <el-option label="基线漏洞" value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="flawGrade"
              :rules="[
                {required: true, message: '请选择漏洞等级', trigger: 'blur'}
              ]"
              label="漏洞等级">
              <el-select v-model="RiskAddForm.flawGrade" placeholder="请选择漏洞等级">
                <el-option label="低危" :value="0"></el-option>
                <el-option label="中危" :value="1"></el-option>
                <el-option label="高危" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="漏洞详情">
              <el-input v-model="RiskAddForm.flawDetails" placeholder="请填写漏洞详情"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item
              prop="flawDescription"
              :rules="[{required: true, message: '请输入漏洞描述', trigger: 'blur'}]"
              label="漏洞描述">
              <el-input :disabled="editModel" v-model="RiskAddForm.flawDescription" placeholder="请填写漏洞描述"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="漏洞影响">
              <el-input v-model="RiskAddForm.flawHazard" placeholder="请填写漏洞影响"></el-input>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item
              prop="flawSolution"
              :rules="[{required: true, message: '请输入解决方案', trigger: 'blur'}]"
              label="解决方案">
              <el-input :disabled="editModel" v-model="RiskAddForm.flawSolution" placeholder="请填写解决方案"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              prop="flawIdentifying"
              :rules="[{required: true, message: '请输入漏洞标识', trigger: 'blur'}]"
              label="漏洞标识">
              <el-input v-model="RiskAddForm.flawIdentifying" :disabled="editModel" placeholder="请填写CVE或CNVD漏洞标识" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            v-if="RiskAddForm.flawType === '0'
            || RiskAddForm.flawType === '2'
            || RiskAddForm.flawType === ''"
          >
            <el-form-item label="CVSS分值">
            <el-input v-model="RiskAddForm.flawCvss" :disabled="editModel" placeholder="请填写漏洞CVSS分值" maxlength="10"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12"
            v-if="RiskAddForm.flawType === '1'
            || RiskAddForm.flawType === ''"
          >
            <el-form-item label="漏洞分类">
              <el-input v-model="RiskAddForm.flawClassification" placeholder="请填写漏洞分类"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12"
            v-if="RiskAddForm.flawType === '0'
            || RiskAddForm.flawType === '2'
            || RiskAddForm.flawType === ''"
          >
            <el-form-item label="相关端口">
              <el-input v-model="RiskAddForm.flawUrl" :disabled="editModel" placeholder="请填写相关端口" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </span>
    <span slot="footer" class="dialog-footer">
      <!-- <el-button type="primary">修 改</el-button> -->
      <el-button type="primary" @click="submit_add">添 加</el-button>
      <el-button @click="cancle">取 消</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'
import AssetTable from '@/components/components/AssetTable'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'VulReport',
  components: {
    ConTitle,
    AssetTable,
    TreeSelect
  },
  data () {
    return {
      titlename: '白名单',
      loading: true,
      // 条件过滤框的options
      handleStatusList: [
        {label: '待审核', text: '待审核', value: '1'},
        {label: '待下发', text: '待下发', value: '2'},
        {label: '待修复', text: '待修复', value: '3'},
        {label: '待复测', text: '待复测', value: '4'},
        {label: '已修复', text: '已修复', value: '6'},
        {label: '已忽略', text: '已忽略', value: '7'}],
      // 表单过滤变量
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
      FilterList: [
        {name: 'id', label: '漏洞ID', type: 'input', placeholder: '请输入漏洞ID'},
        {name: 'flawIp', label: '资产名称', type: 'input', placeholder: '请输入IP或域名'},
        {name: 'flawName', label: '漏洞名称', type: 'input', placeholder: '请输入漏洞名称'},
        // {name: 'handleStatus', label: '处理状态', type: 'select', options: []},
        {name: 'flawSource', label: '漏洞来源', type: 'select', multiple: true, options: []},
        {name: 'flawGrade', label: '漏洞等级', type: 'select', options: [{label: '低危', value: '0'}, {label: '中危', value: '1'}, {label: '高危', value: '2'}]},
        // {name: 'deptId', label: '归属部门', type: 'treeselect', options: [], placeholder: '请选择部门'},
        // {name: 'findTime', label: '处置时间', type: 'date'}
        // {name: 'flawType', label: '漏洞类型', type: 'select', options: [{label: '全部', value: ''}, {label: '主机漏洞', value: 'HOST'}, {label: '应用漏洞', value: 'APP'}]}
      ],
      tableTitle: [
        {key: 'id', label: '漏洞ID', is_show: true, text_algin: 'center', width: '100', component_config: {type: 'icon', rule: {key: 'flawGrade', content: {'0': '#icondiwei', '1': '#iconzhongwei', '2': '#icongaowei'}}}},
        {key: 'flawIp', label: '资产名称', is_show: true, text_algin: 'center', width: '200'},
        {key: 'flawName', label: '漏洞名称', is_show: true, text_algin: 'center'},
        {key: 'flawIdentifying', label: '漏洞标识', is_show: true, text_algin: 'center'},
        {key: 'type', label: '白名单类型', is_show: true, width: '100', text_algin: 'center', filter: 'baiMDFilter'},
        {key: 'findTime', label: '发现时间', is_show: true, text_algin: 'center'},
        // {key: 'handleStatus', label: '处理状态', filter: 'HandleStatusFilter', event_args: '', is_show: true, text_algin: 'center', component_config: {type: 'css', rule: {key: 'handleStatus', content: {'0': '#BC0000', 'other': '#0E76D7'}}}},
        {key: 'reportTime', label: '报备结束时间', is_show: true, text_algin: 'center'},
        // {key: 'deptName', label: '归属部门', is_show: true, text_algin: 'center'},
        {key: 'flawSource', label: '漏洞来源', filter: 'RiskSrcFilter', is_show: true, text_algin: 'center'}
      ],
      tableData: [],
      HandleConfig: {
        width: '100',
        text_algin: 'center',
        fixed: 'right',
        buttonList: [
          // {title: '详情', icon_name: '#iconxiangqing', size: 'mini', event_name: 'asset_details', event_args: ''},
          {title: '删除', icon_name: '#iconshanchu', size: 'mini', event_name: 'asset_delete', event_args: '', disabled_cond: {rule: {'4': true}, key: 'asset_status_id'}}
        ]
      },
      SelectRowList: [],
      pageTotal: 0,
      submitForm: {
        page: 1,
        limit: 10
      },
      OrgOptions: [],
      EventName: '',
      EventArgs: '',
      // 漏洞添加
      dialogVisible: false,
      RiskAddForm: {
        type: '',
        reportTimeStr: null,
        // assetsId: '', // 资产ID
        flawName: '', // 漏洞名称
        flawIp: '', // 资产名称
        flawGrade: '', // 漏洞等级
        flawDetails: '', // 漏洞详情
        flawDescription: '', // 漏洞描述
        flawType: '', // 漏洞类型
        flawSolution: '', // 解决方案
        flawIdentifying: '', // 漏洞标识
        flawCvss: '', // CVSS分值
        flawHazard: '', // 漏洞影响
        flawClassification: '', // 漏洞分类
        flawUrl: '', // 相关端口
        flawSource: 'manual', // 漏洞来源
        deptName: null // 归属部门
      },
      limit: 10,
      page: 1,
      TestForm: {},
      editModel: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7  
        }
      },
      stepsList: []
    }
  },
  methods: {
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      // EventArgs => 包含当前表格row数据、还有相应的arg
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
      this.limit = val
      this.search()
    },
    page_current_change (val) {
      this.page = val
      this.search()
    },
    search () {
      const url = '/flawLibrary/loadAllFlawLib'
      for (let key in this.FilterForm) {
        if (key === 'findTime') {
          if (this.FilterForm[key][0] !== '') {
            this.submitForm.startTime = this.FilterForm[key][0] ? this.FilterForm[key][0] + ' 00:00:00' : ''
            this.submitForm.endTime = this.FilterForm[key][1] ? this.FilterForm[key][1] + ' 23:59:59' : ''
          } 
        } else if (key === 'flawSource') {
          if (this.FilterForm['flawSource'] && this.FilterForm['flawSource'].length === 2) {
            this.submitForm.flawSources = this.FilterForm['flawSource'].join(',')
          } else {
            this.submitForm.flawSource = this.FilterForm['flawSource']
          }
        } else {
          this.submitForm[key] = this.FilterForm[key]
        }
      }
      this.submitForm.page = this.page
      this.submitForm.limit = this.limit
      console.log(this.submitForm)
      this.axios.post(url, this.qs.stringify(this.submitForm)).then((Response) => {
        const d = Response.data
        this.pageTotal = d.count
        if (d.code === 0) {
          this.tableData = [...d.data]
        } else {
          this.$message.error('获取数据失败')
        }
        this.loading = false
        this.submitForm = {}
      })
    },
    test () {
      console.log(this.RiskAddForm)
    },
    submit_add () {
      this.$refs['RiskAddForm'].validate((valid) => {
        if (valid) {
          let url = '/flawLibrary/addFlawLib'
          let date = new Date()
          this.RiskAddForm.flawSource = 'manual'
          if (this.RiskAddForm.reportTimeStr === null || this.RiskAddForm.reportTimeStr === '') this.RiskAddForm.reportTimeStr = date.toLocaleString('chinese', {hour12: false})
          if (this.RiskAddForm.type === '0') {
            this.RiskAddForm.reportTimeStr = null
          }
          this.axios.post(url, this.qs.stringify(this.RiskAddForm)).then((Response) => {
            const d = Response.data
            if (d.code === 200) {
              this.message_box(d.msg)
              this.search()
            } else {
              this.$message.error(d.msg)
              this.search()
            }
            this.cancle()
          })
        } else {
          return false
        }
      })
      
    },
    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children
      }
    },
    asset_details (row) {
      this.$router.push({name: 'riskdetails', params: row[0]})
    },
    asset_delete (row) {
      let url = '/flawLibrary/deleteFlawLib?id=' + row[0].id
      this.$confirm('是否批量删除所选中的漏洞信息？', '提示', {
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
            this.search()
          }
        })
      })
    },
    batchDelete () {
      if (this.SelectRowList.length === 0) {
        this.$message.error('请选择要操作的数据')
        return
      }
      this.$confirm('是否批量删除所选中的漏洞信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let url = '/flawLibrary/deleteListFlawLib'
        this.axios.post(url, this.qs.stringify({ids: this.SelectRowList}), { arrayFormat: 'repeat' }).then((response) => {
          const d = response.data
          if (d.code === 200) {
            this.message_box(d.msg)
            this.search()
          } else {
            this.$message.error(d.msg)
          }
        })
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
          d[index].value = d[index].title
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
        this.OrgOptions = [d[0]]
        // this.FilterList[6]['options'] = [d[0]]
      })
    },
    show_add_dialog () {
      this.gain_orginlist()
      // this.RiskAddForm.assetsId = parseInt(new Date().getTime() / 1000)
      this.dialogVisible = true
    },
    handleClose (done) {
      done()
      setTimeout(this.RiskAddForm_rest(), 3000)
    },
    rest () {
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
    RiskAddForm_rest () {
      for (let key in this.RiskAddForm) {
        if (key === 'deptName' || key === 'reportTime') {
          this.RiskAddForm[key] = null
        } else {
          this.RiskAddForm[key] = ''
        }
      }
      this.$refs['RiskAddForm'].resetFields();
    },
    cancle () {
      this.dialogVisible = false
      setTimeout(this.RiskAddForm_rest(), 3000)
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
  created () {
    this.search()
    this.gain_orginlist()
    // this.FilterList[3]['options'] = this.handleStatusList
  },
  mounted () {
    for(let key in this.FilterList) {
      if (this.FilterList[key]['name'] === 'flawSource') {
        this.FilterList[key]['options'] = this.display.flawSouceList
      }
    }
  }
}
</script>

<style scoped>
.el-form-item{
  width: 90% !important;
}
.el-select{
  width: 100% !important;
}
.el-input{
  width: 100% !important;
}
.flex-wrap-wrap {
  flex-wrap: wrap;
}
.vulreport >>> .el-dialog {
  min-width: 700px;
}
.vulreport >>> .el-date-editor{
  width: 100% !important;
}
</style>