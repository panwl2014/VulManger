<template>
  <div v-loading="loading">
    <con-title
      CardTitleMenu
      @CurrentPageChange="CurrentPageChange"
      :name='titlename'
      :CurrentId="CurrentId"
      :MenuTitleName="MenuTitleName">
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
        <vul-button size="small" @click="batchTaskPass" plain>{{ batchName1 }}</vul-button>
        <vul-button size="small" @click="batchTaskBack" plain>{{ batchName2 }}</vul-button>
      </div>
      <asset-table
      selection
      pagination
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
    <el-dialog
      :title="taskForm.title"
      :visible.sync="dialogVisible"
      :before-close="taskBeforeClose"
      width="25%">
      <div style="margin-bottom: 20px;" v-if="viewname === 2 && isShow">
        <el-form label-width="80px" label-position="left">
          <el-form-item label="部门">
            <tree-select @select="gain_username" :options="orglist" v-model="taskForm.deptId" :defaultExpandLevel="Infinity" placeholder="请选择部门"></tree-select>
          </el-form-item>
          <el-form-item label="责任人">
            <el-select v-model="taskForm.nextAge">
              <el-option
                v-for="d in persionList"
                :key="d.loginname"
                :label="d.name"
                :value="d.loginname"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div style="margin-bottom: 20px;" v-if="IsRadio">
        <el-radio-group v-model="inputRadio">
          <el-radio
            v-for="s in radioList"
            :key="s.name"
            :label="s.value">
              {{ s.label }}
          </el-radio>
        </el-radio-group>
      </div>
      <span>
        <el-form :model="taskForm" ref="taskForm" label-width="80px">
          <el-form-item
            prop="remark"
            :rules="[{required: true, message: taskForm.title + '原因不能为空', trigger: 'blur'}]"
            :label="taskForm.title">
            <!-- + 原因 -->
            <el-input type="textarea" v-model="taskForm.remark" :rows="2" maxlength="150" :placeholder="'请填写' + taskForm.title + '原因'"></el-input>
          </el-form-item>
        </el-form>
        
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="task_submit" v-if="!isBatch">确 定</el-button>
        <el-button type="primary" @click="batchTaskSubmit" v-else>确 定</el-button>
        <el-button @click="taskcancle">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="编辑"
      class="bigDia"
      :before-close="beforeClose"
      :visible.sync="drawer">
      <el-row :gutter="20">
        <el-form label-width="80px" :model="dataForm" ref="dataForm">
          <el-col :span="12">
            <el-form-item
            prop="flawName"
            :rules="[
              {required: true, message: '请输入漏洞名称', trigger: 'blur'}
            ]"
            label="漏洞名称">
              <el-input
                :disabled="editModel"
                v-model="dataForm.flawName"
                maxlength="50"
                placeholder="请填写漏洞名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
            prop="flawIp"
            :rules="[{required: true, message: '请输入关联的资产', trigger: 'blur'}]"
            label="关联资产">
              <el-input v-model="dataForm.flawIp" :disabled="editModel" placeholder="请填写漏洞关联资产"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
            prop="flawType"
            :rules="[{required: true, message: '请选择漏洞类型', trigger: 'blur'}]"
            label="漏洞类型"
            :disabled="editModel">
              <el-select v-model="dataForm.flawType" placeholder="请选择漏洞类型">
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
              <el-select v-model="dataForm.flawGrade" placeholder="请选择漏洞等级">
                <el-option label="低危" :value="0"></el-option>
                <el-option label="中危" :value="1"></el-option>
                <el-option label="高危" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="漏洞分类"
            v-if="dataForm.flawType === 1
            || dataForm.flawType === ''">
              <el-input v-model="dataForm.flawClassification" placeholder="请填写漏洞分类" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="CVSS分值"
            v-if="dataForm.flawType === 0
            || dataForm.flawType === 2
            || dataForm.flawType === ''">
            <el-input v-model="dataForm.flawCvss" :disabled="editModel" placeholder="请填写漏洞CVSS分值" maxlength="10"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="漏洞标识">
              <el-input v-model="dataForm.flawIdentifying" :disabled="editModel" placeholder="请填写CVE或CNVD漏洞标识" maxlength="20"></el-input>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item label="相关端口"
            v-if="dataForm.flawType === 0
            || dataForm.flawType === 2
            || dataForm.flawType === ''">
              <el-input v-model="dataForm.flawUrl" :disabled="editModel" placeholder="请填写相关端口" maxlength="10"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="漏洞细节">
              <el-input v-model="dataForm.flawDetails" type="textarea" :disabled="editModel" placeholder="请填写漏洞细节" maxlength="250"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
            label="漏洞描述">
              <el-input :disabled="editModel" type="textarea" v-model="dataForm.flawDescription" placeholder="请填写漏洞描述"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item
            label="修复建议">
              <el-input :disabled="editModel" type="textarea" v-model="dataForm.flawSolution" placeholder="请填写修复建议"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEdit">确 认</el-button>
        <el-button @click="cancleEdit">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'
