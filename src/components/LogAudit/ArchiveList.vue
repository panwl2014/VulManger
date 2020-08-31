<template>
  <div>
    <con-title :name="titlename"></con-title>
    <el-card shadow="never" class="mr-1 mt-1">
      <asset-table
        border
        pagination
        :pageTotal="pageTotal"
        :tableTitle="tableTitle"
        :tableData="tableData"
        :HandleConfig="HandleConfig"
        @MonitorEvent="monitor_event">
    </asset-table>
    </el-card>
  </div>
</template>

<script>
import ConTitle from '@/components/components/ConTitle'
import AssetTable from '@/components/components/AssetTable'

export default {
  name: 'ArchiveList',
  components: {
    ConTitle,
    AssetTable
  },
  data () {
    return {
      titlename: '归档列表',
      pageTotal: 0,
      EventName: '',
      EventArgs: '',
      tableTitle: [
        {key: 'pigeonholeTime', label: '归档时间', is_show: true, text_algin: 'center'},
        {key: 'fileName', label: '文件名', is_show: true, text_algin: 'center'}
      ],
      tableData: [],
      HandleConfig: {
        text_algin: 'center',
        buttonList: [
          {title: '下载', icon_name: '#iconxiazai', size: 'mini', event_name: 'download', event_args: ''}
        ]
      }
    }
  },
  methods: {
    monitor_event (EventName, EventArgs) {
      this.EventName = EventName
      // EventArgs => 包含当前表格row数据、还有相应的arg
      this.EventArgs = EventArgs
    },
    download (row) {
      window.location.href = row[0].filePath
    },
    search () {
      let url = '/logPigeonhole/loadAll'
      this.axios.post(url).then((Response) => {
        this.pageTotal = Response.data.count
        this.tableData = [...Response.data.data]
      })
    }
  },
  created() {
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
