/*
 * @Author: Mlins
 * @Date: 2020-08-04 14:14:46
 * @LastEditTime: 2020-08-13 11:42:14
 */
let formatDate = timestamp => {
  let date = new Date(timestamp)
  // var Y = date.getFullYear() + '-'
  // var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  // var D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate() + ' '
  // var h = date.getHours() < 10 ? ('0' + date.getHours()) : date.getHours() + ':'
  // var m = date.getMinutes() < 10 ? ('0' + date.getMinutes()) : date.getMinutes() + ':'
  // var s = date.getSeconds() < 10 ? ('0' + date.getSeconds()) : date.getSeconds()
  // return Y + M + D + h + m + s
  return date.toJSON().substr(0, 19).replace('T', ' ');
}

let SexFilter = sex => {
  if (sex === 1) {
    return '男'
  } else {
    return '女'
  }
}

let HandleStatusFilter = HandleStatus => {
  const HandleStatusList = {
    0: '新发现',
    1: '待审核',
    2: '待下发',
    3: '待修复',
    4: '待复测',
    5: '待关闭',
    6: '已修复',
    7: '已忽略'
  }
  return HandleStatusList[HandleStatus]
}

let RiskStatusFilter = RiskLevel => {
  const RiskLevelList = {
    0: '低危',
    1: '中危',
    2: '高危'
  }
  return RiskLevelList[RiskLevel]
}

let RiskTypeFilter = RiskType => {
  const RiskTypeList = {
    0: '主机漏洞',
    1: '应用漏洞',
    2: '基线漏洞'
  }
  return RiskTypeList[RiskType]
}

let RiskSrcFilter = RiskSrc => {
  const RiskSrcList = {
    normal: '标准模板导入',
    nsfocus: '绿盟极光导入',
    nusass: 'Nessus导入',
    tianjin: '天镜导入',
    moan: '默安云导入',
    manual: '手动添加',
    nsfocus_web: '绿盟Web导入'
  }
  return RiskSrcList[RiskSrc]
}

let ReportTypeFilter = ReportType => {
  const ReportTypeList = {
    0: '登录日志',
    1: '操作日志',
    2: '漏洞日志',
    3: '报表日志',
    4: '资产日志'
  }
  return ReportTypeList[ReportType]
}

let ReportStatusFilter = ReportStatus => {
  const ReportStatusList = {
    0: '正在生成',
    1: '完成',
    2: '生成失败'
  }
  return ReportStatusList[ReportStatus]
}

let AssetStatusFilter = AssetStatus => {
  const StatusList = {
    0: '正常',
    1: '废除',
    2: '闲置'
  }
  
  return StatusList[AssetStatus]
}

let FlawStatusFilter = FlawStatus => {
  const FlawStatusList = {
    0: '未关闭',
    1: '已关闭'
  }
  return FlawStatusList[FlawStatus]
}

let baiMDFilter = baiMDstatus => {
  const FlawStatusList = {
    0: '例外库',
    1: '报备库'
  }
  return FlawStatusList[baiMDstatus]
}

export {
  formatDate,
  SexFilter,
  HandleStatusFilter,
  RiskStatusFilter,
  RiskTypeFilter,
  RiskSrcFilter,
  ReportTypeFilter,
  ReportStatusFilter,
  AssetStatusFilter,
  FlawStatusFilter,
  baiMDFilter
}
