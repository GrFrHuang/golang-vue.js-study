<template>
  <div class="img-cropper">
    <el-dialog :title="title?title:'预览'" v-model="mShowCropper">
      <div>
        <img :src="mUrl" alt="" ref="image" style="width: 100%">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="confirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
  // 图片裁剪控件
  // 依赖: element-ui的dialog,cropperjs
  // usage:
  // vm.open(url)
  // params: url:原始图片地址
  // event: @selected({previewUrl,file}) : 裁剪选择确定后{预览图片的url,文件对象用于上传}

  import Cropper from 'cropperjs'
  require('../../../static/dist/css/cropper.min.css')

  let cropper = null
  export default{
    props: ['title'],
    data(){
      return {
        mUrl: "", // 文件的url
        mShowCropper: false, // 是否显示
        previewUrl: "", // 左侧预览的url
      }
    },
    components: {},
    methods: {
      updateValue(previewUrl, value){
        this.$emit('selected', {
          previewUrl: previewUrl,
          file: value
        })
      },
      cancel(){
        this.mShowCropper = false
        if (cropper != null) {
          cropper.destroy()
          cropper = null
        }
      },
      confirm(){
        this.mShowCropper = false
        if (cropper == null) {
          throw "error: cropper is null"
        }

        let fileInfo = cropper.extend
        let croppedCanvas = cropper.getCroppedCanvas();
        let previewUrl = croppedCanvas.toDataURL(fileInfo.type);
        croppedCanvas.toBlob(blob => {
          this.updateValue(previewUrl, new File([blob], fileInfo.name))
          cropper.destroy()
          cropper = null
        })
      },
      onChange(event){

      },
      open(url){
        this.mUrl = url
        this.mShowCropper = true
        if (this.mShowCropper && this.mUrl) {
          this.$nextTick(() => {
            if (cropper != null) {
              cropper.destroy()
            }
            cropper = new Cropper(this.$refs.image, {
              aspectRatio: 1,
            });

            cropper.extend = {
              name: "default",
              type: "",
            }
          })
        }
      },
    },
    mounted: function () {

    },
  }
</script>
<style lang="less" rel="stylesheet/less" scoped>

</style>
