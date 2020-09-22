<template>
	<el-button
         @click = "handleCreateWorksheet" 
         type = "primary"
         icon = "el-icon-news" 
         plain>创建工单</el-button>
</template>

<script>

export default{
	name: 'createWorksheet',
	props: {
        taskNodeId: Number,
        taskNo: String,
        uniqueidPro: String
    },
	data(){
		return {}
	},
	computed: {
		uniqueid(){
            return this.$route.query.uniqueid || this.$route.params.id;
        },
    },
	methods: {
		handleCreateWorksheet(){
			var self = this;

			self.$store.dispatch('worksheet/getWorkOrderNumber',{
                workOrderType: 'P'
            }).then(function(res) {
            	// self.$postRequest('/task/operate/save',{
	            //     taskNo: self.taskNo,
	            //     description: '新建工单',
	            //     taskNodeId: self.taskNodeId,
	            //     operateTypeCode: 'CREATE_ORDER',
	            // }).then(function(res){
	                
	            // }).catch( err=> {
	            // })
                self.$router.push({
                   path: '/worksheet-manager/create/'+(res.result.workOrderNumber || '')+'?uniqueid='+(self.uniqueid || self.uniqueidPro || '')
                })
                
            })		
		}
	}
}
</script>

<style lang = "scss">
.workbench-components-callout{
	display: inline-block;
	width: 16px;
	height: 16px;
	margin-left: 16px;
	img{
		width: 100%;
		cursor: pointer;
	}
}
</style>