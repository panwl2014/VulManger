<template>
  <div>
    <con-title :name="titlename"></con-title>
    <el-card class="mt-1 mr-1">
      <vul-button size="small" @click="edit_info(' ')" plain>添加组织</vul-button>

      <el-table
        border
        class="mt-1"
        v-loading="loading"
        :data="tableData"
        :header-cell-style="tableHeaderColor"
        row-key="id"
        :expand-row-keys="expandList"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="部门ID" prop="id" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门名称" prop="title" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门地址" prop="address" show-overflow-tooltip></el-table-column>
        <el-table-column label="部门备注" prop="remark" show-overflow-tooltip></el-table-column>
        <el-table-column label="排序码" prop="ordernum" show-overflow-tooltip></el-table-column>
        <el-table-column label="创建时间" prop="createtime" width="180" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.createtime | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <el-button size="mini" @click="edit_info(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="delete_org(scope.row.id)" v-if="typeof(scope.row['children']) === 'undefined' || scope.row['children'].length === 0">删除</el-button>
            <el-button type="danger" size="mini" v-else disabled>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="部门信息"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      width="30%">
      <el-form label-width="80px" ref="OrginInfoForm" :model="OrginInfoForm">
        <el-form-item label="父级部门" prop="pid" :rules="[{required: true, message: '部门名称不能为空'}]">
          <el-select v-model="OrginInfoForm.pid" placeholder="请选择" v-if="OrginInfoForm.id === 1" disabled>
            <el-option :label="tableData[0].title" :value="tableData[0].id" @click.native="gain_orgin_name(tableData[0])"></el-option>
            <el-option
            v-for="d in tableData[0].children"
            :key="d.id"
            :label="d.title"
            :value="d.id" @click.native="gain_orgin_name(d)"></el-option>
          </el-select>
          <el-select v-model="OrginInfoForm.pid" placeholder="请选择" v-else>
            <el-option :label="tableData[0].title" :value="tableData[0].id" @click.native="gain_orgin_name(tableData[0])"></el-option>
            <el-option
            v-for="d in tableData[0].children"
            :key="d.id"
            :label="d.title"
            :value="d.id" @click.native="gain_orgin_name(d)"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门名称" prop="title" :rules="[{required: true, message: '部门名称不能为空', trigger: 'blur'}]">
          <el-input v-model="OrginInfoForm.title" maxlength="20" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="部门地址">
          <el-input v-model="OrginInfoForm.address" maxlength="50" placeholder="请输入部门地址"></el-input>
        </el-form-item>
        <el-form-item label="部门备注">
          <el-input v-model="OrginInfoForm.remark" maxlength="50" placeholder="请输入部门备注"></el-input>
        </el-form-item>
        <el-form-item
          label="排序码"
          prop="ordernum"
          :rules="[
            {required: true, message: '排序码不能为空', trigger: 'change'},
            {type: 'number', message: '只能填写数字', trigger: 'blur'}
            ]">
          <el-input v-model.number="OrginInfoForm.ordernum" maxlength="3" placeholder="请输入排序码" disabled></el-input>
        </el-form-item>
        <el-form-item label="是否展开">
          <el-radio-group v-model="OrginInfoForm.open">
            <el-radio label="1">展开</el-radio>
            <el-radio label="0">不展开</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否可用">
          <el-radio-group v-model="OrginInfoForm.available">
            <el-radio label="1">可用</el-radio>
            <el-radio label="0">不可用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="add_org">确 定</el-button>
        <el-button @click="cancle">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'

export default {
  name: 'OrginList',
  components: {
    ConTitle
  },
  data () {
    return {
      titlename: '组织管理',
      loading: true,
      expandList: [],
      tableData: [],
      dialogVisible: false,
      OrginInfoForm: {
        pid: '',
        deptTree_select_input: '',
        id: '',
        title: '',
        address: '',
        remark: '',
        open: '1',
        available: '1',
        ordernum: ''
      }
    }
  },
  methods: {
    tableHeaderColor () {
      return 'background-color: #F5F5F5'
    },
    search () {
      this.loading = true
      this.axios.post('/dept/loadAllDept?page=1&limit=10000').then((responese) => {
        let menuList = []
        const expandList = []
        const children = []
        responese.data.data.map(function (d, index, arr) {
          const parentId = d.pid
          if (d.open === 1) {
            expandList.push(d.id.toString())
          }
          if (parentId === 0) {
            d.children = []
            menuList.push(d)
          } else if (parentId === 1) {
            d.children = []
            children.push(d)
          } else {
            children.map(function (dd, i, a) {
              if (parentId === dd.id) {
                children[i].children.push(d)
              }
            })
          }
        })
        menuList[0].children = children
        this.tableData = [menuList[0]]
        this.expandList = expandList
        this.loading = false
      }, this)
    },
    edit_info (row) {
      if (row !== ' ') {
        row.open = row.open.toString()
        row.available = row.available.toString()
        if (row.pid === 0) {
          row.pid = row.id
        }
        row.pid = Number(row.pid)
        this.OrginInfoForm = { ...row }
        delete this.OrginInfoForm.createtime
        delete this.OrginInfoForm.children
      } else {
        const url = '/dept/loadDeptMaxOrderNum'
        this.axios.get(url).then((responese) => {
          const d = responese.data.value
          this.OrginInfoForm.ordernum = Number(d)
        })
      }
      this.dialogVisible = true
    },
    gain_orgin_name (d) {
      this.OrginInfoForm.deptTree_select_input = d.title
    },
    add_org () {
      this.$refs['OrginInfoForm'].validate((valid) => {
        if (!valid) {
          return false
        } else {
          let url = '/dept/addDept'
          if (this.OrginInfoForm.id !== '') {
            url = '/dept/updateDept'
            if (this.OrginInfoForm.id === 1) {
              this.OrginInfoForm.pid = 0
            }
          }
          const data = this.qs.stringify(this.OrginInfoForm)
          this.axios.post(url, data).then((responese) => {
            const d = responese.data
            if (d.code === 200) {
              this.message_box(d.msg)
            } else {
              this.$message.error(d.msg)
            }
            this.search()
          })
          this.dialogVisible = false
          this.resetForm('OrginInfoForm')
        }
      })
    },
    delete_org (id) {
      this.$confirm('删除该部门后无法恢复, 是否继续删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = '/dept/deleteDept'
        const data = 'id=' + id
        this.axios.post(url, data).then((responese) => {
          const d = responese.data
          if (d.code === 200) {
            this.message_box(d.msg)
            this.search()
          } else {
            this.$message.error(d.msg)
          }
        })
      })
    },
    cancle () {
      this.dialogVisible = false
      this.resetForm('OrginInfoForm')
    },
    resetForm (formName) {
      this.$nextTick(() => {
        // for (let key in this.OrginInfoForm) {
        //   this.OrginInfoForm[key] = null
        // }
        this.OrginInfoForm = {}
        this.OrginInfoForm.open = '1'
        this.OrginInfoForm.available = '1'
        this.$refs[formName].resetFields()
      })
    },
    handleClose (done) {
      done()
      this.cancle()
    },
    message_box (msg, type = 'success') {
      this.$message({
        message: msg,
        type: 'success'
      })
    }
  },
  beforeMount () {
    this.search()
  }
}
</script>

<style scoped>
.el-input{
  width: 100% !important;
}
.el-select{
  width: 100% !important;
}
</style>
