<template>
  <div class="vul-button">
    <el-button
      @click="handleClick"
      :type="type"
      :size="size"
      :plain="plain">
      <template>
        <slot></slot>
      </template>
    </el-button>
  </div>
</template>

<script>
import '../../../static/css/vulstyle.css'

export default {
  name: 'Vul-Button',
  props: {
    type: String,
    size: String,
    plain: Boolean
  },
  methods: {
    handleClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>
