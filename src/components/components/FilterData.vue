<template>
  <div>
    <el-form label-width="80px">
      <el-row type="flex" class="flex-wrap-wrap" :gutter="20">
        <el-col
        v-for="i in FilterList"
        :key="i.name"
        :span="8">
          <el-form-item :label="i.label">
            <template v-if="i.type === 'input'">
              <el-input v-model.trim="FilterForm[i.name]" :placeholder="i.placeholder" maxlength="50" ></el-input>
            </template>
            <template v-else-if="i.type === 'select'">
              <el-select v-model="FilterForm[i.name]" :placeholder="i.placeholder" maxlength="50" :multiple="i.multiple || false">
                <el-option
                  v-for="o in i.options"
                  :key="o.value"
                  :label="o.label"
                  :value="o.value">
                  </el-option>
              </el-select>
            </template>
            <template v-else-if="i.type === 'treeselect'">
              <span v-if="!loading">
                <tree-select :options="i.options" v-model="FilterForm[i.name]" :clearable="false"  appendToBody  :defaultExpandLevel="Infinity" :placeholder="i.placeholder"></tree-select>
              </span>
              <span v-else>
                <el-input placeholder="加载中......" disabled></el-input>
              </span>
            </template>
            <template v-else-if="i.type === 'date'">
              <el-date-picker
                v-model="FilterForm[i.name]"
                type="daterange"
                unlink-panels
                :clearable="false"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyy-MM-dd hh:mm:ss"
                :picker-options="pickerOptions">
              </el-date-picker>
            </template>
          </el-form-item>
        </el-col>
        <slot name="ButtonContent"></slot>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'FilterData',
  components: {
    TreeSelect
  },
  props: {
    FilterList: Array,
    FilterForm: Object,
    loading: Boolean
  },
  data () {
    return {
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
  }
}
</script>

<style scoped>
/* .el-form-item{
  width: 80% !important;
} */
.el-select{
  width: 100% !important;
}
.el-input{
  width: 100% !important;
}
.el-date-editor {
  width: 100% !important;
}
</style>