import FilterData from '@/components/components/FilterData'
import AssetTable from '@/components/components/AssetTable'
import FormData from '@/components/components/FormData'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'HandleAwaitList',
  components: {
    ConTitle,
    FilterData,
    AssetTable,
    FormData,
    TreeSelect
  },
  data () {
    return {
      titlename: '待办任务',
      editModel: true,
      viewname: 1,
      MenuTitleName: [
        {index: 'audittable', name: '待审核', id: 1, badge: false, nums: 0},
        {index: 'downtable', name: '待下发', id: 2, badge: false, nums: 0},
        {index: 'repairtable', name: '待修复', id: 3, badge: false, nums: 0},
        {index: 'retesttable', name: '待复测', id: 4, badge: false, nums: 0},
        {index: 'closetable', name: '待关闭', id: 6, badge: false, nums: 0}
      ],
      FilterList: [
        {name: 'id', label: '漏洞ID', type: 'input', placeholder: '请输入漏洞ID'},
        {name: 'flawIp', label: '资产名称', type: 'input', placeholder: '请输入IP或域名'},
        {name: 'flawName', label: '漏洞名称', type: 'input', placeholder: '请输入漏洞名称'},
        {name: 'handleStatus', label: '处理状态', type: 'select', options: []},
        {name: 'flawSource', label: '漏洞来源', type: 'select', multiple: true, options: []},
        {name: 'flawGrade', label: '漏洞等级', type: 'select', options: [{label: '低危', value: '1'}, {label: '中危', value: '2'}, {label: '高危', value: '3'}]},
        {name: 'deptId', label: '归属部门', type: 'treeselect', options: [], placeholder: '请选择部门'}
        // {name: 'findTime', label: '处置时间', type: 'date'}
      ],
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
      taskButtonName0: '详情',
      taskButtonName1: '通过',
      taskButtonName2: '忽略',
      pageTotal: 0,
      EventName: '',
      EventArgs: '',
      tableTitle: [
        {key: 'id', label: '漏洞ID', is_show: true, width: '150', text_algin: 'center', component_config: {type: 'icon', rule: {key: 'flawGrade', content: {'0': '#icondiwei', '1': '#iconzhongwei', '2': '#icongaowei'}}}},
        {key: 'taskId', label: '任务ID', is_show: true, text_algin: 'center'},
        {key: 'flawIdentifying', label: '漏洞编号', is_show: true, text_algin: 'center'},
        {key: 'flawName', label: '漏洞名称', is_show: true, text_algin: 'center'},
        {key: 'flawType', label: '漏洞类型', is_show: true, filter: 'RiskTypeFilter', text_algin: 'center'},
        {key: 'findTime', label: '发现时间', is_show: true, text_algin: 'center'},
        {key: 'flawIp', label: '资产名称', is_show: true, text_algin: 'center'},
        {key: 'deptName', label: '所属部门', is_show: true, text_algin: 'center'},
        {key: 'taskCreateTime', label: '收到时间', is_show: true, text_algin: 'center'}
      ],
      // 所有表格数据
      allTableData: [],
      // 分页表格数据
      pageTableData: [],
      // 展示表格数据
      tableData: [],
      HandleConfig: {
        text_algin: 'center',
        fixed: 'right',
        width: '180',
        buttonList: [
          {title: '编辑', type: 'text', icon_name: '', size: 'mini', line: true, event_name: 'asset_edit', event_args: ''},
          {title: '通过', type: 'text', icon_name: '', size: 'mini', line: true, event_name: 'processPass', event_args: ''},
          {title: '忽略', type: 'text', icon_name: '', size: 'mini', event_name: 'asset_ignore', event_args: ''}
        ]
      },
      handleStatusList: [
        {label: '待审核', text: '待审核', value: '1'},
        {label: '待下发', text: '待下发', value: '2'},
        {label: '待修复', text: '待修复', value: '3'},
        {label: '待复测', text: '待复测', value: '4'},
        {label: '已修复', text: '已修复', value: '6'},
        {label: '已忽略', text: '已忽略', value: '7'}
      ],
      loading: false,
      // 漏洞编辑
      // dataKey: [
      //   {label: '漏洞类型', name: 'flawType', type: 'checkbox', options: [{label: '主机漏洞', value: 0}, {label: '应用漏洞', value: 1}, {label: '基线漏洞', value: 2}]},
      //   {label: '漏洞等级', name: 'flawGrade', type: 'select', placeholder: '请选择', options: [{label: '低危', value: 0}, {label: '中危', value: 1}, {label: '高危', value: 2}]},
      //   {label: '漏洞名称', name: 'flawName', type: 'input', placeholder: '请输入'},
      //   // {label: '漏洞详情', name: 'flawName', type: 'input', placeholder: '请输入'},
      //   {label: '漏洞描述', name: 'flawDescription', type: 'input', placeholder: '请输入'},
      //   {label: '解决方案', name: 'flawSolution', type: 'input', placeholder: '请输入'},
      //   {label: '漏洞cvss分值', name: 'flawCvss', type: 'input', placeholder: '请输入'},
      //   {label: '漏洞标识', name: 'flawIdentifying', type: 'input', placeholder: '请输入'},
      //   // {label: '漏洞分类', name: 'flawClassification', type: 'input', placeholder: '请输入'},
      //   {label: '相关端口', name: 'flawUrl', type: 'input', placeholder: '请输入'},
      //   {label: '关联资产', name: 'flawIp', type: 'input', placeholder: '请输入'}
      // ],
      dataForm: {
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
        flawSource: '' // 漏洞来源
      },
      SelectRowList: [],
      drawer: false,
      dialogVisible: false,
      radioList: [
        {name: 'finsh_fix', label: '完成修复', value: '完成修复'},
        {name: 'ignore', label: '忽略', value: '忽略'}
      ],
      inputRadio: '完成修复',
      taskForm: {
        title: '',
        remark: '',
        deptId: null,
        nextAge: 'system'
      },
      IsRadio: false,
      submitData: {},
      orglist: [],
      persionList: [],
      submitForm: {
        limit: 10,
        page: 1
      },
      outcome1: '通过',
      batchName1: '批量通过',
      outcome2: '忽略',
      batchName2: '批量忽略',
      isBatch: false,
      CurrentId: 'audittable',
      isShow: false
    }
  },
  methods: {
    CurrentPageChange (index) {
      this.viewname = index
      this.gain_orginlist()
      this.taskButtonName0 = '详情'
      if (index === 1) {
        this.taskButtonName0 = '编辑'
        this.taskButtonName1 = '通过'
        this.outcome1 = '通过'
        this.batchName1 = '批量通过'
        this.taskButtonName2 = '忽略'
        this.outcome2 = '忽略'
        this.batchName2 = '批量忽略'
      } else if (index === 2) {
        this.IsRadio = false
        this.taskButtonName1 = '下发'
        this.outcome1 = '下发'
        this.batchName1 = '批量下发'
        this.taskButtonName2 = '退回'
        this.outcome2 = '退回'
        this.batchName2 = '批量退回'
      } else if (index === 3) {
        this.taskButtonName1 = '修复'
        this.outcome1 = '完成'
        this.batchName1 = '批量完成修复'
        this.taskButtonName2 = '退回'
        this.outcome2 = '退回'
        this.batchName2 = '批量退回'
      } else if (index === 4) {
        this.taskButtonName1 = '通过'
        this.outcome1 = '通过'
        this.batchName1 = '批量完成复测'
        this.taskButtonName2 = '退回'
        this.outcome2 = '退回'
        this.batchName2 = '批量退回'
      } else if (index === 6) {
        this.taskButtonName1 = '关闭'
        this.outcome1 = '已关闭'
        this.batchName1 = '批量关闭'
        this.taskButtonName2 = '退回'
        this.outcome2 = '退回'
        this.batchName2 = '批量退回'
      }
      this.HandleConfig.buttonList[0].title = this.taskButtonName0
      this.HandleConfig.buttonList[1].title = this.taskButtonName1
      this.HandleConfig.buttonList[2].title = this.taskButtonName2
      this.renderTab()
    },
    select_change_data (row) {
      this.SelectRowList = [...row]
    },
    page_currentsize_change (val) {
      this.submitForm.limit = val
      this.renderTab()
      // this.search()
    },
    page_current_change (val) {
      this.submitForm.page = val
      this.renderTab()
      // this.search()
    },
    taskBeforeClose (done) {
      done()
      this.taskcancle()
    },
    beforeClose () {
      this.drawer = false
      for (let key in this.dataForm) {
        this.dataForm[key] = ''
      }
    },
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs
    },
    gain_username (val) {
      this.taskForm.deptId = val.id
      let url = '/user/loadAllUser?deptid=' + val.id + '&page=1&limit=10000'
      this.axios.get(url).then((Response) => {
        const d = Response.data
        this.taskForm.nextAge = d.data[0]['loginname']
        this.persionList = d.data
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
        this.orglist = [d[0]]
        this.FilterList[6]['options'] = [d[0]]
      })
    },
    asset_edit (row) {
      if (this.viewname === 1) {
        for (let key in this.dataForm) {
          this.dataForm[key] = row[0][key]
        }
        this.drawer = true
      } else {
        this.$router.push({name: 'riskdetails', params: row[0]})
      }
    },
    submitEdit () {
      const url = '/flaw/updateFlaw'
      this.axios.post(url, this.qs.stringify(this.dataForm)).then((Response) => {
        const d = Response.data
        if (d.code === 200) {
          this.message_box(d.msg)
          this.search()
        } else {
          this.$message.error(d.msg)
        }
        this.cancleEdit()
      })
    },
    // 资产编辑取消功能
    cancleEdit () {
      this.drawer = false
      for (let key in this.dataForm) {
        this.dataForm[key] = null
      }
    },
    asset_ignore (row) {
      this.taskForm.title = this.HandleConfig.buttonList[2].title
      this.IsRadio = false
      this.isShow = false
      this.dialogVisible = true
      this.taskForm.nextAge = 'system'
      const data = {
        taskId: row[0].taskId,
        comment: null,
        outcome: this.outcome2,
        flag: 1,
        nextAge: this.taskForm.nextAge,
        id: row[0].id
      }
      this.submitData = data
    },
    processPass (row) {
      this.isShow = true
      this.IsRadio = false
      this.isBatch = false
      console.log(this.viewname)
      if (this.viewname === 3) {
        this.IsRadio = true
      }
      if (this.viewname === 2) {
        this.taskForm.nextAge = null
      } else {
        this.taskForm.nextAge = 'system'
      }
      // this.taskForm.title = this.HandleConfig.buttonList[1].title
      this.taskForm.title = this.IsRadio ? this.taskButtonName1 : this.HandleConfig.buttonList[1].title
      // this.taskForm.title = this.inputRadio
      this.dialogVisible = true
      const data = {
        taskId: row[0].taskId,
        comment: null,
        outcome: this.outcome1,
        flag: 0,
        nextAge: this.taskForm.nextAge,
        id: row[0].id
      }

      this.submitData = data
    },
    task_submit () {
      if (this.taskForm.nextAge === null) {
        this.$message.error('负责人不能为空')
        return
      }
      this.$refs['taskForm'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          let remark = this.taskForm.remark
          if (this.IsRadio) {
            remark = this.inputRadio + this.taskForm.remark
          }
          this.submitData.comment = remark
          this.submitData.nextAge = this.taskForm.nextAge
          this.loading = true
          this.implementTask(this.qs.stringify(this.submitData))
          this.submitData = {}
          this.taskcancle()
        }
      })
      
    },
    // 批量下发编辑框显示
    batchTaskPass () {
      if (this.SelectRowList.length === 0) {
        this.$message.error('未选择相应的任务')
        return
      }
      this.isBatch = true
      this.IsRadio = false
      if (this.viewname === 3) {
        this.IsRadio = true
      }
      if (this.viewname === 2) {
        this.isShow = true
        this.taskForm.nextAge = null
      } else {
        this.taskForm.nextAge = 'system'
      }
      this.taskForm.title = this.IsRadio ? this.inputRadio : this.HandleConfig.buttonList[1].title
      // this.taskForm.title = this.inputRadio
      const data = {
        taskId: null,
        comment: null,
        outcome: this.outcome1,
        flag: 0,
        nextAge: this.taskForm.nextAge,
        id: null
      }
      this.submitData = data
      this.dialogVisible = true
    },
    // 批量退回编辑框显示
    batchTaskBack () {
      if (this.SelectRowList.length === 0) {
        this.$message.error('未选择相应的任务')
        return
      }
      this.taskForm.title = this.HandleConfig.buttonList[2].title
      this.isBatch = true
      this.IsRadio = false
      this.isShow = false
      this.dialogVisible = true
      if (this.viewname === 2 && this.isShow) {
        this.taskForm.nextAge = null
      } else {
        this.taskForm.nextAge = 'system'
      }
      const data = {
        taskId: null,
        comment: null,
        outcome: this.outcome2,
        flag: 1,
        nextAge: this.taskForm.nextAge,
        id: null
      }
      this.submitData = data
    },
    // 批量任务提交
    batchTaskSubmit () {
      if (this.taskForm.nextAge === null) {
        this.$message.error('负责人不能为空')
        return
      }
      this.$refs['taskForm'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          let remark = this.taskForm.remark
          if (this.IsRadio) {
            remark = this.inputRadio + ' ' + this.taskForm.remark
          }
          let url = '/task/completeTask'
          this.submitData.comment = remark
          // 任务指定者
          this.submitData.nextAge = this.taskForm.nextAge
          let success = 0
          let error = 0
          let row = [...this.SelectRowList]
          this.loading = true
          for (let i in row) {
            let temp = {...this.submitData}
            temp.id = row[i].id
            temp.taskId = row[i].taskId
            console.log(temp)
            this.axios.post(url, this.qs.stringify(temp)).then((Response) => {
              const d = Response.data
              if (d.code === 200) {
                success += 1
              } else {
                error += 1
              }
              if ((success + error) === row.length) {
                if (success > 0) {
                  this.message_box('成功:' + success + '条数据')
                }
                
                if (error > 0) {
                  this.$message.error('失败: ' + error + '条数据')
                }
                this.search()
              }
            })
          }
          this.isBatch = false
          this.submitData = {}
          this.taskcancle()
        }
      })
    },
    taskcancle () {
      this.dialogVisible = false
      for (let key in this.taskForm) {
        this.taskForm[key] = null
      }
      this.$refs['taskForm'].resetFields()
      this.inputRadio = '完成修复'
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
    filter () {
      let tableData = []
      this.tableData.map(function (d, i, a) {
        // 创建一个计数器，当error为0时则渲染该数据
        let error = 0
        for (let key in this.submitForm) {
          if (this.submitForm[key] === '' || this.submitForm[key] === null || key === 'limit' || key === 'page') continue
          if (typeof(this.submitForm[key]) === 'object') {
            for (let k in this.submitForm[key][k]) {
              if (d[key] != this.submitForm[key][k]) error += 1
            }
          } else {
            if (d[key] != this.submitForm[key]) error += 1
          }
        }
        if (error === 0) {
          tableData.push(d)
        }
      }, this)
      this.tableData = [...tableData]
      this.pageTotal = this.tableData.length
    },
    search () {
      this.loading = true
      for (let key in this.FilterForm) {
        if (key === 'findTime') {
          if (this.FilterForm[key][0] !== '') {
            this.submitForm.startTime = this.FilterForm[key][0] ? this.FilterForm[key][0] + ' 00:00:00' : ''
            this.submitForm.endTime = this.FilterForm[key][1] ? this.FilterForm[key][1] + ' 23:59:59' : ''
          } 
        } else if (key === 'flawSource') {
          if (this.FilterForm['flawSource'] && this.FilterForm['flawSource'].length > 0) {
            this.submitForm.flawSource = this.FilterForm['flawSource'].join(',')
          } else {
            // delete this.TestForm.flawSources
            this.submitForm.flawSource = ''
          }
        } else if (key === 'deptId') {
          console.log(this.FilterForm['deptId'])
          if (this.FilterForm['deptId'] === null || typeof(this.FilterForm['deptId']) === 'undefined') {
            this.submitForm['deptId'] = ""
          } else {
            this.submitForm['deptId'] = this.FilterForm['deptId']
          }
        } else {
          this.submitForm[key] = this.FilterForm[key]
        }
      }
      let url = '/task/loadCurrentUserFlawTask'
      this.axios.post(url, this.qs.stringify(this.submitForm)).then((Response) => {
        const d = Response.data
        // 待审核
        this.MenuTitleName[0].badge = d.data.pendingReview > 0 ? true : false
        this.MenuTitleName[0].nums = d.data.pendingReview
        // 待下发
        this.MenuTitleName[1].badge = d.data.pendingRelease > 0 ? true : false
        this.MenuTitleName[1].nums = d.data.pendingRelease
        // 待修复
        this.MenuTitleName[2].badge = d.data.pendingRepaired > 0 ? true : false
        this.MenuTitleName[2].nums = d.data.pendingRepaired
        // 待复测
        this.MenuTitleName[3].badge = d.data.pendingRetested > 0 ? true : false
        this.MenuTitleName[3].nums = d.data.pendingRetested
        // 待关闭
        this.MenuTitleName[4].badge = d.data.toBeClosed > 0 ? true : false
        this.MenuTitleName[4].nums = d.data.toBeClosed

        let tableData = []
        d.data.dataList.map(function (data, i, a) {
          if (data.TaskFlawVo.flaw !== null) {
            let temp = {}
            temp = {...data.TaskFlawVo.flaw}
            temp.taskId = data.TaskFlawVo.id
            temp.taskCreateTime = data.TaskFlawVo.createTime
            tableData.push(temp)
          }
        })
        this.loading = false
        this.allTableData = tableData
        this.taskForm.nextAge = null
        this.renderTab()
      })
    },
    // 分页
    pageHandle () {
      // this.tableData = this.pageTableData.slice((this.submitForm.page - 1) * this.submitForm.limit, this.submitForm.page * this.submitForm.limit)
      this.tableData = this.tableData.slice((this.submitForm.page - 1) * this.submitForm.limit, this.submitForm.page * this.submitForm.limit)
    },
    renderTab () {
      let tableData = []
      this.allTableData.map(function (d, i, a) {
        if (d.handleStatus === 7 && this.viewname === 6) {
          tableData.push(d)
        }
        if (d.handleStatus === this.viewname) {
          tableData.push(d)
        }
      }, this)
      this.pageTableData = tableData
      this.tableData = tableData
      // this.tableData = tableData.slice((this.submitForm.page - 1) * this.submitForm.limit, this.submitForm.page * this.submitForm.limit)
      this.filter()
      this.pageHandle()
      // this.pageTotal = this.pageTableData.length
    },
    implementTask (data) {
      let url = '/task/completeTask?' + data
      this.axios.post(url).then((Response) => {
        const d = Response.data
        console.log(d)
        if (d.code === 200) {
          this.message_box(d.msg)
          this.search()
          this.renderTab()
        }
      })
    },
    message_box (msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    }
  },
  created () {
    this.loading = true
    this.CurrentId = this.$route.params.viewname
    this.search()
    this.gain_orginlist()
    // 数据初始化
    this.FilterList[3]['options'] = this.handleStatusList
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
    },
    CurrentId (newValue, oldValue) {
      for (let key in this.MenuTitleName) {
        if (this.MenuTitleName[key]['index'] === newValue) {
          this.viewname = this.MenuTitleName[key].id
          this.CurrentPageChange(this.viewname)
        }
      }
    },
    inputRadio (newValue, oldValue) {
      if (this.IsRadio) {
        if (newValue === '完成修复') {
          this.taskForm.title = '修复'
        } else {
          this.taskForm.title = newValue
        } 
      }
    }
  }
}
</script>

<style scoped>
.el-col-8 .el-button{
  margin: 10px 0px 0px 10px;
  float: right;
}
.el-select{
  width: 100% !important;
}
.el-form-item{
  width: 80%;
}
.bigDia .el-form-item {
  width: 100%
}
</style>
