export default {
  // 加载状态
  loading: true,
  // 总菜单列表
  menuList: [],
  // 给菜单赋值
  setMenuList (menuList) {
    this.menuList = menuList
  },
  showMenuName: {
    value: [],
    get: function () {
      return this.value
    },
    set: function (val) {
      this.value = val
    }
  },
  // 禁用菜单
  displayMenu: ['菜单管理', '权限管理'],
  displayMenuId: [],
  setValue (MenuId) {
    this.displayMenuId.push(MenuId)
  },
  getValue () {
    return this.displayMenuId
  },
  // 漏洞来源 0-主机漏洞 1-应用漏洞 2-基线漏洞
  flawSouceList: {
    manual: {label: '手动添加', value: 'manual', type: null},
    nsfocus: {label: '绿盟极光导入', value: 'nsfocus', type: 0},
    nusass: {label: 'Nessus导入', value: 'nusass', type: 0},
    tianjin: {label: '天镜导入', value: 'tianjin', type: 1},
    moan: {label: '默安云导入', value: 'moan', type: 1},
    nsfocus_web: {label: '绿盟Web导入', value: 'nsfocus_web', type: 1}
  }
}
