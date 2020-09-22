<template>
    <div :class = "classObj" class = "app-wrapper">
        <div v-if = "device==='mobile' && sidebar.opened"
             class = "drawer-bg"
             @click="handleClickOutside"></div>
        <div>
            <el-container>
                 <el-aside v-bind:style = "{ width: sidebar.opened?'200px':'54px' }">
                     <sidebar class = "sidebar-container" />
                 </el-aside>
                 <el-main class = "layout-main-container">
                     <div class = "main-container">
                        <el-header style = "overflow:hidden;padding: 0;height: 50px; border:1px solid #EBEEF5;position: relative; z-index: 9;">
                            <div :class = "{'fixed-header':fixedHeader}">
                                 <navbar
                                     ref = "headerNavbar"
                                     :noticeList = "noticeList"
                                     :remindTotal = "remindTotal"
                                     @handlePersonalFindList = "handlePersonalFindList"
                                     @handleResetTiming = "handleResetTiming"
                                     @changeTransferPro = "changeTransferPro"/>
                            </div>
                        </el-header>
                        <el-main
                            style = "height:calc(100vh - 50px);background-color: #EDEFF4; position: relative;overflow: hidden;">
                            <app-main/>
                        </el-main>
                     </div>
                 </el-main>
            </el-container>
            <asideRight></asideRight>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {Navbar, Sidebar, AppMain, Transfer, Answer, ThreeDiglog} from './components'
    import noticeCenter from '@/components/dailog/notice-center'
    import ResizeMixin from './mixin/ResizeHandler'
    import asideRight from './components/asideright'



