<!--
<template>
	<div class="str_type tab-pane" id="tab_2">
		<div>
			<input style="margin-right: 20px;margin-top: 20px;" class="form-control" type="text" id="addCooperationInput" placeholder="请输入合作方式" />
			<input style="margin-top: 20px;" class="btn btn-default" type="button" id="" value="确认添加" @click="addCooperation"/>
		</div>
		&lt;!&ndash;<p>已添加xxx个合作方式</p>&ndash;&gt;
		<div class="input_checked" style="margin-top: 20px">
			<input type='checkbox' class='input-checkbox' @click='checkedAll' v-model="allChecked">全选
      <input type="button" value="删除" @click="deleteCooperation"/>
      <br />
			<template v-for='checkb in checkboxData'>
				<input type='checkbox' name='checkboxinput' class='input-checkbox' v-model='checkboxModel' :value='checkb.id'>{{checkb.cooperation}}
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
      addCooperation: function () {
        let body = {
          cooperation: $("#addCooperationInput").val()
        }
        let post = utils.buildPostParams(body)
        console.log(post)

        let url = '/cooperation/'
        this.$http.post(url, post)
          .then((r) => {
          this.getCooperation()
        })
        .catch((err) => {
          console.log(err)
        })
      },
      getCooperation: function () {
        let url = '/cooperation?fields=id%2Ccooperation'
        this.$http.get(url)
          .then((res) => {
          this.checkboxData = res.body
        })
        .catch((err) => {
          console.log(err)
          context.error = err.data
        })
      },
      deleteCooperation: function () {
        let url = '/cooperation/'

        for(var i = 0; i < this.checkboxModel.length; i++) {
          this.$http.delete(url + this.checkboxModel[i])
            .then((res) => {
            this.getCooperation()
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
      this.getCooperation()
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
        type:2
      }
    }
  }
</script>
