<template>
<el-dialog
    title = "发送短信"
    :visible.sync = "dialogVisible"
    width = "660px"
    :modal= false
    class = "send-message-dailog"
    :close-on-click-modal = false
    :close-on-press-escape = false
    :before-close = "handleClose">
    <el-row>
        <el-col :span = "18">
            <el-form 
                :model = "senMessageForm" 
                :rules = "senMessageRules" 
                ref = "senMessageForm" 
                size = "small"
                label-width = "120px" 
                class = "send-message-form">
                <el-form-item 
                    label = "分类" 
                    prop = "businessType">
                    <el-select 
                        v-model = "senMessageForm.businessType" 
                        @change = "handleSelectBusinessTypeChange"
                        :disabled = "!!sendMessagePro.templateCode" 
                        placeholder = "请选择活动区域">
                        <el-option label = "全部" value = ""></el-option>
                        <el-option
                             v-for = "(item,index) in smsTypeList"
                             :key = "'send-message-type-key-'+index" 
                             :label = "item.dataValue" 
                             :value = "item.dataKey"/>
                    </el-select>
                </el-form-item>
                <el-form-item 
                    label = "短信模板名称" 
                    prop = "smsTemplateCode">
                    <el-select 
                        :disabled = "!!sendMessagePro.templateCode" 
                        v-model = "senMessageForm.smsTemplateCode" 
                        @change = "handleSmsTemplateCode"
                        placeholder = "请选择活动区域">
                        <el-option
                             v-for = "(item,index) in smsTempList"
                             :key = "'send-message-temp-key-'+index" 
                             :label = "item.name" 
                             :value = "item.templateCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item 
                    label = "短信内容" 
                    prop = "content">
                    <el-input
                         :disabled = "!!sendMessagePro.templateCode" 
                         type = "textarea" 
                         v-model = "senMessageForm.content"></el-input>
                </el-form-item>
                <el-form-item 
                    label = "手机号码" 
                    prop = "mobile">
                    <el-input
                         :disabled = "sendMessagePro.canchangephoneflag != 1" 
                         v-model = "senMessageForm.mobile"></el-input>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
    <span slot = "footer" class = "dialog-footer">
        <el-button 
            size = "small"
            @click = "dialogVisible = false"
            plain>取 消</el-button>
        <el-button 
            type = "primary"
            size = "small"
            @click = "handleSendMessageSubmit">发送</el-button>
    </span>
</el-dialog>
</template>

<script>

