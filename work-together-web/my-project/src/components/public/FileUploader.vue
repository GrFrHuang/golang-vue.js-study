<template>
  <div class="upload">
    <div class="uploader">
      <div v-if="status!='loading'">
        <input type="file" @change="updateValue($event)">
        <div class="display" :class="status" :disabled="readonly">
          <span v-if="status=='default'" class="fa fa-plus"></span>
          <span v-if="status=='success'" class="fa fa-check"></span>
          <span v-if="status=='error'" class="fa fa-frown-o"></span>
          <span class="file-info">{{fileInfo}}</span>
          <span class="msg">{{msg}}</span>
        </div>
        <div v-if="status!='default'" class="uploader-close fa fa-times" @click="remove"></div>
      </div>
      <div v-else class="display" :class="status">
        <span class="fa fa-spinner"></span>
        <span class="file-info">正在上传, 请稍后</span>
      </div>
    </div>

    <a v-if="currentValue" :href="downloadUrl" target="_blank" class="preview">
      <span class="fa fa-download"></span>
    </a>
  </div>
</template>
<script type="text/ecmascript-6">
  let sDefault = "default"
  let sSuccess = "success"
  let sError = "error"
  let sLoading = "loading"

  export default{
    props: ['value', 'work_type', 'readonly'],
    data(){
      return {
        currentValue: null,

        msg: '点击上传文件',
        status: sDefault,
        prog: 0, // 进度
        fileInfo: "", // 文件信息
        downloadUrl: "", // 文件下载(预览)链接

        xtoken: "",
      }
    },
    components: {},
    methods: {
      updateValue(el){
        if (el.target.files == null || el.target.files.length == 0) {
          this.setCurrValue(0)
          return
        }
        let fName = el.target.value + ""
        this.msg = fName.substr(fName.lastIndexOf("\\") + 1)
        let file = el.target.files[0]

//        console.log(this.work_type)
        if (this.work_type != undefined && !file.type.toString().startsWith(this.work_type)) {
          this.$message({
            type: 'warning',
            message: '只能上传图片'
          })
          let error = "格式不合法"
          this.setCurrValue(0, error)
        } else {
//          console.log("失败")
          el.target.value = null

          let oData = new FormData();
          oData.append("asset_name", file);
          let oReq = new XMLHttpRequest();
          let uploadUrl = ENV.UPLOAD_HOST_URL + "/asset/upload"
          oReq.open("POST", uploadUrl, true);
          if (this.xtoken) {
            oReq.setRequestHeader("Authorization", this.xtoken);
          }
          this.status = sDefault

          oReq.onprogress = (e) => {
            this.status = sLoading
            //进度信息是否可用
            if (e.lengthComputable) {
              let p = e.loaded / e.total * 100
              this.$emit('progress', p)
              this.prog = p
            }
          }
          oReq.onload = () => {
            if (oReq.status !== 200) {
              let error = oReq.responseText.replace(new RegExp(/(")/g), "")
              this.setCurrValue(0, error)
            } else {
              let data = JSON.parse(oReq.response)
              let id = data.id
              this.setCurrValue(id)
            }
          }
          oReq.send(oData);
        }


      },
      updateView(error = null){
        if (error) {
          this.msg = "点击重新上传文件"
          this.fileInfo = error
          this.status = sError
          this.downloadUrl = ""

          return
        }

        if (this.currentValue) {
          this.msg = "点击更换文件"
          this.fileInfo = ""

          this.$http.get("/asset/name/" + this.currentValue)
            .then(({data}) => {
              this.fileInfo = data
            })
//          this.fileInfo = "文件编号: YUND-" + this.currentValue
          this.status = sSuccess
          this.downloadUrl = ENV.UPLOAD_HOST_URL + "/asset/" + this.currentValue + "?_token=" + this.xtoken
        } else {
          this.msg = "点击上传文件"
          this.status = sDefault
          this.prog = 0
          this.fileInfo = ""
          this.downloadUrl = ""
        }
      },
      setCurrValue(v, error = null){
//        console.log("setCurrValue", v)
        this.currentValue = v
        this.$emit('input', v)

        if (error) {
          this.$emit('error', error)
        }
        this.updateView(error)
      },
      remove(){
        this.setCurrValue(0)
      }
    },
    mounted: function () {
      this.xtoken = sessionStorage.getItem("token")

      this.setCurrValue(this.value)
    },
    watch: {
      value(n, o){
        // 这里的变化可能是由于emit了值,然后值改了,然后又通知变化
        if (n === this.currentValue) {
          return
        }
        this.setCurrValue(n)
      }
    }
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>
  .uploader {
    min-width: 50px;
    position: relative;
    cursor: pointer;
    display: inline-block;
    input {
      position: absolute;
      padding: 0;
      margin: 0;
      opacity: 0;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      cursor: pointer;
    }

    .uploader-close {
      position: absolute;
      width: 18px;
      height: 18px;
      right: -5px;
      top: -5px;
      border-radius: 50%;
      background-color: #d63b3f;
      color: #fff;
      text-align: center;
      line-height: 18px;
      cursor: pointer;
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }

    .display {
      display: inline-block;
      width: 100%;
      padding: 8px 12px;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #d2d6de;
      text-align: center;
      color: #666;
      &.success {
        background-color: #00a65a;
        border: 0;
        color: #f4f4f4;
      }
      &.error {
        background-color: #a63030;
        border: 0;
        color: #f4f4f4;
      }
      &.loading {
        background-color: #3c6fa6;
        border: 0;
        color: #f4f4f4;
      }
      .msg {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &[disabled] {
        opacity: 0.5;
        cursor: default;
      }
    }
  }

  .preview {
    display: inline-block;
    padding: 8px 6px;
    text-align: center;
    vertical-align: top;
    border-radius: 4px;
    background-color: #e1e1e1;
    color: #666;

    &:hover, &:active {
      color: #111;
    }
  }
</style>
