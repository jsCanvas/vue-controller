<template>
	<div>
		<rollover-audit-dialog
	        :info="rolloverData"
	        :visible="rolloverVisible"
	        @visibleChange="val => {rolloverVisible = val}"
	    />
	    <customer-evidence-dialog
	        :info="customerData"
	        :visible="customerVisible"
	        @visibleChange="val => {customerVisible = val}"
	    />
        <transfer-warning-dialog
            :id="dialogBusinessId"
            :visible="transferWarningVisible"
            @visibleChange="val => {transferWarningVisible = val}"
        />
        <monitor-warning-dialog
            :info="monitorInfo"
            :visible="monitorWarningVisible"
            @visibleChange="val => {monitorWarningVisible = val}"
        />
	</div>
</template>

<script>
import rolloverAuditDialog from './rollover-audit'
import customerEvidenceDialog from './customer-evidence'
import transferWarningDialog from '@/components/dailog/notice-dialog/transfer-warning-dialog'
import monitorWarningDialog from '@/components/dailog/notice-dialog/monitor-warning-dialog'

export default{
    props: {
        currentItem: {
            default: () => {
                return {}
            }
        },
        noticeTypeDetailCode: String,
        businessId: Number,
        noticeId: Number,
        businessTable: String,
        showNoticeDailog: Boolean
    },
    components: {
        rolloverAuditDialog,
        customerEvidenceDialog,
        transferWarningDialog,
        monitorWarningDialog
    },
	data(){
        return{
            rolloverVisible: false,
            rolloverData: {},
            customerVisible: false,
            customerData: {},
            dialogBusinessId: '',
            transferWarningVisible: false,
            monitorInfo: {},
            monitorWarningVisible: false,
        }
	},
    watch: {
        'showNoticeDailog': {
            handler: function (val, oldVal) {
                if(val){
                    this.goToDetail();
                }
            },
            immediate: true,
            deep: true
        }
    },
	methods: {
		goToDetail() {
            var item = {
                businessId: this.businessId,
                noticeTypeDetailCode: this.noticeTypeDetailCode,
                id: this.noticeId,
                businessTable: this.businessTable
            }

            // 更新阅读状态
            this.$postRequest('/remind/personal/updateReadStatus', {
                id: item.id
            }).then(() => {
            })

            if (item.noticeTypeDetailCode === 'notice') {
                // 公告详情
                this.$router.push({
                    name: 'message-detail',
                    params: { id: item.businessId }
                })
                this.$parent.showNoticeDailog = false;
                this.$parent.handlePersonalFindList && this.$parent.handlePersonalFindList();
                this.$parent.handleResetTiming && this.$parent.handleResetTiming();
            }
            if (item.noticeTypeDetailCode === 'customer_evidence') {
                // 用户凭证
                this.$postRequest(
                    'customer/evidence/detail',
                    { id: item.businessId },
                    { showErrMsg: true }
                ).then(res => {
                    this.customerData = res.result || {}
                    this.customerVisible = true
                    this.$parent.showNoticeDailog = false;
                    this.$parent.handlePersonalFindList && this.$parent.handlePersonalFindList();
                    this.$parent.handleResetTiming && this.$parent.handleResetTiming();
                })
            }
            if (item.noticeTypeDetailCode === 'rollover_audit') {
                // 溢缴款转出审核
                this.$postRequest(
                    'crossHistory/findAuditView',
                    { id: item.businessId },
                    { showErrMsg: true }
                ).then(res => {
                    this.rolloverData = res.result || {}
                    this.rolloverVisible = true
                    this.$parent.showNoticeDailog = false;
                    this.$parent.handlePersonalFindList && this.$parent.handlePersonalFindList();
                    this.$parent.handleResetTiming && this.$parent.handleResetTiming();
                })
            }
            if (item.noticeTypeDetailCode === 'knowledge_examine') {
                // 知识文档审核
                this.$router.push({
                    name: 'document-verify-record'
                })
                this.$parent.showNoticeDailog = false;
                this.$parent.handlePersonalFindList && this.$parent.handlePersonalFindList();
                this.$parent.handleResetTiming && this.$parent.handleResetTiming();
            }
            if (item.noticeTypeDetailCode === 'knowledge_notice') {
                // 知识文档编辑
                this.$router.push({
                    path: `/knowledge-library/knowledge-document/${item.businessId}`
                })
                this.$parent.showNoticeDailog = false;
                this.$parent.handlePersonalFindList && this.$parent.handlePersonalFindList();
                this.$parent.handleResetTiming && this.$parent.handleResetTiming();
            }

             // 调度预警 调令
            if (item.noticeTypeDetailCode === 'stop_order' || item.noticeTypeDetailCode === 'publish_order') {
                this.dialogBusinessId = item.id
                this.transferWarningVisible = true

                this.$parent.showNoticeDailog = false;
                this.$parent.handlePersonalFindList && this.$parent.handlePersonalFindList();
                this.$parent.handleResetTiming && this.$parent.handleResetTiming();
            }

            // 调度预警 超过阈值
            if (/ONCE_VACATIONETTE_TIME_OUT|ONCE_IN_CALL_TIME_OUT|ONCE_OUT_CALL_TIME_OUT|ONCE_READY_TIME_OUT|ONCE_CALL_AFTER_TIME_OUT/.test(item.noticeTypeDetailCode)) {
                this.monitorInfo = this.currentItem
                this.monitorWarningVisible = true

                this.$parent.showNoticeDailog = false;
                this.$parent.handlePersonalFindList && this.$parent.handlePersonalFindList();
                this.$parent.handleResetTiming && this.$parent.handleResetTiming();
            }

            // 联合放款转自营
            if (item.noticeTypeDetailCode === 'jointloan_transfer') {
                this.$router.push({
                    name: 'proprietary-detail',
                    query: { id: item.businessId }
                })
                this.$parent.showNoticeDailog = false;
                this.$parent.handlePersonalFindList && this.$parent.handlePersonalFindList();
                this.$parent.handleResetTiming && this.$parent.handleResetTiming();
            }

            if(item.businessTable === 'exempt_apply'){
                this.$router.push({
                    path: `/business-manager/exemptions/${item.businessId}`
                })
                this.$parent.showNoticeDailog = false;
                this.$parent.handlePersonalFindList && this.$parent.handlePersonalFindList();
                this.$parent.handleResetTiming && this.$parent.handleResetTiming();
            }
        }
	}
}
</script>