export default {
    name: 'Layout',
    components: {
        Navbar,
        Sidebar,
        AppMain,
        Transfer,
        Answer,
        noticeCenter,
        asideRight,
        ThreeDiglog
    },
    mixins: [ResizeMixin],
    computed: {
        ...mapGetters([
            'recordData'
        ]),
        iccAccount() {
            return this.$store.state.common
        },
        sidebar() {
            return this.$store.state.app.sidebar
        },
        device() {
            return this.$store.state.app.device
        },
        fixedHeader() {
            return this.$store.state.settings.fixedHeader
        },
        uri(){
            return window.location.protocol+'//'+window.location.host
        },
        classObj() {
            return {
                hideSidebar: !this.sidebar.opened,
                openSidebar: this.sidebar.opened,
                withoutAnimation: this.sidebar.withoutAnimation,
                mobile: this.device === 'mobile'
            }
        }
    },
    data(){
        return {
            transferPro: {
                visiblePro: false
            },
            answerPro: {
                visiblePro: false
            },
            evidenceList: [],
            remindTotal: 0,
            readNoticeTotal: 0,
            readNoticeList: [],
            noticeList: [],
            evidenceForm: {},
            dailogData: {},
            dialogVisible: false,
            noticeInt: 0,
            expandTime: 0,
            isExpand: true,
            noticeTypeDetailCode: '',
            businessTable: '',
            showNoticeDailog: false,
            noticeId: 0,
            currentNoticeItem: {},
            businessId: 0
        }
    },
    watch: {
        'recordData': {
            handler: function(val, oldVal){
                var self = this;

                if(val.isReload && val.cls.show){
                    self.$nextTick(function(){
                        if(val.from == 'search'){
                            if(self.$refs.recordingSearchAudio){
                                self.$refs.recordingSearchAudio.load();
                            }
                        }

                        if(val.from == 'history'){
                            if(self.$refs.recordingHistoryAudio){
                                self.$refs.recordingHistoryAudio.load();
                            }
                        }
                    })
                }

                if(val.from == 'search'){
                    if(self.$refs.recordingHistoryAudio && self.$refs.recordingHistoryAudio.paused){
                    }else{
                        self.$refs.recordingHistoryAudio && self.$refs.recordingHistoryAudio.pause();
                    }
                }

                if(val.from == 'history'){
                    if(self.$refs.recordingSearchAudio && self.$refs.recordingSearchAudio.paused){
                    }else{
                        self.$refs.recordingSearchAudio && self.$refs.recordingSearchAudio.pause();
                    }
                }
            },
            immediate: true,
            deep: true
        }
    },
    created(){
        var self = this;

        // self.$store.dispatch('common/getIccConfig', {})
        // self.$store.dispatch('user/loginUser', {});

        self.handlePersonalFindList();
        self.handleResetTiming();
        self.handleResetExpand();


        // setInterval(function(){
        //     self.handleEvidenceUnreadList(self.userDetailMessage.id);
        // }, 1000*60*30);
    },
    updated(){},
    methods: {
        handlePersonalFindList(){
            // var self = this;

            // self.$postRequest('/remind/personal/findList', {}).then(
            //     function(res){

            //     if(res.code == '0'){
            //         self.remindTotal = res.result && res.result.remindTotal || 0;
            //         self.readNoticeTotal = res.result && res.result.readTotal || 0;
            //         self.readNoticeList = res.result && res.result.readList || [];
            //         self.noticeList = res.result && res.result.remindList || [];
            //     }
            // })
        },
        handleResetTiming(){
            // var self = this;

            // clearInterval(self.noticeInt);
            // self.noticeInt = setInterval(function(){
            //     self.handlePersonalFindList();
            // }, 1000*60);
        },
        handleResetExpand(){
            // var self = this;
            // clearInterval(self.expandTime);

            // self.expandTime = setInterval(function(){
            //     self.isExpand = true;
            // },1000*60*5)
        },
        handleUnReadNumber(){
            this.isExpand = !this.isExpand;

            this.handleResetExpand();
        },
        handleClickOutside() {
            this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
        },
        handleClickNotice(data){
            var self = this;

            if(data.businessOpenType == 'tab'){
                self.$router.push({
                    path: '/notice-reminding/message-center/message-detail/'+data.id,
                })

                self.$postRequest('remind/personal/updateReadStatus', {
                    id: data.id
                }).then(function(res){
                    if(res.code == 0){
                        self.handlePersonalFindList();
                        self.handleResetTiming();
                    }
                })
            }else{
                self.noticeTypeDetailCode = data.noticeTypeDetailCode;
                self.businessId = data.businessId;
                self.noticeId = data.id;
                self.showNoticeDailog = true;
                self.currentNoticeItem = data
                self.businessTable = data.businessTable;
                // self.$router.push({
                //     path: '/notice-reminding/message-center?noticeTypeDetailCode='+data.noticeTypeDetailCode +'&businessId='+data.businessId+'&id='+data.id,
                // })
            }

        },
        changeTransferPro(data){
            this.transferPro = Object.assign({}, this.transferPro, data);
        },
        handleChangeSpeed(type){
            var playRate = '';

            if(type == 'slow'){
                playRate = 0.5;
            }else if(type == 'normal'){
                playRate = 1;
            }else if(type == 'quickly'){
                playRate = 1.5;
            }

            if(this.recordData.from == 'search'){
                this.$refs.recordingSearchAudio.playbackRate = playRate;
            }else{
                this.$refs.recordingHistoryAudio.playbackRate = playRate;
            }

        },
        handleClientPage(){
            if(this.dailogData && this.dailogData.uniqueid){
                this.$router.push({
                    path: '/client-manager/index/'+this.dailogData.uniqueid,
                })
                this.dialogVisible = false;
            }
        },
        handlePlayStatus(){
            this.$refs.recordingAudio.isPlaying = true;
            console.log("+++++++++++++++++ r2332r132r123");
        },
        // handleEvidenceUnreadList(userId){
        //     var self = this;

        //     self.$postRequest('/customer/evidence/unreadList',{
        //         userId: userId
        //     }).then(function(res){

        //         self.evidenceList = res.result || [];
        //         if(res.code == '0'){
        //             var tempHtml = '',
        //                 currentObj = {};

        //             if(res.result && res.result.length){
        //                 for(var i = 0; i < res.result.length; i++){
        //                     currentObj = res.result[i];

        //                     tempHtml = tempHtml + '<li><a href = "javascript:void(0);" class = "show-notify-item" style = "color: #4c7ee9; padding-right: 10px;">'+currentObj.mobile+'</a>用户已上传凭证，请尽快核查</li>';
        //                 }

        //                 self.$notify({
        //                      title: '用户凭证查看提醒',
        //                      dangerouslyUseHTMLString: true,
        //                      duration: 1000*60*10,
        //                      position: 'bottom-right',
        //                      message: '<ul style = "width: 300px;">'+tempHtml+'</ul>'
        //                 });

        //                 self.handleBlindClick();
        //             }
        //         }
        //     }).catch( err => {
        //         self.evidenceList = [];
        //     })
        // },
        // handleBlindClick(){
        //     var self = this;

        //     self.$nextTick(function(){
        //         var dom = document.getElementsByClassName('show-notify-item');
        //         for(var i = 0; i < dom.length; i++){
        //             (function(i){
        //                 document.getElementsByClassName('show-notify-item')[i].addEventListener('click',function(){
        //                     self.handleShowDetail(i)
        //                 });
        //             })(i)
        //         }
        //     })

        // },
        handleShowDetail(index){
            var self = this;

            self.dialogVisible = true;

            self.$postRequest('/customer/evidence/detail',{
                id: this.evidenceList[index].id
            }).then(function(res){
                if(res.code == '0'){
                    self.dailogData = res.result || {};
                }else{
                    self.dailogData = {};
                }
            }).catch( err => {
                self.dailogData = {};
            })
        }
    }
}
</script>

