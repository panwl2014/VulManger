<template>
  <el-card class="content_card_header">
    <div class="card_title" v-text="name" :class="{'pb-2':!isPad}"></div>
    <slot></slot>
    <template v-if="isPad">
      <el-menu :default-active="index" mode="horizontal">
        <el-menu-item v-for="item in MenuTitleName" :key="item.index" @click.native="Tabchange(item)" :index="item.index">       
          <span v-if="item.badge">
            <el-badge :value="item.nums" class="item">{{ item.name }}</el-badge>
          </span>
          <span v-else>
            {{ item.name }}
          </span>
        </el-menu-item>
      </el-menu>
    </template>
    <slot name="bottom"></slot>
  </el-card>
</template>

<script>
export default {
  name: 'ConTitle',
  component_name: '',
  props: {
    name: String,
    CardTitleMenu: Boolean,
    CurrentId: String,
    MenuTitleName: Array
  },
  data () {
    return {
      message: 'message',
      index: '',
      isPad: false
    }
  },
  methods: {
    Tabchange (val) {
      let CurrentPage = val.id
      this.$emit('CurrentPageChange', CurrentPage)
    },
    updateData () {

    }
  },
  // watch: {
  //   CurrentId (newValue, oldValue) {
  //     this.index = this.CurrentId
  //   }
  // },
  mounted () {
    if (typeof (this.MenuTitleName) === 'undefined' || this.MenuTitleName.length === 0) {
      this.isPad = false
    } else {
      this.isPad = true
      if (typeof (this.CurrentId) === 'undefined') {
        this.index = this.MenuTitleName[0].index
      } else {
        this.index = this.CurrentId
      }
    }
  }
}
</script>

<style scoped>
.content_card_header{
  height: auto;
  padding-left: 10px;
  user-select: none;
  margin-right: 10px;
}
.content_card_header >>> .el-card__body{
  padding-bottom: 0;
}
.card_title{
  font-size: 18px;
  font-weight: 600;
}
.el-menu{
  border-width: 0;
}
.el-menu--horizontal>.el-menu-item.is-active {
  border-bottom:2px solid #409EFF;
  color:#303133;
  cursor: pointer;
}
.content_card_header .is-active{
  color: #0A82E1 !important;
}

.content_card_header .el-menu-item{
  height: 54px !important;
  padding: 0px;
  margin-right: 20px !important;
}
.content_card_header >>> .el-badge__content{
  margin-top: 20px;
}
.content_card_header >>> .el-menu-item{
  margin-right:50px !important;
}
</style>
