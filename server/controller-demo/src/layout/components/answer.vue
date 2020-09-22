<template>
	<el-dialog
	    title = "来电提示"
	    :visible.sync = "dialogVisible"
	    width = "400px"
        class = "handle-answer-dialog"
        :close-on-click-modal="false"
	    :before-close = "handleRejectInboundBtn">
        <div class = "transfer-dailog-container">
            <p class = "content">客户来电话啦,请您接听</p>
        </div>
		<span slot = "footer" class = "dialog-footer">
		    <el-button
                class = "refuse-btn" 
                type = "primary"
                @click = "handleRejectInboundBtn">拒绝</el-button>
		    <el-button 
                type = "primary" 
                @click = "handleAnswerInboundCall">接听</el-button>
		</span>
        <div class = "audio-container">
            <audio id = "inbound-id" ref = "audioInbound">
                <source src = "../../audio/inbound.wav">
            </audio>
        </div>
	</el-dialog>
</template>

<script>
export default{
	name: 'Transfer',
	props: {
        answerPro: Object
    },
    data(){
    	return {
    		dialogVisible: true,
            options: [],
            teamList: []
    	}
    },
    watch: {
        'answerPro': {
            handler: function(val, oldVal){
                var self = this;

                self.dialogVisible = val.visiblePro;

                if(val.visiblePro){
                    self.$nextTick(function(){
                        self.handlePlayRingAudio();
                    })
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        handlePlayRingAudio(){
            this.$refs.audioInbound.play();
        },
        handleRejectInboundBtn(){
            this.dialogVisible = false;
            this.$store.commit('user/SET_DAILOG_STATUS',{
                isPop: false,
                popType: ''
            });
            window.globalPublic.rejectInboundCall();
        },
        handleAnswerInboundCall(){
            this.dialogVisible = false;
            this.$store.commit('user/SET_DAILOG_STATUS',{
                isPop: false,
                popType: ''
            });
            window.globalPublic.answerInboundCall();
        }
    }
}
</script>
<style lang = "scss">
.handle-answer-dialog{
    .content{
        font-size: 18px;
        font-weight: bold;
        color: #4c7ee9;
    }
    .el-dialog__body{
        padding: 0px 24px !important;
    }
    .dialog-footer{
        text-align: center;
        .refuse-btn{
            background-color: #f56c6c;
            border: 1px solid #f56c6c;
        }
    }
}
</style>

