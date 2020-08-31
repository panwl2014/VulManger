<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import './assets/css/index.css'
import '../static/icon/iconfont'

export default {
  name: 'App'
}
</script>

<style scoped>
html,body{
  min-width: 1280px;
}
#app{
  width: 100%;
}
</style>
