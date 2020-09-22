<template>
    <div class = "workbench-header-contianer clearfix">
    	<div class = "header-img" v-if = "title">{{ title || ''}}</div>
    	<div class = "header-title">
    		<p class ="title-desc"><slot name = "desc"></slot></p>
    		<div class = "title-btn"><slot name = "button"></slot></div>
    	</div>
    </div>
</template>

<script>
export default{
    name: 'workbenchHeader',
    props: {
        title: String
    },
    data() {
        return {
        }
    },
    methods: {
    }
}
</script>

<style lang = "scss">
.workbench-header-contianer{
	padding:15px 0;
	.header-img{
		width: 56px;
		height: 56px;
		border-radius: 50%;
		background: #4C7EE9;
		text-align: center;
		line-height: 56px;
		color: #fff;
		font-size: 24px;
		float: left;
	}
	.header-title{
		float: left;
		padding-left: 8px;
		.title-desc{
			font-size: 18px;
			color: #303133;
		}
		.title-btn{
			padding:14px 0px 0px 0px;
			.el-button{
				height: 24px;
				line-height: 22px;
				padding: 0px 10px;
				background: rgba(242,246,252,0.47);
				font-size: 12px;
                color: #4C7EE9;
				border: 1px solid #DCDFE6;
				&+.el-button{
					margin-left: 8px;
				}
			}
		}
	}
}
</style>