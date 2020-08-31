<template>
<div class="vultable">
  <el-table
    v-loading="loading"
    :data="tableData"
    @selection-change="SelectChange"
    :header-cell-style="tableHeaderColor"
    :border="border"
    style="width: 100%;">
    <!-- selection选项 -->
    <el-table-column type="selection" width="55" v-if="selection" align="center"></el-table-column>
    <!-- index -->
    <el-table-column type="index" align="center" v-if="index">
      <template slot="header" slot-scope="scope">
        序号
      </template>
    </el-table-column>
    <!-- 表格数据 -->
    <el-table-column
    v-for="title in showTableTitle"
    :key="title.key"
    :property="title.key"
    :label="title.label"
    :align="title.text_algin"
    :width="title.width"
    :fixed="title.fixed"
    :filters="typeof(title.filters) !== 'undefined'?title.filters:null"
    :filter-method="title.filters && filterHandler || null" 
    show-overflow-tooltip>
      <template slot="header" slot-scope="scope">
        <span v-if="title.header_icon">
          {{ title.label }}
          <svg class="filters-icon" aria-hidden="true">
            <use :xlink:href="title.header_icon"></use>
          </svg>
        </span>
        <span v-else v-text="title.label"></span>
      </template>
      <!-- eslint-disable-next-line -->
      <template slot-scope="scope">
        <el-popover placement="top" trigger="click" width="1200" v-if="typeof(title.is_function)  !== 'undefined'">
          <!-- <flow-step :stepsList="title.StepList" :finshStepId="2"></flow-step> -->
          <flow-step :stepsList="title.stepsList" :finshStepId="title.flowPos"></flow-step>
          <button
            style="border: 1px solid;position: absolute;opacity: 0;"
            v-text="scope.row[title.key]"
            slot="reference"
            @click="button_click(title.event_name,[scope.row,title.event_args])">
          </button>
        </el-popover>
        <template v-if="typeof(title.component_config) !== 'undefined'">
          <!-- icon图标 -->
          <template v-if="title.component_config.type === 'icon'">
            <svg class="icon" aria-hidden="true">
              <use :xlink:href="title.component_config.rule.content[scope.row[title.component_config.rule.key]]"></use>
            </svg>
            <span v-text="scope.row[title.key]"></span>
          </template>
          <!-- css样式 -->
          <template v-else-if="title.component_config.type === 'css'">
            <span
            v-text="scope.row[title.key]"
            v-if="title.component_config.rule.content[scope.row[title.component_config.rule.key]]"
            :style="'color:'+title.component_config.rule.content[scope.row[title.component_config.rule.key]]">
            </span>
            <span
            v-text="scope.row[title.key]"
            v-else-if="!title.component_config.rule.content[scope.row[title.component_config.rule.key]] && title.component_config.rule.content['other']"
            :style="'color:'+title.component_config.rule.content['other']">
            </span>
            <span v-text="filter.filter(title.filter)(scope.row[title.key])" v-else-if="typeof(title.filter) !== 'undefined'"></span>
            <span v-text="scope.row[title.key]" v-else></span>
          </template>
        </template>
        <template v-else>
          <span v-text="filter.filter(title.filter)(scope.row[title.key])" v-if="typeof(title.filter) !== 'undefined'"></span>
          <span v-text="scope.row[title.key]" v-else></span>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="操作" :align="HandleConfig.text_algin" :width="HandleConfig.width" :fixed="HandleConfig.fixed" v-if="typeof (HandleConfig) !== 'undefined'">
      <!-- eslint-disable-next-line -->
      <template slot="header" slot-scope="scope">
        操作
        <template v-if="TableTitleSel">
          <svg class="icon" aria-hidden="true" style="fill:#5fa7e1" @click=" is_show = !is_show">
            <use xlink:href="#iconquanxuan"></use>
          </svg>
          <el-select v-model="showTableIndex" multiple collapse-tags style="position: absolute;top: -10px;left: 50%;opacity: 0;width: 140px;">
            <el-option
            v-for="title_option in tableTitle"
            :label="title_option.label"
            :key="title_option.key"
            :value="title_option.key"
            :disabled="title_option.is_disabled">
            </el-option>
          </el-select>
        </template>
        <template>
          <slot name="addcolumn"></slot>
        </template>
      </template>
      <!-- eslint-disable-next-line -->
      <template slot-scope="scope">
        <template v-for="button in HandleConfig.buttonList">
          <template v-if="button.type === 'select'">
            <el-dropdown
              trigger="click"
              :key="button.icon_name"
              v-if="typeof (button.scopedconfig) === 'undefined' || scope.row[button.scopedconfig.key] !== button.scopedconfig.value">
              <el-button
              :size="button.size"
              :title="button.title"
              :disabled="button.disabled_cond?button.disabled_cond.rule[scope.row[button.disabled_cond.key]]:false"
              >
                <svg class="buttonicon" aria-hidden="true">
                  <use :xlink:href="button.icon_name" size="small"></use>
                </svg>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item
                v-for="option in button.select_options"
                :key="option.key"
                v-text="option.label"
                @click.native="button_click(button.event_name,[scope.row,button.event_args])"
                ></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
          <template v-else-if="button.type === 'text'">
            <span
              class="button-text"
              @click="button_click(button.event_name,[scope.row,button.event_args])"
              :class="{'is_show': button.display?button.display.rule[scope.row[button.display.key]] : false}"
              :key="button.event_name">{{ button.title }}</span>
              <span :key="button.title" class="button-line" v-if="button.line">|</span>
          </template>
          <template v-else>
            <el-button
            v-if="typeof (button.scopedconfig) === 'undefined' || scope.row[button.scopedconfig.key] === button.scopedconfig.value"
            :size="button.size"
            :title="button.title"
            :key="button.icon_name"
            @click="button_click(button.event_name,[scope.row,button.event_args])"
            :disabled="button.disabled_cond?button.disabled_cond.rule[scope.row[button.disabled_cond.key]]:false">
              <span v-if="button.icon_name">
                <svg class="buttonicon" aria-hidden="true">
                  <use :xlink:href="button.icon_name" size="small"></use>
                </svg>
              </span>
              <span v-else>{{button.title}}</span>
            </el-button>
          </template>
        </template>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-if="pagination"
    background
    @size-change="handleSizeChange"
    @current-change="PageCurrentChange"
    :page-sizes="[10, 20, 50, 100, 200]"
    :page-size="10"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pageTotal">
  </el-pagination>
