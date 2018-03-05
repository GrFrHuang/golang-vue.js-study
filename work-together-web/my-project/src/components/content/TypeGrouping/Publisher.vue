<!--
<template>
	<div class="str_type tab-pane" id="tab_4">
		<div>
			<input style="margin-right: 20px;margin-top: 20px;" class="form-control" type="text" id="addIssueInput" placeholder="添加发行商" />
			<input style="margin-top: 20px;" class="btn btn-default" type="button" id="" value="确认添加" @click="addIssue"/>
		</div>
		&lt;!&ndash;<p>已添加xxx个发行商</p>&ndash;&gt;
		<div class="input_checked" style="margin-top: 20px">
			<input type='checkbox' class='input-checkbox' @click='checkedAll' v-model="allChecked">全选
      <input type="button" value="删除" @click="deleteIssue"/>
      <br/>
			<template v-for='checkb in checkboxData'>
				<input type='checkbox' name='checkboxinput' class='input-checkbox' v-model='checkboxModel' :value='checkb.id'>{{checkb.issue}}
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
      addIssue: function () {
        let body = {
          "issue": $("#addIssueInput").val()
        }
        let post = utils.buildPostParams(body)
        console.log(post)
        let url = '/issue'
        this.$http.post(url, post)
          .then((r) => {
            this.getIssue()
          })
          .catch((err) => {
            console.log(err)
          })
      },
      getIssue: function () {
        let url = '/issue?fields=id%2Cissue'
        this.$http.get(url)
          .then((res) => {
            this.checkboxData = res.body
          })
          .catch((err) => {
            console.log(err)
            context.error = err.data
          })
      },
      deleteIssue: function () {
        let url = '/issue/'
        for(var i = 0; i < this.checkboxModel.length; i++) {
          this.$http.delete(url + this.checkboxModel[i])
            .then((res) => {
              this.getIssue()
            })
        }

		},
    },
		data() {
			return {
				checkboxData: [],
				checkboxModel: [],
				allChecked: false
			}
		},
    mounted:function () {
        this.getIssue()
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
        type:4
      }
    }
  }
</script>
