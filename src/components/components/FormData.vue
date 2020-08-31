
<template>
  <div class="formData">
    <el-form label-width="100px" label-position="left" :model="dataForm" ref="dataForm" :rules="rules?rules:[]">
      <div
        v-for="d in dataKey"
        :key="d.name"
        >
        <el-form-item :label="d.label" :prop="d.name">
          <template v-if="d.type === 'input'">
            <el-input v-model="dataForm[d.name]" :placeholder="d.placeholder"></el-input>
          </template>
          <template v-else-if="d.type === 'checkbox'">
            <el-radio-group v-model="dataForm[d.name]">
              <el-radio
                v-for="r in d.options"
                :key="r.name"
                :label="r.value">{{ r.label }}</el-radio>
            </el-radio-group>
          </template>
          <template v-else-if="d.type === 'select'" :prop="d.name">
            <el-select v-model="dataForm[d.name]" :placeholder="d.placeholder">
              <el-option
                v-for="o in d.options"
                :key="o.name"
                :label="o.label"
                :value="o.value"
              ></el-option>
            </el-select>
          </template>
          <template v-else-if="d.type === 'treeselect'" :prop="d.name">
            <span v-if="!loading">
              <tree-select :options="d.options" v-model="dataForm[d.name]" :clearable="false" :normalizer="normalizer" :defaultExpandLevel="Infinity" :placeholder="d.placeholder"></tree-select>
            </span>
            <span v-else>
              <el-input placeholder="加载中......" disabled></el-input>
            </span>
          </template>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import TreeSelect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  name: 'FormData',
  components: {
    TreeSelect
  },
  props: {
    dataKey: Array,
    dataForm: Object,
    loading: Boolean,
    rules: Object
  },
  beforeMount () {
    console.log(this.dataForm)
  },
  methods: {
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
    validateValue () {
      let rt = false
      this.$refs['dataForm'].validate((valid) => {
          if (!valid) {
            return false
          } else {
            rt = true
          }
      })
      return rt
    },
    resetForm() {
      this.$refs['dataForm'].resetFields()
    }
  }
}
</script>

<style scoped>
.formData >>> .el-select{
  width: 80% !important;
}
.formData >>> .el-select .el-input__inner{
  width: 100% !important;
}
.formData >>> .el-input__inner{
  width: 80% !important;
}
.formData >>> .vue-treeselect{
  width: 80% !important;
}
</style>