export default {
    name: 'sendMessage',
    props: {
        sendMessagePro: Object
    },
    components: {
    },
    data() {
        var validateMobile = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入手机号'));
            } else if(!this.utils.phoneReg.test(value)) {
                if(this.sendMessagePro.mobile && this.sendMessagePro.mobile.slice(-3) == value.slice(-3)){
                    this.senMessageForm = Object.assign({}, this.senMessageForm, {
                        mobileEnc: this.sendMessagePro.mobileEnc,
                        mobile: value
                    })
                    callback();
                }else{
                    callback(new Error('请输入正确的手机号码！'));
                }
            }else{
                this.senMessageForm = Object.assign({}, this.senMessageForm, {
                     mobileEnc: this.utils.encrypt(value),
                     mobile: value
                })
                callback();
            }
        }

        return {
            dialogVisible: false,
            smsTypeList: [],
            smsTempList: [],
            senMessageForm: {
                businessType: '',
                smsTemplateCode: '',
                mobile: '',
                mobileEnc: '',
                content: ''
            },
            senMessageRules: {
                smsTemplateCode: [{ 
                    required: true, 
                    message: '当前短信模板名称的短信内容为空，请联系管理员!', 
                    trigger: 'blur'}],
                mobile: [{ 
                    required: true, 
                    validator: validateMobile, 
                    trigger: 'blur'}],
                content: [{ 
                    required: true, 
                    message: '请输入模板内容', 
                    trigger: 'blur'}]
            }
        }
    },
    watch: {
        'sendMessagePro': {
            handler: function(val, oldVal){
                var self = this;
                
                if(val.visiblePro){
                    val = JSON.parse(JSON.stringify(val));

                    if(val.mobileEnc){
                        val.mobile = this.utils.decrypt(val.mobileEnc);
                    }
                    
                    this.senMessageForm = Object.assign({}, this.senMessageForm,{
                        mobile:val.mobile ? this.utils.mobileDesensitization(val.mobile) : '' ,
                        mobileEnc: val.mobileEnc || '',
                    })

                    if(val.strategyRule && val.productCode){
                        this.handleProductStrategy();
                    }

                    this.dialogVisible = val.visiblePro;
                    this.handleBusinessType();

                    if(val.templateCode){
                        this.handleSelectBusinessTypeByTempCode();
                    }else{
                        this.handleSelectBusinessTypeChange('');
                    }
                    this.$nextTick(function(){
                        self.$refs['senMessageForm'].resetFields();
                    })
                    //this.$refs['senMessageForm'].resetFields();
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
        handleBusinessType(){
            var self = this;

            self.$store.dispatch('common/dataDictionary',{
                dataType: 'sms.template.business.type'
            }).then(function(data) {
                self.smsTypeList = Object.assign([],self.smsTypeList, data.result || []);
            })
        },
        handleProductStrategy(){
            var self = this;

            self.$postRequest('/productStrategy/findRule',{
                productCode: self.sendMessagePro.productCode,
                strategyRule: self.sendMessagePro.strategyRule,
                cooperatorCode: self.sendMessagePro.cooperatorCode
            }).then(function(res){
                if(res.code == '0'){
                    if(res.result != null){
                        self.dialogVisible = false;
                        self.$message({
                            showClose: true,
                            message: res.result.alertContents,
                            type: 'warning'
                        });
                    }
                }else{
                    self.dialogVisible = false;
                    self.$message({
                        showClose: true,
                        message: res.message || '请稍后在试！',
                        type: 'warning'
                    });
                }
            })
        },
        handleSelectBusinessTypeChange(val){
            var obj = {
                businessType: val,
                displayFlag: '1'
            }
            this.handleSelectBusinessType(obj)
        },
        handleSelectBusinessType(val){
            var self = this;
            
            self.$postRequest('/sms/template/findListByBusinessType',val).then(function(res){
                if(res.code == '0'){
                    var tempList = res.result || [];
                    self.smsTempList = tempList;

                    if(self.sendMessagePro.templateCode){
                        if(tempList.length){
                            self.senMessageForm = Object.assign({},self.senMessageForm, {
                                smsTemplateCode: tempList[0].templateCode || '',
                                content: tempList[0].contents || '',
                                templateCode: tempList[0].businessType || ''
                            })
                        }
                    }
                }
            })
        },
        handleSelectBusinessTypeByTempCode(){
            var obj = {};

            if (this.sendMessagePro.templateCode) {
                obj = {
                    templateCode: this.sendMessagePro.templateCode
                }
                this.handleSelectBusinessType(obj);
            }
        },
        handleSmsTemplateCode(val){
            var self = this;

            self.smsTempList.some(function(item, index){
                if(item.templateCode == val){
                    self.senMessageForm = Object.assign({}, self.senMessageForm, {
                        content: item.contents
                    })

                    return true;
                }
            })
        },
        handleSendMessageSubmit(){
            var self = this,
                last3PhoneNumber = '';

            console.log("+++++++++++++++++ handleSendMessageSubmit:");
            self.$refs['senMessageForm'].validate((valid) => {
                if (valid) {
                    var paramStr = '',
                        mobile = self.senMessageForm.mobile,
                        obj = (self.sendMessagePro && self.sendMessagePro.parameters && JSON.parse(JSON.stringify(self.sendMessagePro.parameters))) || {};

                    if(mobile){
                        mobile = mobile && mobile.substring(mobile.length-3, mobile.length) || '';
                    }

                    if(obj.last3PhoneNumber){
                        obj.last3PhoneNumber = mobile;
                    }

                    if(obj.mobile){
                        obj.mobile = mobile;
                    }

                    for(var p in obj){
                        if(typeof(obj[p]) == "function"){ 
                        }else{
                           paramStr = paramStr+p+':'+obj[p]+','
                        }
                    }

                    paramStr = paramStr.substring(0,paramStr.length - 1);

                    self.$postRequest('/sms/send',{
                        templateCode: self.senMessageForm.smsTemplateCode,
                        mobile: self.senMessageForm.mobileEnc || '',
                        parameters: paramStr,
                        uniqueid: self.sendMessagePro.uniqueid,
                        workOrderNumber: self.sendMessagePro.workOrderNumber || '',
                        customizedApiUrl: self.sendMessagePro.customizedApiUrl || ''
                    }).then(function(res){
                        if(res.code == '0'){
                            self.dialogVisible = false;
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
                        self.$message({
                            showClose: true,
                            message: err.message || '请稍后在试！',
                            type: 'warning'
                        });
                    })
                } else {
                    return false;
                }
            });
        },
        handleClose(){
            var self = this;

            this.dialogVisible = false;

            //this.$refs['senMessageForm'].resetFields();
            this.senMessageForm = Object.assign({}, this.senMessageForm, {
                businessType: '',
                smsTemplateCode: '',
                mobile: '',
                mobileEnc: '',
                content: ''
            })
        }
    }
}
</script>

<style lang = "scss">
.send-message-dailog{
    .el-dialog__header{
        border-bottom: none !important;
    }
    .el-form-item__label{
        text-align: left;
    }
    .el-form-item__content{
        input{
            width: 300px;
        }
        textarea{
            width: 344px;
            height: 96px;
        }
    }
}
</style>

