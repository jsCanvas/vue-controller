<template>
<el-dialog
    title = "开具证明"
    :visible.sync = "dialogVisible"
    width = "500px"
    class = "prove-dailog"
    :before-close = "handleClose">
    <div class = "prove-contianer">
        <el-row>
            <el-col :span="12">
                <el-form 
                     ref = "proveForm" 
                     :rules = "rulesForm"
                     :model = "proveForm" 
                     label-width = "100px">
                     <el-form-item label = "证明类型:" prop = "templateCode">
                        <el-select 
                            v-model = "proveForm.templateCode"
                            style = "width: 300px;" 
                            placeholder = "请选择证明类型">
                            <el-option
                                 v-for = "(item,index) in proveList"
                                 :key = "'prove-from-prove-type-key-'+index" 
                                 :label = "item.dataValue" 
                                 :value = "item.dataKey"/>
                        </el-select>
                     </el-form-item>
                     <el-form-item label = "合同号:" prop = "contractNo">
                        <el-select 
                            v-model = "proveForm.contractNo"
                            style = "width: 300px;"
                            @change = "handleSelectContract"  
                            placeholder = "请选择合同号">
                            <el-option
                                 v-for = "(item,index) in contractArr"
                                 :key = "'prove-from-contract-key-'+index" 
                                 :label = "item.contractNo" 
                                 :value = "item.contractNo"/>
                        </el-select>
                     </el-form-item>
                     <el-form-item label = "邮箱地址:" prop = "email">
                         <el-input 
                            v-model = "proveForm.email"
                            style = "width: 300px;"></el-input>
                     </el-form-item>
                </el-form>
            </el-col>
        </el-row>
    </div>
    <span slot = "footer" class = "dialog-footer">
        <el-button 
            size = "small"
            @click = "handleClose"
            plain>取 消</el-button>
        <el-button type = "primary"
            size = "small" 
            @click = "handleSubmitProve">确 定</el-button>
    </span>
</el-dialog>
</template>

<script>

export default {
    name: 'userTag',
    props: {
        provePro: Object
    },
    components: {
    },
    data() {
        return {
            dialogVisible: false,
            contractArr: [],
            currentItem: {},
            proveList: [],
            proveForm: {
                templateCode: '',
                email: '',
                contractNo: ''
            },
            rulesForm: {
                templateCode: [
                    {  
                         required: true, 
                         message: '请选择证明类型', 
                         trigger: 'change' }
                ],
                email: [
                    { 
                        required: true, 
                        type: 'email',
                        message: '请输入邮箱地址', 
                        trigger: 'change' }
                ],
                contractNo: [
                    { 
                        required: true, 
                        message: '请选择活动合同', 
                        trigger: 'change' }
                ],
            }
        }
    },
    watch: {
        'provePro': {
            handler: function(val, oldVal){
                this.dialogVisible = val.visiblePro;

                if(val.visiblePro){
                    this.handleProveType();
                    this.handleFindContractList();
                }
            },
            immediate: true,
            deep: true
        }
    },
    computed: {
        uniqueid(){
            return this.$route.params.id;
        },
    },
    created(){
        
    },
    methods: {
        handleSelectContract(val){
            var self = this;

            self.contractArr.some(function(item, index){
                if(item.contractNo == val){
                    self.currentItem = item;
                    return true;
                }
            })
        },
        handleProveType(){
            var self = this;

            self.$store.dispatch('common/dataDictionary',{
                dataType: 'prove.type.list'
            }).then(function(data) {
                self.proveList = Object.assign([],self.proveList, data.result || []);
            })
        },
        handleSubmitProve(){
            var self = this;

            self.$refs['proveForm'].validate((valid) => {
                if (valid) {
                    self.$confirm('确定要进行开具证明操作么？', '开具证明', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        self.handleValidate().then(function(data){
                            if(data && data.result){
                                self.$confirm('该邮箱地址已发送过，请确认是否再次发送？', '开具证明', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    self.handleProveSend();
                                    self.$refs['proveForm'].resetFields();
                                }).catch(() => {       
                                });
                                // self.$message({
                                //     message: '您已发送过开具证明',
                                //     type: 'warning'
                                // })
                                // this.$refs['proveForm'].resetFields();
                                // self.dialogVisible = false;
                            }else{
                                self.handleProveSend();
                                //self.$refs['proveForm'].resetFields();
                            }
                        })
                    }).catch(() => {         
                    });
                    
                } else {
                    return false;
                }
            });
        },
        handleValidate(){
            var self = this;

            return new Promise(function(resolve, reject){
                self.$postRequest('/proveHistory/checkSendProve',{
                    uniqueid: self.uniqueid,
                    contractNo: self.currentItem.contractNo,
                    email: self.proveForm.email,
                    templateCode: self.proveForm.templateCode
                }).then(function(res){
                    if(res.code == '0'){
                        resolve(res)
                    }
                })
            })
        },
        handleProveSend(){
            var self = this;

            self.$postRequest('/prove/send',{
                contractNo: self.currentItem.contractNo,
                accountType: self.currentItem.accountType,
                templateCode: self.proveForm.templateCode,
                uniqueid: self.uniqueid,
                sendFlag: 0,
                email: self.proveForm.email,
                type: 0
            }).then(function(res){
                if(res.code == '0'){
                    self.$message({
                        showClose: true,
                        message: '开具证明发送成功！',
                        type: 'success'
                    })

                    self.dialogVisible = false;
                    self.$refs['proveForm'].resetFields();
                }else{
                    self.$message({
                        showClose: true,
                        message: res.message || '开具证明发送失败！',
                        type: 'warning'
                    })
                }
            }).catch ( err => {
                self.$message({
                    showClose: true,
                    message: err.message || '开具证明发送失败！',
                    type: 'warning'
                })
            })
        },
        handleFindContractList(){
            var self = this;

            this.$postRequest('/prove/findContractList',{
                uniqueid: self.uniqueid
            }).then(function(res){
                if(res.code == '0'){
                    self.contractArr = res.result && res.result.list || [];
                }
            })
        },
        handleClose(){
            this.dialogVisible = false;
            this.$refs['proveForm'].resetFields();
        }
    }
}
</script>

<style lang = "scss" scoped>
.user-tag-dailog{
    .el-tag{
        margin-right: 9px;
        margin-bottom: 13px;
        background: #fff;
        height: 32px;
        line-height: 32px;
        border-radius: 20px;
        padding: 0 20px;
    }
}
</style>

