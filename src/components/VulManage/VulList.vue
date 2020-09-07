<template>
  <div class="vullist">
    <!-- 标题头 -->
    <con-title :name='titlename'></con-title>
    <!-- 数据分类展示 -->
    <el-row class='mt-1'>
      <el-col
        v-for='data in datalist'
        :key='data.key'
        :span='data.span'
        :style="'width: ' + data.width">
        <el-card class="mr-1 CountBox" :class="data.className">
            <div class="icon-box" :style="'background-color:' + data.bg">
              <svg class="icon-menu" aria-hidden="true">
                <use :xlink:href="data.menu_icon"></use>
              </svg>
            </div>
            <div class='CountName' v-text="data.name"></div>
            <div class='CountNumber' v-text="data.value" @click="jump('handleawaitlist', data.index)"></div>
            <div class="CountProcess" v-if="data.key !== 'flawCount'">
              <div class="Process" :style="'width:' + data.percentage + '%;background-color:' + data.color"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 数据过滤以及表格数据展示 -->
    <el-card class="mt-1 mr-1">
      <el-form label-width="80px">
        <el-row>
          <el-col
          v-for="i in FilterList"
          :key="i.name"
          :span="8">
            <el-form-item :label="i.label">
              <template v-if="i.type === 'input'">
                <el-input v-model.trim="FilterForm[i.name]" :placeholder="i.placeholder"></el-input>
              </template>
              <template v-else-if="i.type === 'select'">
                <el-select v-model="FilterForm[i.name]" :placeholder="i.placeholder" :multiple="i.multiple || false" :collapse-tags="i.multiple || false">
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
                  is-range
                  unlink-panels
                  :clearable="false"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  :picker-options="pickerOptions">
                </el-date-picker>
              </template>
              <template v-else-if="i.type === 'treeselect'">
                <tree-select :options="i.options" v-model="FilterForm[i.name]" :clearable="false"  appendToBody :normalizer="normalizer" :defaultExpandLevel="Infinity" :placeholder="i.placeholder"></tree-select>
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
        <vul-button size="small" @click="batch_delete" plain>批量删除</vul-button>
        <vul-button size="small" @click="exportFile" plain>批量导出</vul-button>
        <vul-button size="small" @click="exportFile(True)" plain>全部导出</vul-button>
      </div>
      <br>
      <asset-table
        selection
        pagination
        :loading="loading"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :HandleConfig="HandleConfig"
        :pageTotal="pageTotal"
        :StepList="StepList"
        @MonitorEvent="monitor_event"
        @select-change-data="select_change_data"
        @page-currentsize-change="page_currentsize_change"
        @page-current-change="page_current_change"
      ></asset-table>
    </el-card>
    <el-dialog
    title="漏洞信息"
    class="bigDia"
    :visible.sync="dialogVisible"
    width="40%"
    :before-close="handleClose">
    <span>
      <el-row :gutter="20">
        <el-form label-width="80px" :model="RiskForm" ref="RiskForm">
          <el-col :span="12">
            <el-form-item
            prop="flawName"
            :rules="[
              {required: true, message: '请输入漏洞名称', trigger: 'blur'}
            ]"
            label="漏洞名称">
              <el-input
                :disabled="editModel"
                v-model="RiskForm.flawName"
                maxlength="50"
                placeholder="请填写漏洞名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
            prop="flawIp"
            :rules="[{required: true, message: '请输入关联的资产', trigger: 'blur'}]"
            label="关联资产">
              <el-input v-model="RiskForm.flawIp" :disabled="editModel" placeholder="请填写漏洞关联资产"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
            prop="flawType"
            :rules="[{required: true, message: '请选择漏洞类型', trigger: 'blur'}]"
            label="漏洞类型"
            :disabled="editModel">
              <el-select v-model="RiskForm.flawType" placeholder="请选择漏洞类型">
                <el-option label="主机漏洞" :value="0"></el-option>
                <el-option label="应用漏洞" :value="1"></el-option>
                <el-option label="基线漏洞" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
            prop="flawGrade"
            :rules="[{required: true, message: '请选择漏洞等级', trigger: 'blur'}]"
            label="漏洞等级">
              <el-select v-model="RiskForm.flawGrade" placeholder="请选择漏洞等级">
                <el-option label="低危" :value="0"></el-option>
                <el-option label="中危" :value="1"></el-option>
                <el-option label="高危" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="漏洞分类"
            v-if="RiskForm.flawType === 1
            || RiskForm.flawType === ''">
              <el-input v-model="RiskForm.flawClassification" placeholder="请填写漏洞分类" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CVSS分值"
            v-if="RiskForm.flawType === 0
            || RiskForm.flawType === 2
            || RiskForm.flawType === ''">
            <el-input v-model="RiskForm.flawCvss" :disabled="editModel" placeholder="请填写漏洞CVSS分值" maxlength="10"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="漏洞标识">
              <el-input v-model="RiskForm.flawIdentifying" :disabled="editModel" placeholder="请填写CVE或CNVD漏洞标识" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="相关端口"
            v-if="RiskForm.flawType === 0
            || RiskForm.flawType === 2
            || RiskForm.flawType === ''">
              <el-input v-model="RiskForm.flawUrl" :disabled="editModel" placeholder="请填写相关端口" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="漏洞细节">
              <el-input v-model="RiskForm.flawDetails" type="textarea" :disabled="editModel" placeholder="请填写漏洞细节" maxlength="250"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
            label="漏洞描述">
              <el-input :disabled="editModel" type="textarea" v-model="RiskForm.flawDescription" placeholder="请填写漏洞描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
            label="修复建议">
              <el-input :disabled="editModel" type="textarea" v-model="RiskForm.flawSolution" placeholder="请填写修复建议"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </span>
      <span slot="footer">
        <el-button type="primary" @click="submit_edit">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import ConTitle from '@/components/components/ConTitle'
