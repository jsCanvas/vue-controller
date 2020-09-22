<template>
<div class = "navbar">
    <div id = "audio"></div>
    <hamburger
        :is-active = "sidebar.opened"
        class = "hamburger-container"
        @toggleClick = "toggleSideBar" />
    
    <div class = "right-menu">
        <el-dropdown class = "avatar-container" trigger = "click">
            <div class = "avatar-wrapper">
                <span class = "name-icon"></span>
            </div>
            <el-dropdown-menu slot = "dropdown" class = "user-dropdown">
                <el-dropdown-item divided>
                    <span>姓名：{{user.name || ''}}</span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                    <span>职位：{{user.title || ''}}</span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                    <span>部门：{{user.department || ''}}</span>
                </el-dropdown-item>
                <el-dropdown-item divided>
                    <span style = "display:block;" @click = "handleLogout">退出</span>
                </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
    </div>

    <noticeCenter
        :noticeTypeDetailCode = "noticeTypeDetailCode"
        :businessId = "businessId"
        :noticeId = "noticeId"
        :showNoticeDailog = "showNoticeDailog"
        :currentItem = currentNoticeItem
        ref = "notice-center-dailog"></noticeCenter>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import Hamburger from '@/components/Hamburger'
import scrollPane from '@/components/scrollPane'
import noticeCenter from '@/components/dailog/notice-center'

export default {
    props: {
        noticeList: Array,
        remindTotal: Number
    },
    components: {
        Hamburger,
        scrollPane,
        noticeCenter
    },
    computed: {
        ...mapGetters([
            'sidebar',
            'user',
            'common',
        ]),
        iccData(){
            return []
        }
    },
    data(){
        return {
            timeHtl: '00:00',
            visible: false,
            counter: {},
            value: '',
            iccAccount: '',
            isValidate: false,
            dialVisible: false,
            iccVisible: false,
            inComingVisible: false,
            isClick: false,
            mobile: '',
            navbarVisible: true,
            accountVisible: false,
            businessType: [],
            isReadly: false,
            isOutBound: false,
            btnStatus: '',
            noticeVisible: false,
            currenIccItem: {},
            noticeTypeDetailCode: '',
            showNoticeDailog: false,
            noticeId: 0,
            currentNoticeItem: {},
            businessId: 0
        }
    },
    watch: {
        
    },
    created(){
        var self = this;
        
    },
    mounted(){
        
    },
    methods: {
        toggleSideBar() {
            this.$store.dispatch('app/toggleSideBar')
        },
        handleLogout() {
            // document.cookie=`passport_access_token=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${location.hostname}`;
            window.location.href = window.location.protocol+'//'+window.location.host+"/passport/logout";
        }
    }
}
</script>

