<template>
	<div>
        <!-- 三方通话相关弹窗 -->
        <el-dialog
            title="三方通话转接"
            :visible="threeBDialogVisible?true:false"
            width="30%"
            :close-on-click-modal="false"
            :before-close="threeBHandleClose">
            <span>正在进行咨询转接通话。</span>
            <span slot="footer" class="dialog-footer">
                <el-button :disabled="threeBDialogVisible&&!threeBDialogVisible.isShihu" type="primary" @click="handelCloseB(0)">拾 回</el-button>
                <el-button :disabled="threeBDialogVisible&&!threeBDialogVisible.cancelThree" type="danger" @click="handelCloseB(1)">取消保持</el-button>
                <el-button :disabled="threeBDialogVisible&&!threeBDialogVisible.threeStart" type="primary" @click="handelCloseB(2)">三方通话</el-button>
            </span>
            </el-dialog>

            <el-dialog
            title="三方通话转接"
            :close-on-click-modal="false"
            :visible="threeADialogVisible?true:false"
            width="30%"
            :before-close="threeAHandleClose">
            <span>{{threeADialogVisible}} 发来咨询转接，请您接听。</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="danger" @click="handelCloseA(0)">拒 绝</el-button>
                <el-button type="primary" @click="handelCloseA(1)">接 听</el-button>
            </span>
            </el-dialog>

            <el-dialog
            title="三方通话转接"
            :close-on-click-modal="false"
            :visible="threeAAutoDialogVisible?true:false"
            width="30%"
            :before-close="threeAAutoHandleClose">
            <span>{{threeAAutoDialogVisible}} 发来咨询转接。</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handelCloseAutoA(1)">确 认</el-button>
            </span>
            </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default{
	name: 'ThreeDiglog',
	props: {
        transferPro: Object
    },
    computed:{
        ...mapGetters([
            'threeBDialogVisible',
            'threeADialogVisible',
            'threeAAutoDialogVisible',
        ]),
    },
    data(){
    	return {
        }
    },
    watch: {
    },
    methods: {
        //三方通话转接咨询B坐席弹窗关闭
        threeBHandleClose(){
            this.$store.commit('user/CLOSE_THREEBDIALOG')
        },
        handelCloseB(status){
            if(status == 2){
                window.globalPublic.completeThreeConference();
            }else if(status == 1){
                if(!this.threeBDialogVisible.threeOk){
                    setTimeout(()=>{
                            window.globalPublic.unholdCall();
                            
                        },1000);
                //     // window.globalPublic.unholdCall();
                //     console.log("******ncrm调用icc恢复对象unholdCall开始：", new Date());
                //     let resgol = globalPublic.instance.unholdCall(globalPublic.fsmId);
                //     console.log(">>调用icc方法unholdCall入参fsmId："+globalPublic.fsmId+"返回值："+resgol);
                //     if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.SUCCESS){
                //         globalPublic.customerHoldFlag = false;
                //         globalPublic.currentCallInfoThreePartyServicesAgentA = null;
                //     }else if (resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.NOT_ALLOWED){
                //         tips = '当前通话不允许恢复保持！';
                //     }else if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.NO_ACTIVE_CALL || resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.MANUAL_CALL_NOT_ACTIVE){
                //         tips = '通话已挂断无法恢复保持通话！';
                //     }else if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.CALL_ALREADY_ACTIVE){
                //         tips = '当前通话已经是通话中，请忽略！';
                //     }else {
                //         tips = '调用icc恢复保持返回其他值：[' + resgol + ']，请联系icc团队处理！';
                //     }
                }else{
                    let res =  window.globalPublic.cancelConsultTransferCall();
                    if(res == 'SUCCESS'){
                        setTimeout(()=>{
                            window.globalPublic.unholdCall();
                            
                        },1000);
                    // console.log("******ncrm调用icc恢复对象unholdCall开始：", new Date());
                    // let resgol = globalPublic.instance.unholdCall(globalPublic.fsmId);
                    // console.log(">>调用icc方法unholdCall入参fsmId："+globalPublic.fsmId+"返回值："+resgol);
                    // if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.SUCCESS){
                    //     globalPublic.customerHoldFlag = false;
                    //     globalPublic.currentCallInfoThreePartyServicesAgentA = null;
                    // }else if (resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.NOT_ALLOWED){
                    //     tips = '当前通话不允许恢复保持！';
                    // }else if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.NO_ACTIVE_CALL || resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.MANUAL_CALL_NOT_ACTIVE){
                    //     tips = '通话已挂断无法恢复保持通话！';
                    // }else if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.CALL_ALREADY_ACTIVE){
                    //     tips = '当前通话已经是通话中，请忽略！';
                    // }else {
                    //     tips = '调用icc恢复保持返回其他值：[' + resgol + ']，请联系icc团队处理！';
                    }
                    }
                // }
            }else{
                // if(this.threeBDialogVisible.threeOk){
                //     // window.globalPublic.unholdCall();
                //     console.log("******ncrm调用icc恢复对象unholdCall开始：", new Date());
                //     let resgol = globalPublic.instance.unholdCall(globalPublic.fsmId);
                //     console.log(">>调用icc方法unholdCall入参fsmId："+globalPublic.fsmId+"返回值："+resgol);
                //     if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.SUCCESS){
                //         globalPublic.customerHoldFlag = false;
                //         globalPublic.currentCallInfoThreePartyServicesAgentA = null;
                //     }else if (resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.NOT_ALLOWED){
                //         tips = '当前通话不允许恢复保持！';
                //     }else if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.NO_ACTIVE_CALL || resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.MANUAL_CALL_NOT_ACTIVE){
                //         tips = '通话已挂断无法恢复保持通话！';
                //     }else if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.CALL_ALREADY_ACTIVE){
                //         tips = '当前通话已经是通话中，请忽略！';
                //     }else {
                //         tips = '调用icc恢复保持返回其他值：[' + resgol + ']，请联系icc团队处理！';
                //     }
                // }else{
                    let res = window.globalPublic.cancelConsultTransferCall();
                    if(res == 'SUCCESS'){
                        setTimeout(()=>{
                            window.globalPublic.unholdCall();
                        },1000);
                    //     console.log("******ncrm调用icc恢复对象unholdCall开始：", new Date());
                    // let resgol = globalPublic.instance.unholdCall(globalPublic.fsmId);
                    // console.log(">>调用icc方法unholdCall入参fsmId："+globalPublic.fsmId+"返回值："+resgol);
                    // if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.SUCCESS){
                    //     globalPublic.customerHoldFlag = false;
                    //     globalPublic.currentCallInfoThreePartyServicesAgentA = null;
                    // }else if (resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.NOT_ALLOWED){
                    //     tips = '当前通话不允许恢复保持！';
                    // }else if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.NO_ACTIVE_CALL || resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.MANUAL_CALL_NOT_ACTIVE){
                    //     tips = '通话已挂断无法恢复保持通话！';
                    // }else if(resgol == globalPublic.Constants.STATUS_CODES.UNHOLD_CALL.CALL_ALREADY_ACTIVE){
                    //     tips = '当前通话已经是通话中，请忽略！';
                    // }else {
                    //     tips = '调用icc恢复保持返回其他值：[' + resgol + ']，请联系icc团队处理！';
                    // }
                    }
                // }
                
            }
            this.$store.commit('user/CLOSE_THREEBDIALOG')
        },
        handelCloseA(ok){
            if(ok){
                window.globalPublic.answerInboundCall();
            }else{
                window.globalPublic.rejectInboundCall();
            }
            this.$store.commit('user/CLOSE_THREEADIALOG')
        },
        //三方通话转接咨询A坐席弹窗关闭
        threeAHandleClose(){
            this.$store.commit('user/CLOSE_THREEADIALOG')
        },
        handelCloseAutoA(){
            this.$store.commit('user/CLOSE_THREEAAUTODIALOG')
        },
        threeAAutoHandleClose(){
            this.$store.commit('user/CLOSE_THREEAAUTODIALOG')
        },
    }
}
</script>
<style lang = "scss">
.transfer-dailog-container{
    .el-radio-group{
        .el-radio{
            margin-bottom: 10px;
        }
    }
}
</style>





