<!--
<template>
	<div class="str_type tab-pane" id="tab_7">
		<div>
			<input style="margin-right: 20px;margin-top: 20px;" class="form-control" type="text" id="addSdkStatusInput" placeholder="请输入SDK接入状态" />
			<input style="margin-top: 20px;" class="btn btn-default" type="button" id="" value="确认添加" @click="addSdkStatus"/>
		</div>
		&lt;!&ndash;<p>已添加xxx个SDK接入状态</p>&ndash;&gt;
		<div class="input_checked" style="margin-top: 20px">
			<input type='checkbox' class='input-checkbox' @click='checkedAll' v-model="allChecked">全选
      <input type="button" value="删除" @click="deleteSdkStatus"/>
      <br />
			<template v-for='checkb in checkboxData'>
				<input type='checkbox' name='checkboxinput' class='input-checkbox' v-model='checkboxModel' :value='checkb.id'>{{checkb.SDKStatus}}
			</template>
		</div>
	</div>
</template>
<style>
	.input_checked{
		border: 1px solid #000;
		width: 50%;
		padding: 10px;
	}
	.input_checked>input{
		margin: 15px 0;
		margin-left: 41px;
	}
	.input_checked>input:first-child,.input_checked>input:nth-child(3){
		margin-left: 41px;
	}
	.str_type{
		margin-left: 80px ;
	}
	.str_type>p{
		padding:20px 0 ;
	}
</style>
<script type="text/javascript">
  import utils from '../../../publicjs/utils'
	export default {
		components: {},
		props: {},
		methods: {
			checkedAll: function() {
				var _this = this;
				console.log(_this.checkboxModel);
				if(this.allChecked) {
					_this.checkboxModel = [];

				} else {
					console.log(this.checked);
					_this.checkboxModel = [];
					_this.checkboxData.forEach(function(item) {
						_this.checkboxModel.push(item.id);
					});
				}
			},
      addSdkStatus: function () {
        let body = {
            "SDKStatus": $("#addSdkStatusInput").val()
        }
        let post = utils.buildPostParams(body)
        let url = '/sdk'
        this.$http.post(url, post)
          .then((r) => {
          this.getSdkStatus()
          })
        .catch((err) => {
          console.log(err)
        })
      },
      getSdkStatus: function () {
        let url = '/sdk?fields=id%2CSDKStatus'
        this.$http.get(url)
          .then((res) => {
          this.checkboxData = res.body
        console.log(res.body)
        })
        .catch((err) => {
          console.log(err)
          context.error = err.data
        })
      },
      deleteSdkStatus: function () {
        let url = '/sdk/'
        for(var i = 0; i < this.checkboxModel.length; i++) {
          this.$http.delete(url + this.checkboxModel[i])
            .then((res) => {
            this.getSdkStatus()
          })
        }
      }

		},
		data() {
			return {
				checkboxData: [],
				checkboxModel: [],
				allChecked: false
			}
		},
    mounted:function () {
      this.getSdkStatus()
    }
	}
</script>
-->
<template>
  <types :type="type"></types>
</template>
<script>
  import types from './Types'
  export default {
    components: {
      types
    },
    data () {
      return {
        type:7
      }
    }
  }
</script>
