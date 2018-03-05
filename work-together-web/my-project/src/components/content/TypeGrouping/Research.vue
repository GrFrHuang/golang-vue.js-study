<!--
<template>
	<div class="str_type tab-pane" id="tab_3">
		<div>
			<input style="margin-right: 20px;margin-top: 20px;" class="form-control" type="text" id="addDevelopmentInput" placeholder="请输入研发商名称" />
			<input style="margin-top: 20px;" class="btn btn-default" type="button" id="" value="确认添加"  @click="addDevelopment"/>
		</div>
		&lt;!&ndash;<p>已添加xxx个研发商</p>&ndash;&gt;
		<div class="input_checked" style="margin-top: 20px">
			<input type='checkbox' class='input-checkbox' @click='checkedAll' v-model="allChecked">全选
      <input type="button" value="删除" @click="deleteDevelopment"/>

      <br />
			<template v-for='checkb in checkboxData'>
				<input type='checkbox' name='checkboxinput' class='input-checkbox' v-model='checkboxModel' :value='checkb.id'>{{checkb.development}}
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
      addDevelopment: function () {
        let body = {
          development: $("#addDevelopmentInput").val()
        }
        let post = utils.buildPostParams(body)
        let url = '/development/'
        this.$http.post(url, post)
          .then((r) => {
            this.getDevelopment()
          })
          .catch((err) => {
            console.log(err)
          })
      },
      getDevelopment: function () {
        let url = '/development?fields=id%2Cdevelopment'
        this.$http.get(url)
          .then((res) => {
            this.checkboxData = res.body
          })
          .catch((err) => {
            console.log(err)
            context.error = err.data
          })
      },
      deleteDevelopment: function () {
        let url = '/development/'
        for(var i = 0; i < this.checkboxModel.length; i++) {
          this.$http.delete(url + this.checkboxModel[i])
            .then((res) => {
              this.getDevelopment()
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
      this.getDevelopment()
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
        type:3
      }
    }
  }
</script>
