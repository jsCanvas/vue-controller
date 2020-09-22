<template>
    <div class = "workbench-title-contianer">
    	<span class = "title-name">{{ title || '' }}</span>
        <p></p>
    </div>
</template>

<script>
export default{
    name: 'workbenchTitle',
    props: {
        title: String
    },
}
</script>

<style lang = "scss">
.workbench-title-contianer{
	position: relative;
	height: 18px;
	padding-top: 8px;
	.title-name{
		color: #303133;
		font-size: 16px;
		position: absolute;
		font-weight: bold;
		background: #fff;
		padding-right: 5px;
		top: 0px;
		left: 0px;
	}
    p{
        height: 1px;
        width: 100%;
        background: #EBEEF5;
    }

}
</style>