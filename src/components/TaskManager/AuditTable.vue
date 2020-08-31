<template>
  <div>
    <asset-table
      selection
      pagination
      :loading="loading"
      :pageTotal="pageTotal"
      :tableTitle="tableTitle"
      :tableData="tableData"
      :HandleConfig="HandleConfig"
      @MonitorEvent="monitor_event"
    >
    </asset-table>
  </div>
</template>

<script>
import AssetTable from '@/components/components/AssetTable'

export default {
  name: 'AuditTable',
  components: {
    AssetTable
  },
  data () {
    return {
      pageTotal: 200,
      EventName: '',
      EventArgs: '',
      tableTitle: [
        {key: 'flawIdentifying', label: '漏洞编号', is_show: true, text_algin: 'center'},
        {key: 'flawName', label: '漏洞名称', is_show: true, text_algin: 'center'},
        {key: 'flawType', label: '漏洞类型', is_show: true, filter: 'RiskTypeFilter', text_algin: 'center'},
        {key: 'findTime', label: '发现时间', is_show: true, filter: 'formatDate', text_algin: 'center'},
        {key: 'flawIp', label: '资产IP', is_show: true, text_algin: 'center'},
        {key: 'deptName', label: '所属部门', is_show: true, text_algin: 'center'},
        {key: 'manageTime', label: '收到时间', is_show: true, filter: 'formatDate', text_algin: 'center'}
      ],
      tableData: [
        {risk_sno: 'FESX01KFF768', risk_name: 'xxx漏洞', risk_type: '主机漏洞', find_date: '2020-05-12 12:00:00', asset_ip: '192.168.1.2', asset_orgin: '政企部', end_date: '2020-05-12 12:00:00'},
        {risk_sno: 'FESX01KFF768', risk_name: 'xxx漏洞', risk_type: '主机漏洞', find_date: '2020-05-12 12:00:00', asset_ip: '192.168.1.2', asset_orgin: '政企部', end_date: '2020-05-12 12:00:00'},
        {risk_sno: 'FESX01KFF768', risk_name: 'xxx漏洞', risk_type: '主机漏洞', find_date: '2020-05-12 12:00:00', asset_ip: '192.168.1.2', asset_orgin: '政企部', end_date: '2020-05-12 12:00:00'},
        {risk_sno: 'FESX01KFF768', risk_name: 'xxx漏洞', risk_type: '主机漏洞', find_date: '2020-05-12 12:00:00', asset_ip: '192.168.1.2', asset_orgin: '政企部', end_date: '2020-05-12 12:00:00'},
        {risk_sno: 'FESX01KFF768', risk_name: 'xxx漏洞', risk_type: '主机漏洞', find_date: '2020-05-12 12:00:00', asset_ip: '192.168.1.2', asset_orgin: '政企部', end_date: '2020-05-12 12:00:00'},
        {risk_sno: 'FESX01KFF768', risk_name: 'xxx漏洞', risk_type: '主机漏洞', find_date: '2020-05-12 12:00:00', asset_ip: '192.168.1.2', asset_orgin: '政企部', end_date: '2020-05-12 12:00:00'},
        {risk_sno: 'FESX01KFF768', risk_name: 'xxx漏洞', risk_type: '主机漏洞', find_date: '2020-05-12 12:00:00', asset_ip: '192.168.1.2', asset_orgin: '政企部', end_date: '2020-05-12 12:00:00'}
      ],
      HandleConfig: {
        text_algin: 'center',
        buttonList: [
          {title: '编辑', icon_name: '#iconbianji', size: 'mini', event_name: 'asset_edit', event_args: ''},
          {title: '删除', icon_name: '#iconshanchu', size: 'mini', event_name: 'asset_delete', event_args: ''}
        ]
      },
      loading: true
    }
  },
  methods: {
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs
    },
    asset_edit () {
      alert('资产编辑')
    },
    asset_delete () {
      alert('资产删除')
    },
    search () {
      this.loading = true
      let url = '/task/loadCurrentUserFlawTask'
      this.axios.post(url).then((Response) => {
        const d = Response.data
        let tableData = []
        d.data.dataList.map(function (data, i, a) {
          if (data.TaskFlawVo.flaw !== null) {
            let temp = {}
            temp = {...data.TaskFlawVo.flaw}
            tableData.push(temp)
          }
        })
        this.loading = false
        this.tableData = tableData
      })
    }
  },
  created () {
    this.search()
  },
  watch: {
    EventName (newValue, oldValue) {
      if (newValue !== '') {
        // 通过监控EventName值的变化来执行相应的函数
        // eslint-disable-next-line
        eval('this.' + newValue + "(this.EventArgs)")
      }
      this.EventName = ''
      this.EventArgs = ''
    }
  }
}
</script>
