<template>
<el-dialog
    :title = "title"
    :visible.sync = "reservationVisible"
    custom-class = "offline-send-message-dailog-container"
    :before-close = "handleCancelBtn"
    width = "1100px">
    <div 
        class = "dailog-content"
        v-loading = "isLoading">
        <div>
            <el-row>
                 <el-col :span = "12">
                    <p class = "workbench-base-item">
                         <label>实际打款人姓名</label>{{ sendMessageObjPro.applicationInfo && sendMessageObjPro.applicationInfo.repCnName || '-'}}
                    </p>
                 </el-col>
                 <el-col :span = "12">
                    <p class = "workbench-base-item">
                        <label>联系人手机号</label>{{ sendMessageObjPro.applicationInfo && sendMessageObjPro.applicationInfo.mobile || '-'}}</p>
                 </el-col>
            </el-row>
            <el-row>
                 <el-col :span = "12">
                    <p class = "workbench-base-item">
                         <label>线下对公还款账户名</label>{{ sendMessageObjPro.smsInfo && sendMessageObjPro.smsInfo.repaymentAccountName || '-'}}
                    </p>
                 </el-col>
                 <el-col :span = "12">
                    <p class = "workbench-base-item">
                        <label>计划还款总金额</label>{{ sendMessageObjPro.applicationInfo && sendMessageObjPro.applicationInfo.amt || '-'}}</p>
                 </el-col>
            </el-row>
            <el-row>
                 <el-col :span = "12"
                    v-if = "sendMessageProsition != 'offline-apply-detail'">
                    <p class = "workbench-base-item">
                         <label>短信状态</label>{{ sendMessageObjPro.smsInfo && sendMessageObjPro.smsInfo.status == 'Y'?'提交成功':(sendMessageObjPro.smsInfo && sendMessageObjPro.smsInfo.status == 'N'?'提交失败':'-')}}
                    </p>
                 </el-col>
                 <el-col :span = "12">
                    <p class = "workbench-base-item">
                        <label>还款意向失效时间</label>{{ sendMessageObjPro.applicationInfo && sendMessageObjPro.applicationInfo.invalidTime || '-'}}</p>
                 </el-col>
            </el-row>
            <el-table
                :data = "sendMessageObjPro.contractList"
                style = "width: 100%">
                <el-table-column
                    prop = "contractDate"
                    label = "申请时间">
                </el-table-column>
                <el-table-column
                    prop = "contractNo"
                    label = "合同号">
                </el-table-column>
                <el-table-column
                    prop = "outstandingBillsAmt"
                    label = "欠款金额">
                </el-table-column>
                <el-table-column
                    prop = "applicationAmt"
                    label = "计划还款金额">
                </el-table-column>
            </el-table>
            <el-form ref = "sendForm" 
                :model = "sendForm" 
                label-width = "80px">
                <el-form-item 
                    label = "短信内容">
                    <el-input type = "textarea" 
                         :disabled = "true"
                         v-model = "sendForm.content"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <span slot = "footer" 
            class = "dialog-footer">
            <el-button 
                 type = "primary" 
                 @click = "handleSubmitSendMessage">重发短信</el-button>
            <el-button 
                 @click = "handleCancelBtn">取 消</el-button>
        </span>
    </div>
</el-dialog>
</template>

<script>