<style lang = "scss">
@media screen and (max-width: 1400px){
    .navbar{
        .navbar-icc-container{
            &.navbar-icc-open{
                .icc-btn-content{
                    width: 1030px;
                }
                .navbar-icc-items{
                    width: 48px;
                    .btn-text{
                        width: 48px !important;
                    }
                }

            }
            .navbar-icc-items{
                &.split-line{
                    margin: 0px 10px 0px 4px !important;
                }
            }
        }
    }
}
.navbar-notice-popover-container{
    padding: 7px 0 0px 4px;
    .item-notice{
        font-size: 14px;
        color: #00002A;
        height: 20px;
        line-height: 20px;
        cursor: pointer;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-bottom: 5px;
        &:hover{
            color: #497BEC;
        }
        .notice-title{
            font-weight: bold;
            margin-right: 8px;
        }
    }
    .all-contianer{
        text-align: center;
        color: #497BEC;
        height: 16px;
        line-height: 16px;
        margin-top: 5px;
        cursor: pointer;
    }
}
.workbench-navbar-popper{
    width: 96px !important;
    min-width: unset !important;
    padding: 0px !important;
    .icc-account-item{
        height: 32px;
        line-height: 32px;
        color: #606266;
        text-align: center;
        cursor: pointer;
        &:hover{
            background: rgba(76,126,233, 0.08);
        }
        &.icc-account-cls1{
            span:before{
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                background: url('../../assets/navbar/online.png') no-repeat;
                background-size: 100%;
                margin-right: 5px;
                vertical-align: sub;
            }
        }
        &.icc-account-cls2{
            span:before{
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                background: url('../../assets/navbar/telemarketing.png') no-repeat;
                background-size: 100%;
                vertical-align: sub;
                margin-right: 5px;
            }

        }
        &.icc-account-cls3{
            span:before{
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                background: url('../../assets/navbar/visit.png') no-repeat;
                background-size: 100%;
                vertical-align: sub;
                margin-right: 5px;
            }
        }
        &.icc-account-cls4{
            span:before{
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                background: url('../../assets/navbar/hotline.png') no-repeat;
                background-size: 100%;
                vertical-align: sub;
                margin-right: 5px;
            }
        }
        &.icc-account-clsother{
            span:before{
                content: '';
                width: 16px;
                height: 16px;
                display: inline-block;
                background: url('../../assets/navbar/other.png') no-repeat;
                background-size: 100%;
                vertical-align: sub;
                margin-right: 5px;
            }
        }
    }
}
.navbar-incoming-item{
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    &:hover{
        color: #4C7EE9;
    }
}
.navbar{
    position: relative;
    .hamburger-container{
        height: 100%;
        cursor: pointer;
        transition: background .3s;
        -webkit-tap-highlight-color:transparent;
        position: absolute;
        top: 0;
        left: -1px;
        width: 32px;
        height: 32px;
        padding: 8px;
        background: #3967CB;
        border-radius: 0 3px 3px 0;
    }
    .navbar-icc-container{
        margin: 15px 50px 0;
        .navbar-icc-items{
            float: left;
            width: 56px;
            text-align: center;
            cursor: pointer;
            position: relative;
            span.btn-text{
                display: block;
                text-align: center;
                width: 56px;
            }
            &:focus{
                outline: none;
            }
            .notice-icon-num{
                position: absolute;
                background: #FF6555;
                color: #fff;
                font-size: 12px;
                border-radius: 30px;
                padding: 0 5px;
                height: 16px;
                line-height: 16px;
                top: -8px;
                right: -4px;
            }
            .icc-icon-num{
                position: absolute;
                top: -6px;
                right: -3px;
                background: #f56c6c;
                color: #fff;
                font-size: 12px;
                width: 16px;
                height: 16px;
                display: block;
                line-height: 16px;
                text-align: center;
                border-radius: 50%;
            }
            &.icc-account{
                position: relative;
                &:hover{
                    .account-select{
                        display: block;
                    }
                }
                .account-select{
                    position: absolute;
                    padding: 10px 0;
                    width: 100px;
                    border: 1px solid #DCDFE6;
                    border-radius: 4px;
                    background: #fff;
                    display: none;
                    &.select{
                        display: block;
                    }
                }
            }
            &.current-task{
                width: 120px;
                margin: 0 10px;
                .description{
                    text-align: left;
                    margin-bottom: 14px;
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    &.disabled{
                        color: #909399;
                    }
                }
                .navbar-item-btn{
                    width: 48px;
                    height: 24px;
                    line-height: 20px;
                    color: #fff;
                    padding: 0;
                    float: left;
                    &.login-in{
                        margin-left: 5px;
                        &.disabled{
                            background: rgb(175,191,218);
                            border: 1px solid rgb(175,191,218);
                        }
                        span{
                            color: #fff !important;
                        }
                    }
                    &.login-out{
                        margin-left: 10px;
                        &:active,&:focus{
                            background: #fff;
                        }
                        &.disabled{
                            border: 1px solid #909399;
                            span{
                                color: #909399 !important;
                            }
                        }
                        span{
                            color: #4C7EE9 !important;
                        }
                    }
                }
            }
            &.status-dial{
                border: 1px solid #DCDFE6;
                font-size: 12px;
                color: #4C7EE9;
                border-radius: 6px;
                padding: 6px 8px;
                width: auto;
                margin-left: 10px;
                margin-right: 10px;
                span{
                    display: block;
                }
            }
            &.split-line{
                height: 40px;
                width: 1px;
                margin: 0px 10px 0px 10px;
                padding: 4px 0;
                span{
                    background: #E5E7ED;
                    width: 1px;
                    height: 32px;
                    display: block;
                }
            }
            &.split-line-cls1{
                height: 40px;
                width: 1px;
                margin: 0px 10px 0px 10px;
                padding: 4px 0;
                span{
                    background: #E5E7ED;
                    width: 1px;
                    height: 32px;
                    display: block;
                }
            }
            .navbar-img{
                width: 40px;
                height: 40px;
                display: inline-block;
            }
            &.disabled{
                span.btn-text{
                    color: #909399;
                    display: block;
                    text-align: center;
                    width: 56px;
                }
                .checkout-icon{
                    background: url('../../assets/navbar/checkout-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .readly-icon{
                    background: url('../../assets/navbar/readly-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .outbound-icon{
                    background: url('../../assets/navbar/outbound-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .rest-icon{
                    background: url('../../assets/navbar/rest-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .launch-icon{
                    background: url('../../assets/navbar/launch-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .launch-icon{
                    background: url('../../assets/navbar/launch-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .train-icon{
                    background: url('../../assets/navbar/train-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .answer-icon{
                    background: url('../../assets/navbar/answer-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .dial-icon{
                    background: url('../../assets/navbar/dialdisabled.png') no-repeat;
                    background-size: 100%;
                }
                .transfer-icon{
                    background: url('../../assets/navbar/transfer-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .keep-icon{
                    background: url('../../assets/navbar/keep-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .silence-icon{
                    background: url('../../assets/navbar/silence-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .content-icon{
                    background: url('../../assets/navbar/content-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .reminder-icon{
                    background: url('../../assets/navbar/reminder-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .notice-icon{
                    background: url('../../assets/navbar/notice-disabled.png') no-repeat;
                    background-size: 100%;
                }
                .incoming-icon{
                    background: url('../../assets/navbar/incoming-disabled.png') no-repeat;
                    background-size: 100%;
                }
            }
            &:not(.disabled):hover{
                .checkout-icon{
                    background: url('../../assets/navbar/checkout-select.png') no-repeat;
                    background-size: 100%;
                }
                .readly-icon{
                    background: url('../../assets/navbar/readly-select.png') no-repeat;
                    background-size: 100%;
                }
                .outbound-icon{
                    background: url('../../assets/navbar/outbound-select.png') no-repeat;
                    background-size: 100%;
                }
                .rest-icon{
                    background: url('../../assets/navbar/rest-select.png') no-repeat;
                    background-size: 100%;
                }
                .launch-icon{
                    background: url('../../assets/navbar/launch-select.png') no-repeat;
                    background-size: 100%;
                }
                .train-icon{
                    background: url('../../assets/navbar/train-select.png') no-repeat;
                    background-size: 100%;
                }
                .answer-icon{
                    background: url('../../assets/navbar/answer-select.png') no-repeat;
                    background-size: 100%;
                    &.hang-up{
                        background: url('../../assets/navbar/hangup.png') no-repeat;
                        background-size: 100%;
                    }
                }
                .dial-icon{
                    background: url('../../assets/navbar/dial-select.png') no-repeat;
                    background-size: 100%;
                }
                .transfer-icon{
                    background: url('../../assets/navbar/transfer-select.png') no-repeat;
                    background-size: 100%;
                }
                .keep-icon{
                    background: url('../../assets/navbar/keep-select.png') no-repeat;
                    background-size: 100%;
                    &.unkeep{
                        background: url('../../assets/navbar/huifu.png') no-repeat;
                        background-size: 100%;
                    }
                }
                .silence-icon{
                    background: url('../../assets/navbar/silence-select.png') no-repeat;
                    background-size: 100%;
                    &.unsilence{
                        background: url('../../assets/navbar/unsilence.png') no-repeat;
                        background-size: 100%;
                    }
                }
                .content-icon{
                    background: url('../../assets/navbar/content-select.png') no-repeat;
                    background-size: 100%;
                }
                .reminder-icon{
                    background: url('../../assets/navbar/reminder-select.png') no-repeat;
                    background-size: 100%;
                }
                .notice-icon{
                    background: url('../../assets/navbar/notice-select.png') no-repeat;
                    background-size: 100%;
                }
                .incoming-icon{
                    background: url('../../assets/navbar/incoming-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .checkout-icon{
                background: url('../../assets/navbar/checkout.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/checkout-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .readly-icon{
                background: url('../../assets/navbar/readly.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/readly-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .outbound-icon{
                background: url('../../assets/navbar/outbound.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/outbound-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .rest-icon{
                background: url('../../assets/navbar/rest.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/rest-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .launch-icon{
                background: url('../../assets/navbar/launch.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/launch-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .train-icon{
                background: url('../../assets/navbar/train.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/train-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .answer-icon{
                background: url('../../assets/navbar/answer.png') no-repeat;
                background-size: 100%;
                &.hang-up{
                    background: url('../../assets/navbar/hangup.png') no-repeat;
                    background-size: 100%;
                    &.select{
                        background: url('../../assets/navbar/hangup.png') no-repeat;
                        background-size: 100%;
                    }
                }
                &.select{
                    background: url('../../assets/navbar/answer-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .dial-icon{
                background: url('../../assets/navbar/dial.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/dial-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .transfer-icon{
                background: url('../../assets/navbar/transfer.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/transfer-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .keep-icon{
                background: url('../../assets/navbar/keep.png') no-repeat;
                background-size: 100%;
                &.unkeep{
                    background: url('../../assets/navbar/huifu.png') no-repeat;
                    background-size: 100%;
                    &.select{
                        background: url('../../assets/navbar/huifu.png') no-repeat;
                        background-size: 100%;
                    }
                }
                &.select{
                    background: url('../../assets/navbar/keep-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .silence-icon{
                background: url('../../assets/navbar/silence.png') no-repeat;
                background-size: 100%;
                &.unsilence{
                    background: url('../../assets/navbar/unsilence.png') no-repeat;
                    background-size: 100%;
                    &.select{
                        background: url('../../assets/navbar/unsilence.png') no-repeat;
                        background-size: 100%;
                    }
                }
                &.select{
                    background: url('../../assets/navbar/silence-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .content-icon{
                background: url('../../assets/navbar/content.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/content-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .reminder-icon{
                background: url('../../assets/navbar/reminder.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/reminder-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .notice-icon{
                background: url('../../assets/navbar/notice.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/notice-select.png') no-repeat;
                    background-size: 100%;
                }
            }
            .incoming-icon{
                background: url('../../assets/navbar/incoming.png') no-repeat;
                background-size: 100%;
                &.select{
                    background: url('../../assets/navbar/incoming-select.png') no-repeat;
                    background-size: 100%;
                }
            }
        }
    }

    .breadcrumb-container {
        float: left;
    }

    .right-menu {
        height: 100%;
        position: absolute;
        top: 0;
        right: 0;

        &:focus {
            outline: none;
        }

        .right-menu-item {
            display: inline-block;
            padding: 0 8px;
            height: 100%;
            font-size: 18px;
            color: #5a5e66;
            vertical-align: text-bottom;

            &.hover-effect {
                cursor: pointer;
                transition: background .3s;

                &:hover {
                  background: rgba(0, 0, 0, .025)
                }
            }
        }

        .avatar-container {
            margin-right: 20px;
            margin-top: 10px;
            .name-icon{
                width: 20px;
                height: 20px;
                display: block;
                background: url('../../assets/mine-icon.png') no-repeat;
                background-size: 100% 100%;
            }
        }
    }
}
.navbar-mobile-container{
    position: relative;
    padding:0 40px 0 12px;
    .el-input__inner{
        border: none;
        padding-left: 0px;
    }
    .mobile-icon{
        width: 32px;
        height: 32px;
        position: absolute;
        background: red;
        right: 0;
        top: 0;
        background: url('../../assets/disabled-mobile.png') no-repeat;
        background-size: 100% 100%;
        &.dail{
            background: url('../../assets/mobile.png') no-repeat;
            background-size: 100% 100%;
        }
    }
}
</style>
