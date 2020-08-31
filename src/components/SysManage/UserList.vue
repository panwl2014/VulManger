<template>
  <div>
    <con-title :name="titlename"></con-title>
    <el-card class="mt-1 mr-1">
      <filter-data :FilterList="FilterList" :FilterForm="FilterForm" :loading="loading">
      </filter-data>
      <vul-button type="primary" size="small" @click="search">查询</vul-button>
      <vul-button type="primary" size="small" @click="useradd">添加用户</vul-button>
      <asset-table
      pagination
      :loading="loading"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :HandleConfig="HandleConfig"
      :pageTotal="pageTotal"
      @page-currentsize-change="page_currentsize_change"
      @page-current-change="page_current_change"
      @MonitorEvent="monitor_event"
      ></asset-table>
    </el-card>
    <el-dialog
      title="用户信息"
      :visible.sync="dialogVisibleUser"
      :before-close="handleClose"
      class="dialogClass"
      >
      <span>
        <el-form label-width="80px" :model="UserInfoForm" ref="UserInfoForm">
          <el-row type="flex" style="flex-wrap:wrap">
            <el-col :span="12">
              <el-form-item prop="deptid" label="父级部门" :rules="[{required: true, message: '请输入邮箱地址', trigger: 'blur'}]">
                <span v-if="!loading">
                  <tree-select :options="FilterList[0]['options']" v-model="UserInfoForm.deptid" :defaultExpandLevel="Infinity" placeholder="请选择部门"></tree-select>
                </span>
                <span v-else>
                  <el-input placeholder="加载中......" disabled></el-input>
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="name" label="用户名称" :rules="[{required: true, message: '请输入用户名称', trigger: 'blur'}]">
                <el-input v-model="UserInfoForm.name" maxlength="20" placeholder="请输入用户名称" @change="UserNameToStr(UserInfoForm.name)"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="loginname" label="登录名称" :rules="[{required: true, message: '请输入登录名称', trigger: 'blur'}]">
                <el-input v-model="UserInfoForm.loginname" placeholder="请输入登录名称" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户地址">
                <el-input v-model="UserInfoForm.address" placeholder="请输入用户地址" maxlength="30"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="用户备注">
                <el-input type="textarea" :rows="3" v-model="UserInfoForm.remark" placeholder="请输入用户备注" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户性别">
                <el-select v-model="UserInfoForm.sex" placeholder="请选择性别" popper-append-to-body>
                  <el-option label="男" :value="1"></el-option>
                  <el-option label="女" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="排序码"
                prop="ordernum"
                :rules="[
                  {required: true, message: '排序码不能为空', trigger: 'blur'},
                  {type: 'number', message: '只能填写数字', trigger: 'blur'}
                  ]">
                <el-input
                  v-model.number="UserInfoForm.ordernum"
                  maxlength="3"
                  placeholder="请输入排序码"
                  disabled
                  >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit_adduser">确 定</el-button>
        <el-button @click="cancle_adduser">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="角色分配"
      :visible.sync="dialogVisible"
      width="30%"
      >
      <span>
        <el-form label-width="80px">
          <el-form-item label="角色名称">
            <el-select v-model="CurrentRoleForm.ids" placeholder="请选择角色名称">
              <el-option
                v-for="d in RoleAssignmentList"
                :key="d.id"
                :label="d.name"
                :value="d.id">
                <span style="float: left">{{ d.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 11px;display: inline-block;padding-left: 30px;">{{ d.remark }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit_role">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import ConTitle from '@/components/components/ConTitle'
import FilterData from '@/components/components/FilterData'
import AssetTable from '@/components/components/AssetTable'
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'UserList',
  components: {
    ConTitle,
    FilterData,
    AssetTable,
    TreeSelect
  },
  data () {
    return {
      titlename: '用户管理',
      pageTotal: 0,
      FilterList: [
        {name: 'deptid', label: '所属部门', type: 'treeselect', options: [], placeholder: '请选择部门'},
        {name: 'name', label: '用户名称', type: 'input', placeholder: '请输入用户名称'},
        {name: 'address', label: '用户地址', type: 'input', placeholder: '请输入用户地址'}
      ],
      FilterForm: {
        deptid: null,
        search_deptTree_select_input: '',
        name: '',
        address: '',
        page: 1,
        limit: 10
      },
      tableTitle: [
        {key: 'id', label: '用户ID', is_show: true, text_algin: 'center'},
        {key: 'name', label: '用户名称', is_show: true, text_algin: 'center'},
        {key: 'loginname', label: '登录名称', is_show: true, text_algin: 'center'},
        {key: 'sexname', label: '性别', is_show: true, text_algin: 'center'},
        {key: 'deptname', label: '部门名称', is_show: true, text_algin: 'center'},
        {key: 'address', label: '用户地址', is_show: true, text_algin: 'center'},
        {key: 'remark', label: '用户备注', is_show: true, text_algin: 'center'},
        {key: 'create_time', label: '创建时间', is_show: true, text_algin: 'center'}
      ],
      EventName: '',
      EventArgs: '',
      loading: true,
      tableData: [],
      HandleConfig: {
        text_algin: 'center',
        width: '230',
        buttonList: [
          {title: '编辑', icon_name: '#iconbianji', size: 'mini', event_name: 'asset_edit', event_args: ''},
          // {title: '重置密码', icon_name: '#iconzhongzhimima1', size: 'mini', event_name: 'reset_pwd', event_args: ''},
          {title: '权限分配', icon_name: '#iconxiangqing', size: 'mini', event_name: 'role_assignment', event_args: ''},
          {title: '删除', icon_name: '#iconshanchu', size: 'mini', event_name: 'asset_delete', event_args: ''}
        ]
      },
      RoleAssignmentList: [],
      CurrentRoleForm: {
        ids: null,
        uid: null
      },
      dialogVisible: false,
      dialogVisibleUser: false,
      UserInfoForm: {
        deptid: null,
        id: '',
        ordernum: '',
        name: '',
        loginname: '',
        address: '',
        remark: '',
        sex: '',
        available: '1'
      }
    }
  },
  methods: {
    search () {
      this.loading = true
      let data = this.qs.stringify(this.FilterForm)
      let url = '/user/loadAllUser?' + data
      this.axios.get(url).then((Response) => {
        this.pageTotal = Response.data.count
        const d = Response.data.data
        let formatDate = Vue.filter('formatDate')
        let SexFilter = Vue.filter('SexFilter')
        d.map(function (dd, ii, aa) {
          d[ii].sexname = SexFilter(d[ii].sex)
          d[ii].create_time = formatDate(d[ii].hiredate)
        })
        this.tableData = d.reverse()
        this.loading = false
        this.gain_orginlist()
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
        this.FilterList[0]['options'] = [d[0]]
      })
    },
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      this.EventArgs = EventArgs
    },
    // 用户添加
    useradd () {
      // 获取排序码
      const url = '/user/loadUserMaxOrderNum'
      this.axios.get(url).then((Response) => {
        this.UserInfoForm.ordernum = Number(Response.data.value)
      })
      this.dialogVisibleUser = true
    },
    UserNameToStr (s) {
      const url = '/user/changeChineseToPinyin?username=' + s
      this.axios.get(url).then((Response) => {
        this.UserInfoForm.loginname = Response.data.value
      })
    },
    asset_edit (row) {
      console.log(row)
      const url = '/user/loadUserById?id=' + row[0].id
      this.axios.get(url).then((Response) => {
        const d = Response.data
        for (const key in d.data) {
          if (d.data[key] === null) {
            delete d.data[key]
          }
        }
        this.UserInfoForm = d.data
      })
      this.dialogVisibleUser = true
    },
    cancle_adduser () {
      this.dialogVisibleUser = false
      this.UserInfoForm = {
        deptid: null,
        id: '',
        ordernum: '',
        name: '',
        loginname: '',
        address: '',
        remark: '',
        sex: '',
        available: '1'
      }
      this.resetForm('UserInfoForm')
    },
    submit_adduser () {
      this.$refs['UserInfoForm'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          let url = '/user/addUser'
          if (this.UserInfoForm.id !== '') {
            url = '/user/updateUser'
            delete this.UserInfoForm.hiredate
          }
          let data = this.qs.stringify(this.UserInfoForm)
          this.axios.post(url, data).then((Response) => {
            const d = Response.data
            if (d.code === 200) {
              this.message_box(d.msg)
              this.search()
              this.cancle_adduser()
            } else {
              this.$message.error(d.msg)
            }
          })
          this.dialogVisibleUser = false
        }
      })
    },
    asset_delete (row) {
      const url = '/user/deleteUser'
      const userinfo = row[0]
      this.$confirm('是否删除【' + userinfo.name + '】这条用户信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.post(url, 'id=' + userinfo.id).then((Response) => {
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
    role_assignment (row) {
      const url = '/user/initRoleByUserId?page=1&limit=10000&id=' + row[0].id
      // const url ='/role/loadAllRole?page=1&limit=10000'
      this.axios.get(url).then((Response) => {
        const d = Response.data
        let CurrentRole = null
        d.data.map(function (dd, ii, aa) {
          if (dd.LAY_CHECKED) {
            CurrentRole = dd.id
          }
        })
        this.CurrentRoleForm.ids = CurrentRole
        this.CurrentRoleForm.uid = row[0].id
        this.RoleAssignmentList = d.data
      })
      this.dialogVisible = true
    },
    submit_role () {
      const url = '/user/saveUserRole'
      this.$confirm('确认给该用户分配该角色权限？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = this.qs.stringify(this.CurrentRoleForm)
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
      this.dialogVisible = false
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    message_box (msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    handleClose (done) {
      done()
      this.cancle_adduser()
      this.resetForm('UserInfoForm')
      // this.$confirm('确认关闭？')
      //   .then(_ => {
      //     done()
      //     this.cancle_adduser()
      //   })
      //   .catch(_ => {})
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
.dialogClass >>> .el-dialog{
  width: 600px !important;
}
</style>
