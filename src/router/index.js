import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

let r = [
  {
    path: '/test',
    component: () => import('../components/displayTest.vue')
  },
  {
    path: '/',
    name: 'Index',
    component: () => import('../components/Index.vue'),
    children: [
      {
        path: 'home/vulAnalysis',
        component: () => import('../components/home/VulAnalysis')
      },
      // 漏洞管理
      {
        path: 'vulmanage/vullist',
        component: () => import('../components/VulManage/VulList.vue')
      },
      {
        path: 'vulmanage/vuladd',
        component: () => import('../components/VulManage/VulAdd.vue')
      },
      // 报备库
      {
        path: 'vulmanage/vulreport',
        component: () => import('../components/VulManage/VulReport.vue')
      },
      {
        path: 'vulmanage/riskdetails',
        name: 'riskdetails',
        component: () => import('../components/VulManage/VulDetails.vue')
      },
      // 我的任务
      {
        path: 'taskmanage/handleawaitlist',
        name: 'handleawaitlist',
        component: () => import('../components/TaskManager/HandleAwaitList.vue')
      },
      {
        path: 'taskmanage/disposedlist',
        component: () => import('../components/TaskManager/DisposedList.vue')
      },
      // 日志审计
      {
        path: 'logaudit/archelist',
        component: () => import('../components/LogAudit/ArchiveList')
      },
      {
        path: 'logaudit/loglist',
        component: () => import('../components/LogAudit/LogList.vue')
      },
      {
        path: 'logaudit/archivel',
        component: () => import('../components/LogAudit/ArchiveList.vue')
      },
      // 分析报表
      {
        path: 'assetreport/datareport',
        component: () => import('../components/AssetReport/DataReport.vue')
      },
      {
        path: 'assetreport/synreport',
        component: () => import('../components/AssetReport/SynReport.vue')
      },
      // 系统管理
      {
        path: 'sysmanage/assetmanage',
        component: () => import('../components/SysManage/AssetManage.vue')
      },
      {
        path: 'sysmanage/orginmanage',
        component: () => import('../components/SysManage/OrginList.vue')
      },
      {
        path: 'sysmanage/rolemanage',
        component: () => import('../components/SysManage/RoleList.vue')
      },
      {
        path: 'sysmanage/usermanage',
        component: () => import('../components/SysManage/UserList.vue')
      },
      {
        path: 'sysmanage/flowmanage',
        component: () => import('../components/SysManage/FlowManage.vue'),
        children: [{
          path: '',
          components: {
            default: () => import('../components/SysManage/FlowManage2.vue')
          }
        }]
      },
      {
        path: 'sysmanage/authoritymanage',
        component: () => import('../components/SysManage/AuthorityManage')
      },
      {
        path: '/assetreport/downpage',
        component: () => import('../components/ConsolidatedStatement.vue')
      },
    ]
  },
  // 登陆界面
  {
    path: '/login',
    component: () => import('../components/login')
  },
  {
    path: '/vulIndex',
    component: () => import('../components/VulManagement')
  },
  {
    path: '/blank_vulIndex',
    component: () => import('../components/VulManagement')
  },
  {
    path: '/assetreportDownpage',
    component: () => import('../components/ConsolidatedStatement.vue')
  },
]

let router = new Router({ routes: r })

router.beforeEach((to, form, next) => {

  let url = window.location.href.split('#')[1];
  if (to.path !== '/login' || to.path !== '/vulIndex') {
    const MenuList = Vue.prototype.display.menuList
    for (let i in MenuList) {
      for (let j in MenuList[i].children) {
        if (MenuList[i].children[j].target.replace('/\//g', '') === to.path.replace('/\//g', '')) {
          Vue.prototype.display.showMenuName.set([MenuList[i].children[j].pname, MenuList[i].children[j].title, MenuList[i].children[j].target])
        }
      }
    }
  }
  // if (to.path == '/vulIndex') {
  //   // let url = window.location.href.split('#')[1];
  //   // console.log(222, url)
  //   // next('/none')
  //   // window.open('#/blank_vulIndex', "_blank");
  //   router.go(-1)
  // }
  next()
})

export default router

// export default new Router({
//   routes: [
//     {
//       path: '/',
//       name: 'Index',
//       component: () => import('../components/Index.vue'),
//       children: [
//         {
//           path: 'home/vulAnalysis',
//           component: () => import('../components/home/VulAnalysis')
//         },
//         // 漏洞管理
//         {
//           path: 'vulmanage/vullist',
//           component: () => import('../components/VulManage/VulList.vue')
//         },
//         {
//           path: 'vulmanage/vuladd',
//           component: () => import('../components/VulManage/VulAdd.vue')
//         },
//         // 报备库
//         {
//           path: 'vulmanage/vulreport',
//           component: () => import('../components/VulManage/VulReport.vue')
//         },
//         {
//           path: 'vulmanage/riskdetails',
//           name: 'riskdetails',
//           component: () => import('../components/VulManage/VulDetails.vue')
//         },
//         // 我的任务
//         {
//           path: 'taskmanage/handleawaitlist',
//           name: 'handleawaitlist',
//           component: () => import('../components/TaskManager/HandleAwaitList.vue')
//         },
//         {
//           path: 'taskmanage/disposedlist',
//           component: () => import('../components/TaskManager/DisposedList.vue')
//         },
//         // 日志审计
//         {
//           path: 'logaudit/archelist',
//           component: () => import('../components/LogAudit/ArchiveList')
//         },
//         {
//           path: 'logaudit/loglist',
//           component: () => import('../components/LogAudit/LogList.vue')
//         },
//         {
//           path: 'logaudit/archivel',
//           component: () => import('../components/LogAudit/ArchiveList.vue')
//         },
//         // 分析报表
//         {
//           path: 'assetreport/datareport',
//           component: () => import('../components/AssetReport/DataReport.vue')
//         },
//         {
//           path: 'assetreport/synreport',
//           component: () => import('../components/AssetReport/SynReport.vue')
//         },
//         // 系统管理
//         {
//           path: 'sysmanage/assetmanage',
//           component: () => import('../components/SysManage/AssetManage.vue')
//         },
//         {
//           path: 'sysmanage/orginmanage',
//           component: () => import('../components/SysManage/OrginList.vue')
//         },
//         {
//           path: 'sysmanage/rolemanage',
//           component: () => import('../components/SysManage/RoleList.vue')
//         },
//         {
//           path: 'sysmanage/usermanage',
//           component: () => import('../components/SysManage/UserList.vue')
//         },
//         {
//           path: 'sysmanage/flowmanage',
//           component: () => import('../components/SysManage/FlowManage.vue'),
//           children: [{
//             path: '',
//             components: {
//               default: () => import('../components/SysManage/FlowManage2.vue')
//             }
//           }]
//         },
//         {
//           path: 'sysmanage/authoritymanage',
//           component: () => import('../components/SysManage/AuthorityManage')
//         }
//       ]
//     },
//     // 登陆界面
//     {
//       path: '/login',
//       component: () => import('../components/login')
//     },
//     {
//       path: '/vulIndex',
//       component: () => import('../components/VulManagement')
//     }
//   ]
// })