export default {
    name: 'offLineSendMessage',
    props: {
        sendMessageObjPro: Object,
        sendMessageVisible: Boolean,
        sendMessageProsition: String,
        title: String
    },
    data() {
        return {
            reservationVisible: false,
            isLoading: false,
            sendForm: {}
        }
    },
    watch: {
        'sendMessageVisible': {
            handler: function(val, oldVal){
                if(val){
                    this.reservationVisible = true;
                    if(this.sendMessageObjPro && this.sendMessageObjPro.smsInfo && this.sendMessageObjPro.smsInfo.smsCode){
                        this.handleSelectBusinessType(this.sendMessageObjPro.smsInfo.smsCode);
                    }
                    
                }
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        
    },
    created(){
        // this.handleBusinessType();
    },
    methods: {
        handleCancelBtn(){
            this.reservationVisible = false;
            this.$emit('handleChangeVisible', false);
        },
        handleSelectBusinessType(val){
            var self = this;
            
            self.$postRequest('/sms/template/findListByBusinessType',{
                templateCode: val
            }).then(function(res){
                if(res.code == '0'){
                    var tempList = res.result || [];

                    if(tempList.length){
                        var content = tempList[0].contents || '';

                        if(content){
                            if(self.sendMessageObjPro.smsInfo && self.sendMessageObjPro.smsInfo.validDate){

                                content = content.replace('${validDate}', self.sendMessageObjPro.smsInfo.validDate);
                            }

                            if(self.sendMessageObjPro.smsInfo && self.sendMessageObjPro.smsInfo.expirationDate){
                                content = content.replace('${expirationDate}', self.sendMessageObjPro.smsInfo.expirationDate);
                            }
                            

                            if(self.sendMessageObjPro.smsInfo && self.sendMessageObjPro.smsInfo.repaymentAccount){
                                content = content.replace('${repaymentAccount}', self.sendMessageObjPro.smsInfo.repaymentAccount);
                            }

                            if(self.sendMessageObjPro.smsInfo && self.sendMessageObjPro.smsInfo.transferAmount){
                                content = content.replace('${transferAmount}', self.sendMessageObjPro.smsInfo.transferAmount);
                            }
                            
                            if(self.sendMessageObjPro.smsInfo && self.sendMessageObjPro.smsInfo.hotlineNumber){
                                content = content.replace('${hotlineNumber}', self.sendMessageObjPro.smsInfo.hotlineNumber);
                            }

                            self.sendForm = Object.assign({},self.sendForm, {
                                content: content
                            })
                        }
                    }
                }
            })
        },
        handleSubmitSendMessage(){
            var self = this;
            var param = {
                templateCode: self.sendMessageObjPro.smsInfo && self.sendMessageObjPro.smsInfo.smsCode,
                mobile: self.sendMessageObjPro.applicationInfo && self.sendMessageObjPro.applicationInfo.mobileEnc || '',
                parameters: self.sendMessageObjPro.smsInfo && self.sendMessageObjPro.smsInfo.params || '',
                uniqueid: self.sendMessageObjPro.applicationInfo && self.sendMessageObjPro.applicationInfo.uniqueid || '',
                workOrderNumber: '',
                customizedApiUrl: ''
            };

            self.isLoading = true;
            if(this.sendMessageProsition == 'offline-apply-detail'){

                self.$postRequest('/pre/account/proces/or/application/sendMessage',{
                    applicationInfo: {
                        id: self.sendMessageObjPro.applicationInfo && self.sendMessageObjPro.applicationInfo.id || ''
                    },
                    smsInfo: {
                        smsCode: param.templateCode,
                        params: param.parameters
                    }
                }).then(function(res){
                    self.isLoading = false;
                    if(res.code == '0'){
                        self.reservationVisible = false;
                        self.$emit('handleChangeVisible', false);
                        self.$message({
                            showClose: true,
                            message: '短信发送成功！',
                            type: 'success'
                        });
                    }else{
                        self.$message({
                            showClose: true,
                            message: res.message || '请稍后在试！',
                            type: 'warning'
                        });
                    }
                }).catch ( err => {
                    self.isLoading = false;
                    self.$message({
                        showClose: true,
                        message: err.message || '请稍后在试！',
                        type: 'warning'
                    });
                })
            }else{
                self.$postRequest('/sms/send',param).then(function(res){
                    self.isLoading = false;
                    if(res.code == '0'){
                        self.reservationVisible = false;
                        self.$emit('handleChangeVisible', false);
                        self.$message({
                            showClose: true,
                            message: '短信发送成功！',
                            type: 'success'
                        });
                    }else{
                        self.$message({
                            showClose: true,
                            message: res.message || '请稍后在试！',
                            type: 'warning'
                        });
                    }
                }).catch ( err => {
                    self.isLoading = false;
                    self.$message({
                        showClose: true,
                        message: err.message || '请稍后在试！',
                        type: 'warning'
                    });
                })
            }
        }
    }
}
</script>

<style lang = "scss">
.offline-send-message-dailog-container{
    .dailog-content{
        overflow: hidden;
        .dialog-footer{
            margin-top: 20px;
            float: right;
        }
    }
    .workbench-base-item{
        margin-bottom: 10px;
        position: relative;
        padding-right: 10px;
        padding-left: 130px;
        color: #606266;
        overflow: hidden;
        text-overflow: ellipsis;
        label{
            position: absolute;
            top: 0;
            width: 130px;
            color: #909399;
            left: 0;
            font-weight: normal;
        }
    }
    .el-dialog__footer{
        padding-bottom: 50px;
    }
    .el-form{
        margin-top: 18px;
        textarea{
            height: 115px !important;
        }
    }
}
</style>