</div>
</template>

<script>
import Vue from 'vue'
import FlowStep from '@/components/components/FlowStep'

export default {
  name: 'AssetTable',
  components: {
    FlowStep
  },
  props: {
    // 是否需要selection组件选项
    selection: Boolean,
    // 是否需要分页模块
    pagination: Boolean,
    loading: Boolean,
    border: Boolean,
    index: Boolean,
    // 分页总数
    pageTotal: Number,
    // 展开行所需展示的字段信息
    ExpandTitle: Object,
    // 表数据
    tableData: Array,
    // 总表头数据 tableTitle: [{key: tablecolumn, label: tablename, text_algin: 'left|center|right', width: int}]
    tableTitle: Array,
    /* 步骤 */
    StepList: Array,
    // 按钮操作配置
    HandleConfig: Object,
    // 是否需要文件头下拉框
    TableTitleSel: Boolean
    // // 表格头样式
    // tableHeaderColor: Function
  },
  methods: {
    // 当前页面行数大小发生改变所触发的函数
    handleSizeChange (val) {
      this.$emit('page-currentsize-change', val)
    },
    // 当前页面变化所触发的函数
    PageCurrentChange (val) {
      this.$emit('page-current-change', val)
    },
    SelectChange (val) {
      // select-change-data用于传送表格selection数据的变化
      this.$emit('select-change-data', val)
    },
    // 全选操作
    all_select () {
      for (let i = 0; i < this.tableTitle.length; i++) {
        this.showTableIndex.push(this.tableTitle[i].key)
      }
    },
    // 更新表格标题
    update_table_title (arr) {
      let temp = []
      for (var i = 0; i < this.tableTitle.length; i++) {
        if (arr.indexOf(this.tableTitle[i].key) >= 0) {
          temp.push(this.tableTitle[i])
        }
      }
      return temp
    },
    // 触发按钮事件
    button_click (EventName, DataObject) {
      this.$emit('MonitorEvent', EventName, DataObject)
    },
    // 表格头部样式
    tableHeaderColor () {
      return 'background-color: #F5F5F5'
    },
    // 表格过滤
    filterHandler (value, row, column) {
      console.log(value)
      return row['handleStatus'] === Number(value)
    }
  },
  watch: {
    showTableIndex (newValue, oldValue) {
      let temp = this.update_table_title(newValue)
      this.showTableTitle = temp
    }
  },
  beforeMount () {
    for (let i = 0; i < this.tableTitle.length; i++) {
      if (this.tableTitle[i].is_show) {
        this.showTableIndex.push(this.tableTitle[i].key)
      }
    }
  },
  data () {
    return {
      showTableIndex: [],
      showTableTitle: [],
      showTableData: [],
      filter: Vue
    }
  }
}
</script>

<style scoped>
.icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
  margin-left: -10px;
  margin-top: 5px;
}
.filters-icon {
  width: 1em;
  height: 1em;
  fill: currentColor;
  overflow: hidden;
  vertical-align: -0.15em;
  margin-left: 0px;
}
.buttonicon {
  width: 14px;
  height: 14px;
  fill: currentColor;
  overflow: hidden;
  margin-right: 0px;
}
.is-disabled .icon:hover{
  cursor: not-allowed;
}
.el-select-dropdown__item.is-disabled {
  color: #C0C4CC !important;
  cursor: not-allowed;
}
.el-table{
  margin-top: 20px;
}
.el-table__expanded-cell .el-form-item{
  margin: 0px;
  padding: 0px;
  width: 32%;
  padding-left: 30px;
}
.el-table__expanded-cell .el-form-item >>> .el-form-item__label{
  font-weight: 600 !important;
}
.el-pagination{
  padding: 10px;
  float: right;
}
.el-dropdown{
  margin: 0px 10px;
}
.button-text{
  color:  #0E76D7 !important;
  margin: 5px;
}
.button-text:hover{
  cursor: pointer;
}
.button-line{
  color: #0E76D7;
}
.is_show{
  display: none;
}
.vultable >>> .content {
  margin-left: -50px;
}
</style>
