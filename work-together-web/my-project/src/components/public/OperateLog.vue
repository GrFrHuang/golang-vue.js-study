<template>
  <div class="operate-box">
    <div class="item" v-for="item in items">
      <span v-html=" (item.user?item.user.nickname:'') +' '+ item.content" class="item-content"></span>
      <span class="item-time">{{ item.create_time | stampToTimeFull }}</span>
    </div>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="pageInfo.currPage"
      :page-size="pageInfo.limit"
      layout="prev, pager, next, jumper, total"
      :total="pageInfo.total">
    </el-pagination>
  </div>

</template>
<script type="text/ecmascript-6">
  export default{
    name: 'operate_log',
    props: [
      'page',
      'action',
      'dataId',
      'keyLabel', // {'Desc':'备注','Data':['数据',()=>'null']}
      'rand', // 改变次值用于刷新数据
    ],
    computed: {
      items(){
        let data = _.cloneDeep(this.originItems)

        let temp = []
        if (!this.keyLabel) {
          return []
        }

        for (let i in data) {
          let item = data[i]

          let content = JSON.parse(item.content)
          if (!content) {
            continue
          }

          let neww = content.new || {}
          let old = content.old || {}
          let allKey = {}

          for (let k in neww) {
            allKey[k] = false
          }
          for (let k in old) {
            allKey[k] = false
          }
          let contentTest = ""
          for (let k in allKey) {
            let newValue = neww[k]
            let oldValue = old[k]

            if (item.action === '删') {
              newValue = oldValue
            }

            let label = this.keyLabel[k]

            let key, value
            if (label) {
              if (Array.isArray(label)) {
                key = label[0]
                value = label[1](newValue)
              } else {
                key = label
                value = newValue
              }
              switch (item.action) {
                case '增':
                  if (value === -10086) {
                    break
                  }
                  if (!contentTest) {
                    contentTest = "创建了条目 "
                  }
                  contentTest += key + "为 <span >' " + value + " '</span> , "
                  break
                case '改':
                  // if (!contentTest) {
                  //   contentTest = "将"
                  // }
                  if (value === -10086) {
                    contentTest += "修改了" + key + " , "
                  } else {
                    contentTest += key + "改为 ' " + value + " ' , "
                  }
                  break
                case '删':
                  if (value === -10086) {
                    break
                  }
                  if (!contentTest) {
                    contentTest = "删除了条目 "
                  }
                  contentTest += key + "为 <span >' " + value + " '</span> , "
                  break
              }
            }
          }
          if (contentTest.endsWith(", ")) {
            contentTest = contentTest.substr(0, contentTest.length - 2)
          }
          if (contentTest.length === 1) {
            continue
          }
          item.content = contentTest
          temp.push(item)
        }
        return temp
      },
    },
    data(){
      return {
        pageInfo: {currPage: 1, limit: 6, total: 0},
        originItems: []
      }
    },
    methods: {
      handleCurrentChange(currPage){
        this.pageInfo.currPage = currPage
        this.load()
      },
      load(){
        let url = "/operatelog"
        let query = []
        if (this.page) {
          query.push("page:" + this.page)
        }
        if (this.action) {
          query.push("action:" + this.action)
        }
        if (this.dataId) {
          query.push("data_id:" + this.dataId)
        }

        url = url + "?" + util.buildGetParams({
            'offset|page': this.pageInfo,
            'query|query': query,
          }) + "&sortby=id&order=desc"

        this.$http.get(url).then(({data}) => {
          this.originItems = data.data
          this.pageInfo.total = data.total
        })
      }

    },
    watch: {
      rand(){
        this.handleCurrentChange(1)
      }
    },
    mounted() {
      this.load()
    },
  }
</script>

<style lang="less" rel="stylesheet/less" scoped>
  .operate-box {
    border: 1px solid #ccc;
    padding: 6px 12px;
  }

  .item {
    position: relative;
    color: #A6A6A6;
    font-size: 13px;
    margin: 5px 0;
    .item-content {
      padding: 0 130px 0 0;
      display: inline-block;
    }
    .item-time {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
</style>
