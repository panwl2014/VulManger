<template>
  <div class="content">
    <el-steps :active="finshStepId" :stepsList="stepsList" align-center>
      <el-step
        v-for="s in stepsList"
        :key="s.id"
        className="width-50"
        >
        <template slot="icon">
          <div class="spot"></div>
        </template>
        <template slot="title">
          <div>
            {{s.name}}
          </div>
        </template>
        <template slot="description">
          <div class="step_description ">
            <span class="u-tri"></span>
            <span>{{s.time}}</span>
            <br>
            <span>{{s.persion}}</span>
          </div>
        </template>
      </el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'FlowStep',
  props: {
    finshStepId: Number,
    stepsList: Array
  }
}
</script>

<style scoped>
/* 步骤条样式 */
.content{
  margin-top: 40px;
  margin-bottom: 40px;
}
.spot{
  width: 14px;
  height: 14px;
  border-radius: 50%;
}
.is-finish .spot{
  background-color: #4C954F;
}
.content >>> .el-step__head.is-finish{
  border-color: #4C954F !important;
}
.content >>> .el-step__head.is-finish .el-step__line .el-step__line-inner{
  border-width: 1px !important;
  width: 100% !important;
}
.is-process .spot{
  background-color: #5C80D7;
}
.content >>> .el-step__head.is-process{
  border-color: #5C80D7 !important;
  color: #5C80D7 !important;
}
.content >>> .el-step__head.is-process .el-step__line .el-step__line-inner{
  border-width: 1px !important;
}
/* 进度描述 */
.content >>> .el-step.is-center .el-step__description{
  margin-left: -5%;
}
.step_description{
  margin-left: -15px;
  color: #fff;
}
:not(.is-wait) > .step_description{
  width: 10vw;
  height: 60px;
  padding-top: 10px;
  margin-top: 55px;
  border: 1px solid;
}
.is-finish .step_description{
  background-color: #4C954F !important;
}
.is-process .step_description{
  background-color: #5C80D7 !important;
}
.is-wait > .step_description {
  display: none;
}
.content >>> .el-step__title{
  margin-top: -40px !important;
  line-height: 0px !important;
}
.content >>> .el-step__title.is-finish{
  color: #4C954F !important;
}
.content >>> .el-step__title.is-process{
  color: #5C80D7 !important;
}
.u-tri{
  display: inline-block;
  position: absolute;
  top: 15px;
  left: calc(50% - 8px);
  border-top: 10px solid transparent;
  border-bottom: 15px solid;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
}
.is-finish .u-tri {
  border-bottom-color: #4C954F;
}
.is-process .u-tri {
  border-bottom-color: #5C80D7;
}
</style>