import AssetTable from '@/components/components/AssetTable'
import TreeSelect from '@riophae/vue-treeselect'
import FlowStep from '@/components/components/FlowStep'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'VulList',
  components: {
    ConTitle,
    AssetTable,
    TreeSelect,
    FlowStep
  },
  data () {
    return {
      titlename: '漏洞列表',
      loading: true,
      dialogVisible: false,
      editModel: true,
      SelectRowList: [],
      pageTotal: 100,
      EventName: '',
      EventArgs: '',
      // 条件过滤框的options
      handleStatusList: [
        {label: '待审核', text: '待审核', value: '1'},
        {label: '待下发', text: '待下发', value: '2'},
        {label: '待修复', text: '待修复', value: '3'},
        {label: '待复测', text: '待复测', value: '4'},
        {label: '已修复', text: '已修复', value: '6'},
        {label: '已忽略', text: '已忽略', value: '7'}],
      datalist: {
        flawCount: {key: 'flawCount', index: 'currentVul', name: '当前漏洞', menu_icon: '#icondangqianloudong', span: 6, width: '16%', value: null, className: 'count-box title-style', bg: 'rgba(53,95,198,0.1)'},
        pendingReview: {key: 'pendingReview', index: 'audittable', name: '待审核', menu_icon: '#icondaishenhe', span: 3, width: '14%', value: null, className: 'count-box', percentage: 0, color: '#F46722', bg: 'rgba(244,103,34,0.1)'},
        pendingRelease: {key: 'pendingRelease', index: 'downtable', name: '待下发', menu_icon: '#icondaixiafa', span: 3, width: '14%', value: null, className: 'count-box', percentage: 0, color: '#F4A822', bg: 'rgba(244,168,34,0.1)'},
        pendingRepaired: {key: 'pendingRepaired', index: 'repairtable', name: '待修复', menu_icon: '#icondaixiufu', span: 3, width: '14%', value: null, className: 'count-box', percentage: 0, color: '#BC0000', bg: 'rgba(188,0,0,0.1)'},
        pendingRetested: {key: 'pendingRetested', index: 'retesttable', name: '待复测', menu_icon: '#icondaiyanzheng', span: 3, width: '14%', value: null, className: 'count-box', percentage: 0, color: '#31C8F9', bg: 'rgba(49,200,249,0.1)'},
        alreadyFixed: {key: 'alreadyFixed', index: 'closetable', name: '已修复', menu_icon: '#iconyixiufu', span: 3, width: '14%', value: null, className: 'count-box', percentage: 0, color: '#12C123', bg: 'rgba(18,193,35,0.1)'},
        Ignored: {key: 'Ignored', index: 'closetable', name: '已忽略', menu_icon: '#iconyihulve', span: 3, width: '14%', value: null, className: 'count-box', percentage: 0, color: '#A28DFF', bg: 'rgba(162,141,255,0.1)'}
      },
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
        {name: 'handleStatus', label: '处理状态', type: 'select', options: []},
        {name: 'flawSource', label: '漏洞来源', type: 'select', multiple: true, options: []},
        {name: 'flawGrade', label: '漏洞等级', type: 'select', options: [{label: '低危', value: '0'}, {label: '中危', value: '1'}, {label: '高危', value: '2'}]},
        {name: 'deptId', label: '归属部门', type: 'treeselect', options: [], placeholder: '请选择部门'},
        {name: 'findTime', label: '处置时间', type: 'date'}
        // {name: 'flawType', label: '漏洞类型', type: 'select', options: [{label: '全部', value: ''}, {label: '主机漏洞', value: 'HOST'}, {label: '应用漏洞', value: 'APP'}]}
      ],
      // 表格数据
      tableTitle: [
        {key: 'id', label: '漏洞ID', is_show: true, text_algin: 'center', width: '150', component_config: {type: 'icon', rule: {key: 'flawGrade', content: {'0': '#icondiwei', '1': '#iconzhongwei', '2': '#icongaowei'}}}},
        {key: 'flawIp', label: '资产名称', is_show: true, width: '150', text_algin: 'center'},
        {key: 'flawName', label: '漏洞名称', is_show: true, text_algin: 'center'},
        {key: 'flawIdentifying', label: '漏洞标识', is_show: true, text_algin: 'center'},
        {key: 'find_Time', label: '发现时间', is_show: true, width: '200', text_algin: 'center'},
        {key: 'handle_Status', label: '处理状态', width: '120', filters: [], method: 'handle_status_filters', header_icon: '#iconzhuangtaishaixuan', is_function: true, event_name: 'gain_flaw', stepsList: [], flowPos: 0, event_args: '', loading: false, is_show: true, text_algin: 'center', component_config: {type: 'css', rule: {key: 'handleStatus', content: {'0': '#BC0000', 'other': '#0E76D7'}}}},
        {key: 'manage_Time', label: '处置时间', is_show: true, width: '200', text_algin: 'center'},
        {key: 'deptName', label: '归属部门', is_show: true, text_algin: 'center'},
        {key: 'flawSource', label: '漏洞来源', filter: 'RiskSrcFilter', is_show: true, text_algin: 'center'}
      ],
      tableData: [],
      HandleConfig: {
        width: '250',
        text_algin: 'center',
        fixed: 'right',
        buttonList: [
          {title: '详情', icon_name: '#iconxiangqing', size: 'mini', event_name: 'asset_details', event_args: ''},
          {title: '编辑', icon_name: '#iconbianji', size: 'mini', event_name: 'asset_edit', event_args: '', disabled_cond: {rule: {'4': true}, key: 'asset_status_id'}},
          // {title: '启动审批流程', icon_name: '123456', size: 'mini', event_name: 'startFlawProcess', event_args: ''},
          {title: '删除', icon_name: '#iconshanchu', size: 'mini', event_name: 'asset_delete', event_args: '', disabled_cond: {rule: {'4': true}, key: 'asset_status_id'}}
        ]
      },
      StepList: [],
      RiskForm: {
        id: '',
        flawIp: '',
        flawName: '',
        deptName: '',
        flawType: '',
        flawGrade: '',
        flawUrl: '',
        flawClassification: '',
        flawIdentifying: '',
        flawDetails: '',
        flawDescription: '',
        flawSolution: ''
      },
      currentRow: [],
      TestForm: {
        page: 1,
        limit: 10
      },
      UnpageSize: 0,
      filterList: [],
      filterNumber: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
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
      stepsList: []
    }
  },
  methods: {
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs
    },
    page_currentsize_change (val) {
      this.TestForm.limit = val
      this.search()
    },
    page_current_change (val) {
      this.TestForm.page = val
      this.search()
    },
    select_change_data (row) {
      let SelectRowList = []
      row.map(function (d, i, a) {
        SelectRowList.push(d.id)
      })
      this.SelectRowList = SelectRowList
    },
    jump (name, args) {
      if (args === 'currentVul') {
        this.search()
      } else {
        this.$router.push({name: name, params: {viewname: args}})
      }
      
    },
    riskCount () {
      const url = '/flaw/findFlawCount'
      this.axios.get(url).then((Response) => {
        const d = Response.data
        if (d.code === 0) {
          for (let key in this.datalist) {
            this.datalist[key]['value'] = d.data[key]
            if (key !== 'flawCount') {
              this.datalist[key]['percentage'] = (this.datalist[key]['value'] / d.data['flawCount']) * 100
            }
          }
        } else {
          this.$message.error('获取漏洞统计数据失败！')
        }
      })
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
    search () {
      this.loading = true
      for (let key in this.FilterForm) {
        if (key === 'findTime') {
          if (this.FilterForm[key][0] !== '') {
            this.TestForm.startTime = this.FilterForm[key][0] ? this.FilterForm[key][0] + ' 00:00:00' : ''
            this.TestForm.endTime = this.FilterForm[key][1] ? this.FilterForm[key][1] + ' 23:59:59' : ''
          } 
        } else if (key === 'flawSource') {
          if (this.FilterForm['flawSource'] && this.FilterForm['flawSource'].length > 0) {
            this.TestForm.flawSources = this.FilterForm['flawSource'].join(',')
          } else {
            delete this.TestForm.flawSources
            this.TestForm.flawSource = ''
          }
        } else {
          this.TestForm[key] = this.FilterForm[key]
        }
      }
      let HandleStatusFilter = Vue.filter('HandleStatusFilter')
      const url = '/flaw/loadAllFlaw'
      this.axios.post(url, this.qs.stringify(this.TestForm)).then((Response) => {
        const d = Response.data
        this.pageTotal = d.count
        if (d.code === 0) {
          d.data.map(function (dd, i, a) {
            // 发现时间
            d.data[i].find_Time = d.data[i].findTime
            // 处理状态
            d.data[i].handle_Status = HandleStatusFilter(d.data[i].handleStatus)
            // 处理时间
            d.data[i].manage_Time = d.data[i].manageTime !== null ? d.data[i].manageTime : ''
          })
          this.tableData = d.data
        } else {
          this.$message.error(d.msg)
        }
        this.loading = false
        this.gain_orginlist()
      })
    },
    gain_flaw (row) {
      this.tableTitle[5]['stepsList'] = []
      this.tableTitle[5]['loading'] = true
      const url = '/flaw/activitiList?id=' + row[0].id
      this.axios.get(url).then((Response) => {
        let d = Response.data
        // 总流程图
        let taskAll = [...d.data.allTask]
        let taskKey = []
        let taskHistory = d.data.hisTask
        let formatDate = Vue.filter('formatDate')
        // 将开始放在第一位
        for (let key in d.data.allTask) {
          taskKey.push(taskAll[key].id)
          if (taskAll[key].id === 'startTask') {
            let temp = {...taskAll[key]}
            taskAll.splice(key, 1)
            taskAll.unshift(temp)
          }
        }

        taskKey.splice(taskKey.indexOf('startTask'), 1)
        taskKey.unshift('startTask')

        for (let i in taskHistory) {
          for (let j in taskAll) {
            if (taskHistory[i].activityId === taskAll[j].id) {
              taskAll[j].persion = taskHistory[i].assignee
              taskAll[j].time = formatDate(taskHistory[i].time)
            }
          }
          // 按照最后一个流程，之前的数据都清空
          if (Number(i) === taskHistory.length - 1) {
            // let stopId = taskHistory[i].activityId
            let stopPos = taskKey.indexOf(taskHistory[i].activityId)
            // this.flowPos = stopPos
            if (taskHistory[i].activityId === 'endTask') {
              stopPos += 1
            }
            this.tableTitle[5]['flowPos'] = stopPos
            for (let k in taskAll) {
              if (k > stopPos) {
                taskAll[k].persion = ''
                taskAll[k].time = ''
              }
            }
          }
        }
        this.tableTitle[5]['loading'] = false
        this.tableTitle[5]['stepsList'] = [...taskAll]
      })
    },
    asset_details (row) {
      this.currentRow = [...row]
      this.$router.push({name: 'riskdetails', params: row[0]})
    },
    asset_edit (row) {
      for (let key in row[0]) {
        if (typeof(this.RiskForm[key]) !== 'undefined') {
          this.RiskForm[key] = row[0][key]
        }
      }
      this.dialogVisible = true
    },
    submit_edit () {
      const url = '/flaw/updateFlaw'
      this.axios.post(url, this.qs.stringify(this.RiskForm)).then((Response) => {
        const d = Response.data
        if (d.code === 200) {
          this.message_box(d.msg)
          this.search()
        } else {
          this.$message.error(d.msg)
        }
      })
      this.dialogVisible = false
    },
    handleClose (done) {
      done()
    },
    // 漏洞删除
    asset_delete (row) {

        this.loading = true
        const url = '/flaw/deleteFlaw'
        this.pageTotal -= 1
        this.axios.post(url, 'id=' + row[0].id).then((Response) => {
          const d = Response.data
          if (d.code === 200) {
            this.message_box(d.msg)
            this.riskCount()
            this.page_current_change(this.TestForm.page)
          } else {
            this.$message.error(d.msg)
            this.search()
          }
        })        
    },
    batch_delete () {
      const url = '/flaw/batchDeleteFlaw'
      if (this.SelectRowList.length === 0) {
        this.$message.error('请先勾选要删除的漏洞条目！')
        return
      }
      this.$confirm('是否批量删除所选中的漏洞信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        this.pageTotal -= this.SelectRowList.length
        let data = {'ids': this.SelectRowList}
        this.axios.post(url, this.qs.stringify(data, { arrayFormat: 'repeat' })).then((Response) => {
          const d = Response.data
          if (d.code === 200) {
            this.message_box(d.msg)
            this.riskCount()
            this.page_current_change(this.TestForm.page)
          } else {
            this.$message.error(d.msg)
          }
        })
      })
    },
    exportFile (IsAll = false) {
      if (this.SelectRowList.length === 0 && IsAll) {
        this.$message.error('请先选择要导出的漏洞信息！')
        return
      }
      this.$prompt('请输入导出文件名', '文件导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S{1,10}$/,
        inputErrorMessage: '输入文件名开头和结尾存在空格或输入超过10个字符'
      }).then(({ value }) => {
        const url = '/flaw/exportFlaw'
        let data = this.qs.stringify({'ids': this.SelectRowList, 'exportName': value})
        if (IsAll) {
          data = this.qs.stringify({'exportName': value})
        }
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
    HandleProcessEvent (args) {
      console.log(args)
    },
    message_box (msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    normalizer (node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: Number(node.id),
        label: node.label,
        children: node.children
      }
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
        this.FilterList[6]['options'] = [d[0]]
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
    for(let key in this.FilterList) {
      if (this.FilterList[key]['name'] === 'flawSource') {
        this.FilterList[key]['options'] = this.display.flawSouceList
      }
    }
  },
  beforeMount () {
    this.riskCount()
    this.search()
  },
  mounted() {
    this.FilterList[3]['options'] = this.handleStatusList
    this.tableTitle[5]['filters'] = this.handleStatusList
  }
}
</script>

<style scoped>
.icon {
  width: 16px;
  height: 16px;
  vertical-align: -9px;
  fill: currentColor;
  padding: 0px;
}
.icon-menu {
  width: 29px;
  height: 29px;
  fill: currentColor;
  overflow: hidden;
  margin: 5px 0px 0px 15px;
}
.CountBox{
  position: relative;
  padding-bottom: 30px;
}
.icon-box{
  position: absolute;
  top: 0px;
  right: 0px;
  width: 50px;
  height: 50px;
  border-radius: 0 0 0 100%;
}
.CountProcess {
  position: absolute;
  top: 85px;
  width: 6vw;
  height: 5px;
  border-radius: 4px;
  background-color: #E4E4E4;
}
.Process {
  width: 100%;
  height: 100%;
  border-radius: 4px;
}

.el-form-item{
  width: 80% !important;
}
.el-select{
  width: 100% !important;
}
.el-input{
  width: 100% !important;
}
.el-date-editor{
  width: 100% !important;
}
.el-col .el-button{
  float: right;
  margin: 5px;
}
.CountName {
  font-size: 14px;
  color: #4D4D4D;
}
.CountNumber {
  color: #0E76D7;
  font-size: 28px;
}
.CountNumber:hover{
  cursor: pointer;
}
.count-box >>> .el-card__body{
  padding-top: 20px;
  margin-left: 20px;
  height: 80px;
}
.title-style >>> .CountName{
  font-size: 18px;
}
.title-style >>> .CountNumber{
  font-size: 32px;
}
.vullist >>> .bigDia .el-dialog .el-form-item{
  width: 100% !important;
}
</style>
