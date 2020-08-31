<template>
  <div class="assetManage">
    <con-title :name="titlename"></con-title>
    <el-card class="mr-1 mt-1">
      <filter-data
        :FilterList="FilterList"
        :FilterForm="FilterForm">
      </filter-data>
      <div class="float-r pb-2">
        <vul-button type="primary" size="small" @click="search">查询</vul-button>
        <vul-button size="small" @click="restFilter">重置</vul-button>
      </div>
    </el-card>

    <el-card class="mr-1 mt-1">
      <div class="float-l pb-2">
        <vul-button size="small" @click="assetAdd" plain>资产添加</vul-button>
        <vul-button size="small" @click="batchDel" plain>批量删除</vul-button>
        <vul-button size="small" @click="exportData" plain>批量导出</vul-button>
      </div>
      <div class="float-r">
        <!-- 自定义字段 -->
        <el-tooltip class="item" effect="light" content="自定义字段添加" placement="top">
          <svg class="icon" aria-hidden="true" @click="show_dialog">
            <use xlink:href="#iconziduanshezhi"></use>
          </svg>
        </el-tooltip>
        <!-- 导入 -->
        <el-tooltip class="item" effect="light" content="资产导入" placement="top">
          <svg class="icon1" aria-hidden="true" @click="assetImport">
            <use xlink:href="#icondaoru"></use>
          </svg>
        </el-tooltip>
        <!-- 导出 -->
        <el-tooltip class="item" effect="light" content="全部导出" placement="top">
          <svg class="icon1" aria-hidden="true" @click="exportAll">
            <use xlink:href="#icondaochuhuise"></use>
          </svg>
        </el-tooltip>
        <!-- <vul-button size="small" @click="show_dialog" plain>自定义字段添加</vul-button>
        <vul-button size="small" @click="assetImport" plain>资产导入</vul-button>
        <vul-button size="small" @click="exportAll" plain>全部导出</vul-button> -->

      </div>
      
      <asset-table
        ref="table"
        :loading="loading"
        selection
        pagination
        :tableTitle="tableTitle"
        :tableData="tableData"
        :HandleConfig="HandleConfig"
        :pageTotal="pageTotal"
        @page-currentsize-change="page_currentsize_change"
        @page-current-change="page_current_change"
        @select-change-data="select_change_data"
        @MonitorEvent="monitor_event">
        <!-- <template v-slot:addcolumn>
          <el-button size="mini" @click="show_dialog"><i class="el-icon-plus"></i></el-button>
        </template> -->
      </asset-table>
    </el-card>
    <el-dialog
      title="资产导入"
      :visible.sync="importDialogVisible"
      class="assetImport"
      width="50%"
      :before-close="importHandleClose">
      <span>
        <el-form :inline="true">
          <el-form-item label="文件名">
            <el-input v-model="filename" placeholder="请选择要导入的文件" disabled=""></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-upload action="http://103.44.144.41:12120/upload/uploading" :show-file-list="false" :before-upload="beforeUpload" :data="uploadData" :on-success="uploadSuccess">
              <el-button type="primary" size="small">选择文件导入</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="">
            <vul-button size="small" @click="importSubmit(false)" plain>批量导入</vul-button>
          </el-form-item>
          <el-form-item label="">
            <vul-button size="small" @click="importSubmit(true)" plain>全部导入</vul-button>
          </el-form-item>
          <el-form-item label="">
            <a href="/static/asset_template.xlsx">
              <vul-button size="small" plain>下载模板</vul-button>
            </a>
          </el-form-item>
        </el-form>
        <el-table v-loading="importLoading" :data="importTable.slice((tableCurPage -1)*tableCurPageSize, tableCurPage*tableCurPageSize)" @selection-change="SelectChange">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column
            v-for="d in importTitle"
            :key="d.name"
            :label="d.label"
            :prop="d.name"
            :fixed="d.fixed"
          ></el-table-column>
        </el-table>
        <br/>
        <div style="text-align: center;">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="PageCurrentChange"
            :page-sizes="[10, 20, 50, 100, 200]"
            :page-size="10"
            layout="total, sizes, prev, pager, next, jumper"
            :total="importNums">
          </el-pagination>
        </div>
      </span>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="importDialogVisible = false" type="primary">确 定</el-button>
        <el-button @click="importDialogVisible = false">取 消</el-button>
      </span> -->
    </el-dialog>
    <el-dialog
      width="30%"
      :visible.sync="AssetDialog"
      :before-close="assetHandleClose"
      title="资产信息">
      <span>
        <form-data :dataKey="dataKey" ref="formdata" :dataForm="AssetForm" :rules="rules"></form-data>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitData">确 认</el-button>
        <el-button @click="AssetDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="字段编辑"
      class="addCloumn"
      :visible.sync="dialogVisible"
      width="50%"
      :before-close="handleClose">
      <span>
        <el-form label-width="80px">
          <el-form-item
            v-for="(column, index) in ColumnList"
            :key="column.columnName"
            :label="'字段'+(index + 1)">
              <el-input v-model="column.columnName" placeholder="请输入字段名称" disabled v-if="!column.is_bianji"></el-input>
              <el-input v-model="column.columnName" placeholder="请输入字段名称" v-else></el-input>

              <vul-button type="primary" size="small" v-if="column.is_bianji" @click="getColumnInfo(column)">修改</vul-button>
              <el-button type="danger" size="small"  v-if="column.is_bianji" @click="deleteColumn(column)">
                <i class="el-icon-delete"></i> 删除
              </el-button>
            </el-form-item>
        </el-form>
      </span>
      <span slot="footer" class="footer-button">
        <vul-button @click="addcolumn" type="primary">添加字段</vul-button>
        <!-- <el-button type="primary" @click="addcolumnSubmit">确 认</el-button>
        <el-button @click="assetCancle">取 消</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'
