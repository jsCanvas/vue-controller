<template>
    <div class = "phone-summary-container">
        <p class = "phone-title">电话小结</p>
        <div v-loading="summaryLoading" v-if = "(!phoneList.length || changeAdd || changeUpdate) || changeAdd || changeUpdate">
            <el-row style = "margin-bottom: 20px;">
                <el-col :span = "24">
                    <div class = "search-container">
                        <el-input 
                            size = "small"
                            placeholder = "请输入内容" 
                            v-model = "searchValue">
                            <template slot = "append">
                                <i class = "el-icon-search"></i>
                            </template>
                        </el-input>
                    </div>
                    <div class="search-tag-box">
                        <div class = "tag-items"
                                v-for = "(item,index) in searchArr" :key="index">
                                <div class = "tag-content">
                                    <el-tag
                                        @click="selectnum==1?chooseFirst(item):selectnum==2?chooseSecond(item):chooseThird(item)"
                                        :key = "item.label"
                                        type = "info"
                                        class="search-item"
                                        effect = "plain">
                                         {{ item.classificationName }}
                                    </el-tag>
                                </div>
                            </div>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter = "20">
                <el-col :span = "16">
                    <el-row class = "summary-item-classify">
                        <el-col :span="8">
                            <div @click="querySummaryId()" :class = "selectnum==1?'item current-summary':'item'">{{first?first.classificationName:'第一小结'}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div @click="first.id?querySummaryIdSecond(first.id):''" :class = "selectnum==2?'item current-summary':'item'">{{second?second.classificationName:'第二小结'}}</div>
                        </el-col>
                        <el-col :span="8">
                            <div @click="second.id?querySummaryIdThird(second.id):''" :class = "selectnum==3?'item current-summary last-child':'item last-child'">{{third?third.classificationName:'第三小结'}}</div>
                        </el-col>
                    </el-row>
                    <div class = "tag-item-contianer">
                        <div v-if="selectnum==1" class = "tag-item-content">
                            <div class = "tag-items"
                                v-for = "(item,index) in summaryList" :key="index">
                                <div class = "tag-content">
                                    <el-tag
                                        @click="chooseFirst(item)"
                                        :key = "item.label"
                                        type = "info"
                                        effect = "plain">
                                         {{ item.classificationName }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>

                         <div v-if="selectnum==2" class = "tag-item-content">
                            <div class = "tag-items"
                                v-for = "(item,index) in summarySecondList" :key="index">
                                <div class = "tag-content">
                                    <el-tag
                                        @click="chooseSecond(item)"
                                        :key = "item.label"
                                        type = "info"
                                        effect = "plain">
                                         {{ item.classificationName }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>

                        <div  v-if="selectnum==3" class = "tag-item-content">
                            <div class = "tag-items"
                                v-for = "(item,index) in summaryThirdList" :key="index">
                                <div class = "tag-content">
                                    <el-tag
                                        @click="chooseThird(item)"
                                        :key = "item.label"
                                        type = "info"
                                        effect = "plain">
                                         {{ item.classificationName }}
                                    </el-tag>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-col>
                <el-col :span = "8">
                    <el-form ref = "summaryForm" 
                        :model = "summaryForm" 
                        size = "small"
                        class = "summary-form"
                        label-width = "0px">
                        <!-- <p class = "form-text">转接原因</p>
                        <el-form-item label = "">
                            <el-input type = "textarea" 
                                 v-model = "summaryForm.desc"></el-input>
                        </el-form-item> -->
                        <p class = "form-text">备注</p>
                        <el-form-item label = "">
                            <el-input type = "textarea" 
                                 v-model = "remark"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
            <div class = "summary-btn-container">
                 <el-button type = "primary"
                     v-if="!changeUpdate"
                     size = "small" 
                     @click = "save"
                     :disabled="!first || !second || !third"
                     plain>提交</el-button>
                 <el-button type = "primary"
                     v-if="changeUpdate"
                     size = "small" 
                     @click = "update"
                     :disabled="!first || !second || !third"
                     plain>提交</el-button>    
                 <el-button
                     v-if="phoneList.length"
                     @click="cancel()"
                     size = "small" plain>取消</el-button>
            </div>
        </div>
        <div v-loading="summaryLoading" class = "phone-history-content"
             v-else>
            <ul v-loading="summaryLoading">
                <li v-for="(item,ind) in  phoneList" :key="ind" class = "phone-history-item">
                    <p class = "history-classify" @click="updates(item)">
                        <span>{{item.first}}</span>
                        <span> / {{item.second}}</span>
                        <span> / {{item.third}}</span>
                        <span @click.stop="deletes(item)" class="close-iten el-icon-close"></span>
                    </p>
                    
                    <p v-if="item.remark" :title="item.remark" class = "classify-desc">备注：{{item.remark}}</p>
                </li>
            </ul>
            <el-button 
                 class = "continue-add"
                 @click="changeAdd = true"
                 type = "primary" plain>继续添加</el-button>
        </div>
    </div>
</template>

<script>

export default {
    name: 'honeSummary',
    components: {
    },
    props:{
        currentIcc: Object,
        uniqueid: String
    },
    watch:{
        'uniqueid': {
            handler: function(val, oldVal){
                    // console.log('0-0-0-0-0-0-0-0-0->detail',val);
                    this.querySummaryPhone(); 
                    this.querySummaryId();
            },
            immediate: true,
            deep: true
        },
        'searchValue': {
            handler: function(val, oldVal){
                this.searchArr = [];
                if(val){
                    if(!this.first){
                        this.searchArr = this.summaryList.filter(a=>{
                            if(a.classificationName.indexOf(val)!=-1){
                                return a;
                            }
                        })
                    }else if(this.first && !this.second){
                        this.searchArr = this.summarySecondList.filter(a=>{
                            if(a.classificationName.indexOf(val)!=-1){
                                return a;
                            }
                        })

                    }else if(this.first && this.second){
                        this.searchArr = this.summaryThirdList.filter(a=>{
                            if(a.classificationName.indexOf(val)!=-1){
                                return a;
                            }
                        })
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    data() {
        return {
            summaryForm: {},
            searchValue: '',
            selectIndex: 0,
            phoneList: [],
            currentIccData:{},
            summaryLoading: false,
            summaryList:[],
            changeAdd: false,
            first:'',
            second:'',
            third:'',
            summarySecondList:[],
            summaryThirdList:[],
            remark:'',
            searchArr:[],
            selectnum:0,
            changeUpdate: false,
            changetarget: {},
            sendMobile:''
        }
    },
    computed: {
        iccData(){
            return this.$store.state.icclogic.iccLogicArr;
        }
    },
    created(){
        
    },
    mounted(){
    },
    methods: {
        handleSubmitbtn(){

        },
        back(){
            this.$emit('back');
        },
        ///workbench/summary/phone/queryPage
        querySummaryPhone(){
            var self = this;
            self.summaryLoading = true;
            self.$postRequest('/workbench/summary/phone/queryPage',{
                liaisonHistoryId: self.currentIcc.liaisonHistoryId  || ''
            }).then(function(res){
                self.summaryLoading = false;
                if(res.code == '0'){
                    self.phoneList = (res.result && res.result.pageList) || {};
                    if(!self.$route.meta.summaryok){
                        self.$route.meta.summaryok = [];
                    }else{
                        self.$route.meta.summaryok.map((item,ind)=>{
                            if(item.liaisonHistoryId == self.currentIcc.liaisonHistoryId){
                                self.$route.meta.summaryok.splice(ind,1);
                            }
                        })
                    }
                    if(res.result.pageList.length){
                        self.$route.meta.summaryok.push({
                            ok:true,
                            liaisonHistoryId: self.currentIcc.liaisonHistoryId
                        });
                    }else{
                         self.$route.meta.summaryok.push({
                            ok:false,
                            liaisonHistoryId: self.currentIcc.liaisonHistoryId
                        });
                    }
                }
            }).catch(e=>{
                 self.summaryLoading = false;
            })
        },
        ///workbench/summary/queryPage
         querySummaryId(id){
            var self = this;
            self.summaryLoading = true;
            self.$postRequest('/workbench/summary/queryPage',{
                parentId: id || -1
            }).then(function(res){
                self.summaryLoading = false;
                if(res.code == '0'){
                    self.summaryList = res.result || {};
                    self.selectnum = 1;
                    self.first = null;
                    self.second = null;
                    self.third = null;
                }
            }).catch(e=>{
                 self.summaryLoading = false;
            })
        },
         querySummaryIdSecond(id){
            var self = this;
            self.summaryLoading = true;
            self.$postRequest('/workbench/summary/queryPage',{
                parentId: id || -1 
            }).then(function(res){
                self.summaryLoading = false;
                if(res.code == '0'){
                    self.summarySecondList = res.result || {};
                    self.selectnum = 2;
                    self.second = null;
                    self.third = null;
                }
            }).catch(e=>{
                 self.summaryLoading = false;
            })
        },
        querySummaryIdThird(id){
            var self = this;
            self.summaryLoading = true;
            self.$postRequest('/workbench/summary/queryPage',{
                parentId: id || -1
            }).then(function(res){
                self.summaryLoading = false;
                if(res.code == '0'){
                    self.summaryThirdList = res.result || {};
                    self.selectnum = 3;
                    self.third = null;
                }
            }).catch(e=>{
                 self.summaryLoading = false;
            })
        },
        ///workbench/summary/phone/save
        save(){
            var self = this;
            self.summaryLoading = true;
            var tempiccdata = {};
            this.iccData.some(item=>{
                if(self.currentIcc.liaisonHistoryId == item.liaisonHistoryId){
                    tempiccdata = item;
                }
            });
            self.sendMobile = self.currentIcc.mobile;
            self.$postRequest('/workbench/summary/phone/save',{
                liaisonHistoryId:  self.currentIcc.liaisonHistoryId  || '' ,
                callId: tempiccdata.callId,
                callingCall: self.currentIcc.callingNo,//主叫号码	
                calledCall: self.currentIcc.calledNo,//被叫号码	
                callType: self.currentIcc.callType,//呼叫类型	
                recordId: tempiccdata.recordId,//录音ID
                recordTimestamp: tempiccdata.recordTimestamp,
                first: self.first.classificationName,
                second: self.second.classificationName,
                third: self.third.classificationName,
                remark: self.remark,
                uniqueid: self.uniqueid
            }).then(function(res){
                self.summaryLoading = false;
                if(res.code == '0'){
                 self.first='';
                 self.second = '';
                 self.third= '';
                 self.remark='';
                 self.changeAdd = false;
                 self.selectnum = 1;
                 self.$store.dispatch('workbench/saveSatisfaction',{
                     liaisonHistoryId:  self.currentIcc.liaisonHistoryId,
                     uniqueid: self.uniqueid||'',
                     mobile: self.sendMobile||'',
                     callId: tempiccdata.callId,
                 });
                 self.querySummaryPhone();
                }
            }).catch(e=>{
                 self.summaryLoading = false;
                self.$message({
                        showClose: true,
                        message: e.message,
                        type: 'warning'
                    });
            })
        },
        deletes(item){
            var self = this;
            self.$confirm('确定要删除小结么？', '删除小结', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
            self.summaryLoading = true;
            self.$postRequest('/workbench/summary/phone/delete',{
                id:  item.id+''  || '' 
            }).then(function(res){
                self.summaryLoading = false;
                if(res.code == '0'){
                    self.querySummaryPhone();
                }
            }).catch(e=>{
                 self.summaryLoading = false;
                this.$message({
                        showClose: true,
                        message: e.message,
                        type: 'warning'
                    });
            })
            
        })
        },
        update(item){
            var self = this;
            self.summaryLoading = true;
            self.$postRequest('/workbench/summary/phone/update',{
                id:  this.changetarget.id  || '' ,
                first: this.changetarget.first,
                second: this.changetarget.second,
                third: this.changetarget.third,
                remark: this.remark || this.changetarget.remark || ''
            }).then(function(res){
                self.summaryLoading = false;
                if(res.code == '0'){
                     self.changetarget = {};
                     self.changeUpdate = false;
                     self.first = null;
                     self.second = null;
                     self.third = null;
                     self.searchValue = "";
                     self.selectnum = 1;
                     self.querySummaryPhone();
                }
            }).catch(e=>{
                 self.summaryLoading = false;
                this.$message({
                        showClose: true,
                        message: e.message,
                        type: 'warning'
                    });
            })
        },
        updates(item){
            // this.$message({
            //             message:'updates',
            //             type: 'warning'
            //         });
            this.changeUpdate= true;
            this.changetarget= item;   
            this.remark = item.remark || ""; 
            this.first = {
                classificationName: item.first,
                id:0
            }  
            this.second = {
                classificationName: item.second
            }  
            this.third = {
                classificationName: item.third
            }  
            this.selectnum = 1;
        },
        chooseFirst(first){
            if(this.changeUpdate){
                this.changetarget.first = first.classificationName;
                  this.first = first;
            }else{
                this.first = first;
            }
            
            this.querySummaryIdSecond(first.id);
            this.searchValue = "";
        },
        chooseSecond(second){
            if(this.changeUpdate){
                this.changetarget.second = second.classificationName;
                this.second = second;
            }else{
                this.second = second;
            }
            this.querySummaryIdThird(second.id);
           this.searchValue = "";
        },
        cancel(){
            this.changetarget = {};
            this.changeUpdate = false;
            this.first = null;
            this.second = null;
            this.third = null;
            this.searchValue = "";
            this.changeAdd = false;
            this.changeUpdate=false;
            this.selectnum=1;
        },
        chooseThird(third){
            
            if(this.changeUpdate){
                this.changetarget.third = third.classificationName;
                this.third = third;
            }else{
              this.third = third;
            }
            this.searchValue = "";
        }
    }
}
</script>

<style lang = "scss">
.phone-summary-container{
    padding: 0px 15px;
    height: 300px;
    overflow-y: auto;
    .phone-title{
        color: #606266;
        position: relative;
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 24px;
    }
    .search-container{
        .el-input{
            input{
                border-right: 0;
            }
        }
        .el-input-group__append{
            background: transparent;
            padding:0 7px;
            font-size: 16px;
        }
    }
    .summary-item-classify{
        font-size: 14px;
        color: #606266;
        background-color: #F2F6FC;
        height: 40px;
        line-height: 40px;
        border: none;
        .item{
            text-align: center;
            font-weight: bold;
            &.current-summary{
                color: #4C7EE9;
            }
            &.last-child{
                border-right: 0;
            }
        }
    }
    .summary-form{
        .form-text{
            margin-bottom: 10px;
        }
        textarea{
            height: 38px;
        }
    }
    .summary-btn-container{
        margin: 20px 0 29px;
        .el-button{
            width: 66px;
        }
    }
    .tag-item-contianer{
        overflow: hidden;
        width: 100%;
        max-height: 100px;
        overflow-y: auto;
        &::-webkit-scrollbar{
            width: 8px;
            height: 8px;
        }

        &::-webkit-scrollbar-track{
            border-radius: 8px;
            background-color: #fff;
        }
        &::-webkit-scrollbar-thumb{
            border-radius: 8px;
            background-color: #B0B0B0;
        }
        .tag-item-content{
            overflow: hidden;
            padding-right: 25px;
            margin-top: 10px;
            .tag-items{
                width: 25%;
                float: left;
                .tag-content{
                    margin-right: 5px;
                    .el-tag{
                        width: 100%;
                        border: 1px solid #EBEEF5;
                        color: #909399;
                        background: #fff;
                        border-radius: 2px;
                        text-align: center;
                        height: 25px;
                        line-height: 25px;
                        margin-bottom: 5px;
                        &.current-item{
                            color: #4C7EE9;
                            border: 1px solid #4C7EE9;
                            background: #F8FBFF;
                        }
                    }
                }
            }
        }
    }
    .phone-history-content{
        .phone-history-item{
            background: #F2F6FC;
            padding: 13px 10px;
            width: 515px;
            color: #606266;
            margin-bottom: 5px;
            cursor: pointer;
            position: relative;
            .classify-desc{
                color: #909399;
                margin-top: 8px;
                font-size: 12px;
                word-wrap: break-word;
                word-break: normal;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
        }
        .continue-add{
            margin-top: 13px;
        }
    }
    .search-tag-box{
        padding: 5px;
        .search-item{
            border: 1px solid #409eff;
    border-radius: 0;
    height: 25px;
    line-height: 25px;
    width: 100px;
    text-align: center;
        }
    }
}
.close-iten{
    position: absolute;
    right: 7px;
    font-size: 24px;
    top: 8px;
    cursor: pointer;
}
</style>