<style lang="scss">
@import "~@/styles/mixin.scss";
@import "~@/styles/variables.scss";

.app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
    .layout-main-container{
        padding: 0;
        .main-container{
            margin-left: 0 !important;
        }
    }
}
.drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
}

.fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
}

.hideSidebar .fixed-header {
    width: calc(100% - 54px)
}

.mobile .fixed-header {
    width: 100%;
}

.evidence-item-attachment{
    color: #4c7ee9;
}

.workbench-notice-layout{
    position: fixed;
    right: 20px;
    bottom: 20px;
    z-index: 999999999;
    .workbench-notice-unread-container{
        max-height: 340px;
        overflow: auto;
        width: 280px;
        padding: 12px 12px 0 12px;
        .workbench-notice-container{
            width: 256px;
            .layout-item{
                padding: 12px 16px;
                border: 0 solid #DCDFE6;
                box-shadow: 0 2px 9px 0 rgba(0,0,0,0.24);
                border-radius: 4px;
                border-radius: 4px;
                margin-bottom: 12px;
                color: #00002A;
                line-height: 20px;
                min-height: 40px;
                max-height: 64px;
                cursor: pointer;
                background: #fff;
                p{
                    word-wrap: break-word;
                    word-break: break-all;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    -webkit-line-clamp: 2;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                }
                .layout-title{
                    color: #303133;
                    font-weight: bold;
                    margin-right: 5px;
                }
            }
        }
    }
    .unread-tips{
        border: 0 solid #DCDFE6;
        background: #fff;
        box-shadow: 0 2px 9px 0 rgba(0,0,0,0.24);
        border-radius: 4px;
        border-radius: 4px;
        width: 256px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        color: #497BEC;
        cursor: pointer;
        margin-left: 12px;
        .expand-icon{
            transform: rotate(270deg);
            -ms-transform: rotate(270deg);
            -moz-transform: rotate(270deg);
            -webkit-transform: rotate(270deg);
            -o-transform: rotate(270deg);
            &.shrink-icon{
                transform: rotate(90deg);
                -ms-transform: rotate(90deg);
                -moz-transform: rotate(90deg);
                -webkit-transform: rotate(90deg);
                -o-transform: rotate(90deg);
            }
        }

    }
}
.client-recording-list-play-container{
    padding-top: 25px;
    position: fixed;
    top: 420px;
    left: 240px;
    display: none;
    &.show{
        display: block;
    }
    &.hide{
        top: 0px;
        left: 0px;
    }
    &.recording-list-cls{
        top: 245px;
    }
    .tips-container{
        margin-top: 10px;
        .tips{
            color: #909399;
            font-size: 12px;
        }
    }
    .recording-audio-btn{
        margin-left: 20px;
        display: inline-block;
        height: 54px;
        vertical-align: top;
        line-height: 54px;
    }
}
</style>
