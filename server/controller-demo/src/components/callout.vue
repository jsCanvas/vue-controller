<template>
    <div class = "workbench-components-callout"
        @click = "handleCallOutBnt">
    	<img src = "../assets/phone-icon.png">
    </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default{
	name: 'callOut',
	props: {
        mobileEnc: String
    },
	data(){
		return {}
	},
	computed: {
        ...mapGetters([
            'userDailogStatus'
        ]),
    },
	methods: {
		handleCallOutBnt(){
			if(!this.mobileEnc){
				this.$message({
					showClose: true,
                    message: '没有输入需要外呼的手机号！',
                    type: 'warning'
                });
				return false;
			}

			if(this.userDailogStatus.logMessage){
				if(globalPublic.seatState == '外呼'){
					var mobile = this.utils.decrypt(this.mobileEnc);
					console.log("调用icc拨打makeCall开始:电话", mobile, "时间：",new Date());

					try {
	                    if(globalPublic.statusFlag == "NOT_ACTIVE" || globalPublic.statusFlag == null){
	                        var res = globalPublic.instance.makeCall(mobile);
	                        console.log(">>调用icc方法makeCall返回值："+res);
	                    } else {
	                        this.$message({
	                        	showClose: true,
	                            message: '当前正在通话中，请挂断后再拨打！',
	                            type: 'warning'
	                        })
	                        return false;
	                    }
	                } catch (e) {
	                    this.$message({
	                    	showClose: true,
	                        message: '调用icc拨打功能异常，请稍后再试！',
	                        type: 'warning'
	                    })
	                    console.log("******ncrm调用icc拨打makeCall异常：", e, new Date());
	                    return false;
	                }
				}else{
					this.$message({
						showClose: true,
	                    message: '请先切入外呼状态，在进行电话外呼！',
	                    type: 'warning'
	                });
				}
				console.log("++++++++++++++++== 用户已签入！");
			}else{
				this.$message({
					showClose: true,
                    message: '请先签入用户，在进行电话外呼操作！',
                    type: 'warning'
                });
			}
			
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