import FilterData from '@/components/components/FilterData'
import AssetTable from '@/components/components/AssetTable'
import FormData from '@/components/components/FormData'

export default {
  name: 'AssetManage',
  components: {
    ConTitle,
    AssetTable,
    FilterData,
    FormData
  },
  data () {
    return {
      titlename: '资产维护',
      pageTotal: 0,
      // 资产导入
      importDialogVisible: false,
      dialogVisible: false,
      AssetDialog: false,
      EventName: '',
      EventArgs: '',
      FilterList: [
        {name: 'name', label: '资产名称', type: 'input', placeholder: '请输入资产名称'},
        {name: 'deptId', label: '资产归属', type: 'treeselect', options: [], placeholder: '请选择归属部门', fixed: 'left'},
        {name: 'add_time', label: '添加时间', type: 'date'}
      ],
      FilterForm: {
        name: '',
        deptId: null,
        add_time: ['', ''],
        page: 1,
        limit: 10
      },
      dataKey: [],
      backupdataKey: [
        {name: 'name', label: '资产名称', type: 'input', fixed: 'left'},
        {name: 'deptId', label: '归属部门', type: 'treeselect', options: [], placeholder: '请选择归属部门', fixed: 'left'}
      ],
      ColumnList: [],
      tableTitle: [],
      backupTableTitle: [
        {key: 'name', label: '资产名称', is_show: true, is_bianji: true, is_disabled: true, fixed: ''},
        {key: 'deptName', label: '归属部门', type: '', is_show: true, is_bianji: true},
        {key: 'assetsStatus', label: '资产状态', is_show: true, filter: 'AssetStatusFilter'},
        {key: 'createDate', label: '添加时间', is_show: true}
      ],
      AssetForm: {
        name: '',
        deptId: null
      },
      rules: {
        name: [{required: true, message: '请输入资产名称', trigger: 'blur'}],
        deptId: [{required: true, message: '请选择归属部门', trigger: 'blur'}]
      },
      tableData: [],
      HandleConfig: {
        width: '180',
        fixed: 'right',
        text_algin: 'center',
        buttonList: [
          {title: '编辑', icon_name: '#iconbianji', size: 'mini', event_name: 'asset_edit', event_args: ''},
          {title: '删除', icon_name: '#iconshanchu', size: 'mini', event_name: 'asset_delete', event_args: ''}
        ],
      },
      importNums: 0,
      submitForm: {},
      SelectRowList: [],
      importSelectRowList: [],
      // 文件导入名
      filename: '',
      // 文件导入参数
      uploadData: {
        keys: ['66244932-3a61-48c5-b847-9a750ba6567e'],
        task_id: '',
        timestamp: new Date().getTime()
      },
      // 文件导入数据
      importTable: [],
      // 自定义字段
      importTitle: [],
      importLoading: false,
      loading: true,
      tableCurPage: 1,
      tableCurPageSize: 10
    }
  },
  methods: {
    restFilter () {
      this.FilterForm.name = null
      this.FilterForm.deptId = null
      this.FilterForm.add_time = ['', '']
      this.search()
    },
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs
    },
    SelectChange (val) {
      console.log(val)
      this.importSelectRowList = val
    },
    page_currentsize_change (val) {
      this.FilterForm.limit = val
      this.search()
    },
    page_current_change (val) {
      this.FilterForm.page = val
      this.search()
    },
    search () {
      this.loading = true
      this.submitForm.name = this.FilterForm.name
      this.submitForm.deptId = this.FilterForm.deptId
      this.submitForm.startTime = this.FilterForm.add_time[0].replace('12:00:00', '00:00:00')
      this.submitForm.endTime = this.FilterForm.add_time[1].replace('12:00:00', '23:59:59')
      this.submitForm.page = this.FilterForm.page
      this.submitForm.limit = this.FilterForm.limit

      let url = '/assets/loadAllAssets'
      this.axios.post(url, this.qs.stringify(this.submitForm)).then((Response) => {
        const d = Response.data
        this.pageTotal = d.count
        this.tableData = [...d.data]
        this.loading = false
      })
    },
    handleSizeChange (val) {
      this.tableCurPageSize = val
    },
    PageCurrentChange (val) {
      this.tableCurPage = val
    },
    beforeUpload (file) {
      console.log(file)
      this.uploadData.task_id = file.uid
      this.uploadData.name = file.name
    },
    uploadSuccess (Response, file, fileList) {
      this.loading = true
      this.filename = file.name
      const formData = {task_id: file.uid, name: file.name, type: 'asset', filetype: file.raw.type}
      const url = 'http://103.44.144.41:12120/upload/success?' + this.qs.stringify(formData)
      this.axios.get(url).then((Response) => {
        let tableData = []
        const d = Response.data
        if (d.code !== 0) {
          this.$message.error(d.msg)
          return
        }
        // 异常处理文件解析
        try {
          for(let key in d.data) {
            //如果内容为空则直接跳过
            if (Object.keys(d.data[key]).length === 0 || key === '0') continue
              let temp = {}
              temp.aid = key
              for (let i in d.data[key]) {
                temp[this.importTitle[i]['name']] = d.data[key][i]
              }
              temp.importStatus = '待导入'
              tableData.push(temp)
            }
        } catch (error) {
          this.$message.error('资产报表解析失败')
        }
        
        this.importNums = tableData.length
        this.importTable = [...tableData]
        this.loading = false
      })
    },
    importSubmit (mode) {
      if (mode === false) {
        if (this.importSelectRowList.length === 0) {
          this.$message.error('请选择要导入的资产')
          return
        }
      } else {
        if (this.importTable.length === 0) {
          this.$message.error('暂无数据可操作')
          return
        }
      }
      
      this.importLoading = true
      let error = 0
      let success = 0
      let dataMap = this.importSelectRowList
      if (mode) {
        dataMap = this.importTable
      }
      let url ='/assets/addAssets'
      for (let key in dataMap) {
        this.axios.post(url, this.qs.stringify(dataMap[key])).then((Response) => {
          if (Response.data.code === 200) {
            success += 1
            // this.updateImport(false, dataMap[key].aid)
            this.updateImport(true, dataMap[key].aid, Response.data.msg)
          } else {
            error += 1
            this.updateImport(true, dataMap[key].aid, Response.data.msg)
          }

          if ((success + error) === dataMap.length) {
            this.$alert('成功添加' + success + '条, 失败操作' + error + '条', '导入结果', {
              confirmButtonText: '确定',
              type: 'info'
            })
            this.importLoading = false
            this.search()
          }
        })
      }
    },
    // true为更新 false为删除
    updateImport (mode, aid, content = '') {
      let importTable = [...this.importTable]
      for(let i in this.importTable) {
        console.log(this.importTable[i].aid, aid)
        if (this.importTable[i].aid === aid) {
          if (mode) {
            importTable[i].importStatus = content
          } else {
            importTable.splice(i, 1)
          }
          break
        }
      }

      this.importTable = [...importTable]
    },
    importAllSubmit () {
      this.importLoading = true
      let error = 0
      let success = 0
      let url ='/assets/addAssets'
      for (let key in this.importTable) {
        this.axios.post(url, this.qs.stringify(this.importSelectRowList[key])).then((Response) => {
          if (Response.data.code === 200) {
            success += 1
          } else {
            error += 1
          }

          if ((success + error) === this.importNums) {
            if (success > 0) this.message_box('成功：' + success)
            if (error > 0) this.$message.error('失败' + error)
            this.importLoading = false
          }
        })
      }
    },
    rest () {
      this.AssetDialog = false
      for (let key in this.AssetForm) {
        this.AssetForm[key] = null
      }
    },
    assetCancle () {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.rest()
      })
      this.$refs.formdata.resetForm()
    },
    assetHandleClose (done) {
      done()
      this.assetCancle()
    },
    // 资产导入
    assetImport () {
      // 获取自定义字段
      let imoprtStatus = {
        name: 'importStatus',
        label: '导入状态'
      }
      this.importTitle = [...this.dataKey]
      this.importTitle.map(function (d, i, a) {
        if (d.name === 'deptId') {
          this.importTitle[i]['name'] = 'deptName'
        }
      }, this)
      // 在最后一行添加导入状态
      this.importTitle.push(imoprtStatus)
      this.importDialogVisible = true
    },
    importHandleClose (done) {
      done()
      this.importTable = []
      this.importNums = 0
      this.filename = null
    },
    assetAdd () {
      this.gain_orginlist()
      this.AssetDialog = true
    },
    asset_edit (row) {
      this.gain_orginlist()
      for(let key in row[0]) {
        if (key === 'createDate' || key === 'updateTime') continue
        this.AssetForm[key] = row[0][key]
      }
      // this.AssetForm.id = Number(row[0].id)
      // this.AssetForm.deptId = row[0].deptId
      // this.AssetForm.name = row[0].name
      this.AssetDialog = true

    },
    submitData () {
      console.log(this.$refs.formdata.validateValue())
      if (!this.$refs.formdata.validateValue()) {
        return false
      }

      let url = '/assets/addAssets'
      if (this.AssetForm.id) {
        url = '/assets/updateAssets'
      }

      this.axios.post(url, this.qs.stringify(this.AssetForm)).then((Response) => {
        const d = Response.data
        if (d.code === 200) {
          this.message_box(d.msg)
          this.search()
        } else {
          this.$message.error(d.msg)
        }
      })
      this.rest()
    },
    asset_delete (row) {
      this.$confirm('是否确认删除该条资产信息？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        let url ='/assets/deleteAssets?id=' + row[0].id
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
        this.$message.error('请选择要删除的资产')
        return
      }
      this.$confirm('是否要批量删除被选择的资产？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const url = '/assets/batchDeleteAssets'
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
    select_change_data (row) {
      let SelectRowList = []
      row.map(function (d, i, a) {
        SelectRowList.push(d.id)
      })
      console.log(SelectRowList)
      this.SelectRowList = SelectRowList
    },
    message_box (msg, type = 'success') {
      this.$message({
        message: msg,
        type: type
      })
    },
    // 字段添加函数
    show_dialog () {
      const unShow = ['update_time', 'create_date']
      let url = "/assets/loadAllAssetsDefine"
      this.axios.get(url).then((respones) => {
        const d = respones.data
        if (d.code === 0) {
          let columnList = []
          d.data.map(function (data, index, arr) {
            // if (data.columnId)
            if (unShow.indexOf(data.columnId) < 0) {
              // 默认可以编辑
              data.is_bianji = true
              if (data.columnId.indexOf('column') < 0) {
                // 系统设置的字段是无法编辑
                data.is_bianji = false
              }
              columnList.push(data)
            }
          })
          this.ColumnList = [...columnList]
          this.dialogVisible = true
        } else {
          this.$message.error(d.msg)
        }
      })
    },
    getColumnInfo (column) {
      let url = '/assets/updateAssetsDefine'
      let data = {id: column.id, columnName: column.columnName, columnId: column.columnId, serNo: column.serNo}
      this.axios.post(url, this.qs.stringify(data)).then((response) => {
        const d = response.data
        if (d.code === 200) {
          this.$message({
            type: 'success',
            message: d.msg
          })
          this.show_dialog()
          this.getTableTitle()
        } else {
          this.$message.error(d.msg)
        }
      })
    },
    getMinNumber (row) {
      // 最小值数据初始化
      let minNumber = 0
      let minNumberList = row.map((item) => (item.columnId))
      console.log(minNumberList)
      for(let i in minNumberList) {
        if (minNumberList.indexOf('column' + (Number(i) + 1)) < 0) {
          minNumber = Number(i) + 1
          break
        }
      }
      return minNumber
    },
    addcolumn () {
      // 先获取最小值
      let url = "/assets/loadAllAssetsDefine"
      this.axios.get(url).then((respones) => {
        const d = respones.data
        const minNumber = this.getMinNumber(d.data)

        this.$prompt('请输入字段名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValidator: this.validColumnName,
          inputErrorMessage: '字段名称错误'
        }).then(({ value }) => {
          let dataForm = {
            id: 0,
            columnId: 'column' + minNumber,
            columnName: value,
            serNo: d.data[d.data.length - 1]['serNo'] + 1
          }
          let addUrl = '/assets/updateAssetsDefine'
          this.axios.post(addUrl, this.qs.stringify(dataForm)).then((response) => {
            const result = response.data
            if (result.code === 200) {
              this.$message({
                type: 'success',
                message: result.msg
              })
              this.show_dialog()
              this.getTableTitle()
            } else {
              this.$message.error(result.msg)
            }
          })
        })
      })
    },
    validColumnName (value) {
      if (value.length < 9 && value.length > 0) {
        return true
      } else {
        return false
      } 
    },
    addcolumnSubmit () {
      this.tableTitle = [...this.ColumnList]
      this.dialogVisible = false
    },
    deleteColumn (column) {
      this.$confirm('该字段删除后，相应的数据也会被清空。你是否确认删除该字段名称？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showClose: false,
        type: 'warning'
      }).then(() => {
        let url = '/assets/updateAssetsDefine'
        let data = {delId: column.id, columnId: column.columnId}
        this.axios.post(url, this.qs.stringify(data)).then((Response) => {
          const d = Response.data
          if (d.code === 200) {
            this.$message({
              type: 'success',
              message: d.msg
            })
            this.show_dialog()
            this.getTableTitle()
          } else {
            this.$message.error(d.msg)
          }
        })
        // this.ColumnList.splice(index, 1)
        
      })
    },
    exportData () {
      if (this.SelectRowList.length === 0) {
        this.$message.error('未选择相应的信息')
        return
      }
      this.$prompt('请输入要导出的文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S{1,10}$/,
        inputErrorMessage: '输入文件名开头和结尾存在空格或输入超过10个字符'
      }).then(({ value }) => {
        const url = '/assets/exportAssets'
        let data = {ids: this.SelectRowList, exportName: value}
        this.axios.post(url, this.qs.stringify(data)).then((Response) => {
          const d = Response.data
          if (d.code === 200) {
            this.message_box(d.msg)
          } else {
            this.$message.error(d.msg)
          }
        })
      })
    },
    exportAll () {
      this.$prompt('请输入要导出的文件名', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^\S{1,10}$/,
        inputErrorMessage: '输入文件名开头和结尾存在空格或输入超过10个字符'
      }).then(({ value }) => {
        const url = '/assets/exportAssets'
        let data = {exportName: value}
        this.axios.post(url, this.qs.stringify(data)).then((Response) => {
          const d = Response.data
          if (d.code === 200) {
            this.message_box(d.msg)
          } else {
            this.$message.error(d.msg)
          }
        })
      })
    },
    handleClose (done) {
      done()
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
        this.dataKey[1]['options'] = [d[0]]
        this.FilterList[1]['options'] = [d[0]]
      })
    },
    getTableTitle () {
      let url = "/assets/loadAllAssetsDefine"
      this.tableTitle = [...this.backupTableTitle]
      this.dataKey = [...this.backupdataKey]
      this.axios.get(url).then((response) => {
        const d = response.data
        d.data.map(function (data, index, arr) {
          let temp = {}
          let keys = {}
          // {name: 'name', label: '资产名称', type: 'input'}
          if (data['columnId'].indexOf('column') >= 0) {
            temp.key = data['columnId']
            temp.label = data['columnName']
            temp.is_show = true
            
            // 编辑所需
            temp.name = data['columnId']
            temp.type = 'input'
            this.$set(this.AssetForm, data['columnId'], null)
            // this.AssetForm[data['columnId']] = ''
            this.tableTitle.push(temp)
            this.dataKey.push(temp)
          }
        }, this)
        this.search()
        this.gain_orginlist()
      })
    }
  },
  created() {
    this.getTableTitle()
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
    tableTitle (newValue, oldValue) {
      this.$refs['table'].showTableTitle = newValue
    },
    // dataKey (newValue, oldValue) {
    //   this.$refs['formdata'].dataKey = newValue
    // },
    // AssetForm (newValue, oldValue) {
    //   this.$refs['formdata'].dataForm = newValue
    // }
  }
}
</script>

<style scoped>
.icon {
  width: 22px;
  height: 22px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.icon1 {
  width: 20px;
  height: 20px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.float-r > svg{
  margin-left: 30px;
  margin-top: 6px;
  cursor: pointer;
}
.assetManage >>>.el-date-editor{
  width: 100% !important;
}
.el-dialog .el-input{
  width: 100% !important;
}
.assetImport .el-input{
  width: 100% !important;
}
.addCloumn .el-input{
  width: 70% !important;
}
.addCloumn .el-form-item{
  width: 100% !important;
}
.footer-button{
  text-align: center;
}
.assetManage >>> .el-dialog{
  min-width: 800px;
}
</style>
