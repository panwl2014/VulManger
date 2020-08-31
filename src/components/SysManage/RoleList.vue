<template>
  <div>
    <con-title :name="titlename"></con-title>
    <el-card class="mt-1 mr-1">
      <filter-data :FilterList="FilterList" :FilterForm="FilterForm">
        <template v-slot:ButtonContent>
          <div class="el-col-8">
            <el-form-item>
              <vul-button size="small" type="primary" @click="search">查询</vul-button>
              <vul-button size="small" @click="add_role">添加角色</vul-button>
            </el-form-item>
          </div>
        </template>
      </filter-data>
      <el-table :data="tableData" v-loading="loading" :header-cell-style="tableHeaderColor">
        <el-table-column label="ID" prop="id" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="角色名称" prop="name" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column label="角色备注" prop="remark" align="center" show-overflow-tooltip ></el-table-column>
        <el-table-column label="创建时间" prop="createtime" align="center" show-overflow-tooltip >
          <template slot-scope="scope">
            {{scope.row.createtime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="250">
          <template slot-scope="scope">
            <el-button size="mini" @click="add_role(scope.row)">编辑</el-button>
            <el-button size="mini" @click="role_assignment(scope.row.id)">权限分配</el-button>
            <el-button size="mini" type="danger" @click="delete_role(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="page_currentsize_change"
        @current-change="page_current_change"
        :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotal">
      </el-pagination>
    </el-card>
    <el-dialog
      title="角色信息"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="30%">
      <span>
        <el-form label-width="80px" :model="RoleForm" ref="RoleForm">
          <el-form-item
            label="角色名称"
            prop="name"
            :rules="[
              {required: true, message: '请输入角色名称', trigger: 'blur'},
              {pattern: /^[a-zA-Z\u4e00-\u9fa5]+$/, message: '只能输入中文或英文字母', trigger: 'blur'}
              ]"
            >
            <el-input v-model="RoleForm.name" placeholder="请输入角色名称" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="角色备注">
            <el-input type="textarea" v-model="RoleForm.remark" placeholder="请输入角色备注" maxlength="50"></el-input>
          </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit_role">确 定</el-button>
        <el-button @click="cancle">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog title="权限分配" width="20%" :visible.sync="dialogVisibleRole" :before-close="RolehandleClose">
      <span>
        <tree :nodes="treeData" :setting="setting" ref='ztreeDom' />
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit_role_assignment">确 定</el-button>
        <el-button @click="cancle_role">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'
import FilterData from '@/components/components/FilterData'
import tree from 'vue-giant-tree'

export default {
  name: 'RoleList',
  components: {
    ConTitle,
    FilterData,
    tree
  },
  data () {
    return {
      titlename: '角色管理',
      pageTotal: 0,
      loading: true,
      FilterList: [
        {name: 'name', label: '角色名称', type: 'input', placeholder: '请输入角色名称'},
        {name: 'remark', label: '角色备注', type: 'input', placeholder: '请输入角色备注'}
      ],
      FilterForm: {
        name: '',
        remark: '',
        page: '1',
        limit: '10'
      },
      tableData: [],
      // 角色添加以及编辑
      dialogVisible: false,
      dialogVisibleRole: false,
      RoleForm: {
        id: '',
        name: '',
        remark: '',
        available: '1'
      },
      role_id: '',
      treeData: [],
      setting: {
        check: {
          enable: true
        },
        data: {
          simpleData: {
            enable: true,
            pIdKey: 'pid'
          }
        }
      }
    }
  },
  methods: {
    tableHeaderColor () {
      return 'background-color: #F5F5F5'
    },
    search () {
      this.loading = true
      const data = this.qs.stringify(this.FilterForm)
      let url = '/role/loadAllRole?' + data
      this.axios.get(url).then((Response) => {
        const d = Response.data
        this.pageTotal = d.count
        this.tableData = d.data
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
    getHalfCheckedNodes (row) {
      console.log(row)
    },
    delete_role (id) {
      this.$confirm('是否确定删除这条角色？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = '/role/deleteRole'
        this.axios.post(url, 'id=' + id).then((Response) => {
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
    add_role (row) {
      if (row !== '') {
        let info = {...row}
        delete info.createtime
        this.RoleForm = info
      }
      this.dialogVisible = true
    },
    RolehandleClose (done) {
      done()
      this.cancle_role()
    },
    role_assignment (id) {
      this.role_id = id.toString()
      let url = '/role/initPermissionByRoleId?roleId=' + id
      this.axios.get(url).then((Response) => {
        const data = Response.data.data
        // let rolelist = []
        this.treeData = []
        data.map(function (d, i, a) {
          let temp = {}
          if (d.id === 1) {
            temp.open = true
          }
          temp.id = d.id
          temp.pid = d.parentId
          temp.name = d.title
          if (d.checkArr === '1') {
            temp.checked = true
          } else {
            temp.checked = false
          }
          if (this.display.displayMenuId.indexOf(temp.pid) < 0 && this.display.displayMenu.indexOf(temp.name) < 0) {
            this.treeData.push(temp)
          } 
          
        }, this)
        this.dialogVisibleRole = true
        // this.treeData = rolelist
      })
    },
    cancle_role () {
      this.treeData = []
      this.role_id = ''
      this.dialogVisibleRole = false
    },
    submit_role_assignment () {
      let data = {rid: this.role_id, ids: []}
      let nodes = this.$refs.ztreeDom.ztreeObj.getCheckedNodes()
      nodes.map(function (d, i, a) {
        data.ids.push(d.id.toString())
      })
      data = this.qs.stringify(data, { arrayFormat: 'repeat' })
      // data = this.qs.stringify(data, {arrayFormat: 'brackets'})
      const url = '/role/saveRolePermission'
      this.axios.post(url, data).then((Response) => {
        const d = Response.data
        if (d.code === 200) {
          this.message_box(d.msg)
          this.search()
          this.dialogVisibleRole = false
        } else {
          this.$message.error(d.msg)
        }
      })
    },
    cancle () {
      this.RoleForm.name = ''
      this.RoleForm.remark = ''
      this.resetForm('RoleForm')
      this.dialogVisible = false
    },
    handleClose (done) {
      done()
      this.cancle()
    },
    submit_role () {
      this.$refs['RoleForm'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          let url = '/role/addRole'
          this.RoleForm.available = '1'
          let data = this.qs.stringify(this.RoleForm)
          if (this.RoleForm.id) {
            url = '/role/updateRole'
          }
          this.axios.post(url, data).then((Response) => {
            let d = Response.data
            if (d.code === 200) {
              this.message_box(d.msg)
              this.search()
            } else {
              this.$message.error(d.msg)
            }
          })
          this.dialogVisible = false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
  }
}
</script>

<style scoped>
.ant-tree{
  font-size: 16px !important;
}
.el-pagination{
  padding: 10px;
  float: right;
}
</style>
