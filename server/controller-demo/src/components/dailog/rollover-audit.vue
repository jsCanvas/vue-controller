<template>
    <el-dialog title="溢缴款转出审核" :visible.sync="dialogVisible" width="35%" 
        @open="dialogVisibleChange(true)"
        @close="dialogVisibleChange(false)">
        <el-form ref="form" size="mini" :model="row">
            <el-form-item label="合同号：">{{row.contractNo}}</el-form-item>
            <el-form-item label="可用溢缴款额度：">{{row.rollOutAmount}}</el-form-item>
            <el-form-item label="溢缴款转出金额：">{{row.rollOutAmountPaid}}</el-form-item>
            <el-form-item label="审核状态：">
                <el-radio-group v-model="row.auditStatus">
                    <el-radio label="通过"></el-radio>
                    <el-radio label="拒绝"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-if="row.auditStatus === '拒绝'" label="拒绝原因：">
                <el-radio-group v-model="row.auditResult">
                    <el-radio label="提取金额大于溢缴款金额"></el-radio>
                    <el-radio label="错误提交"></el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="check" plain>确 认</el-button>
            <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'rollover-audit-dialog',
    props: {
        visible: '',
        info: {
            default: () => {
                return {}
            }
        }
    },
    components: {},
    data() {
        return {
            row: Object.assign({}, this.info),
            dialogVisible: this.visible
        }
    },
    computed: {},
    watch: {
        visible(to) {
            this.dialogVisible = to
        },
        info(to, from) {
            this.row = Object.assign({}, to)
        }
    },
    created() {},
    mounted() {},
    methods: {
        dialogVisibleChange(val) {
            this.$emit('visibleChange', val)
        },
        check() {
            if (!this.row.auditStatus) {
                this.$message({
                    showClose: true,
                    type: 'warning',
                    message: '请选择审核状态'
                })
            } else {
                if (this.row.auditStatus === '拒绝' && !this.row.auditResult) {
                    this.$message({
                        showClose: true,
                        type: 'warning',
                        message: '请选择拒绝原因'
                    })
                } else {
                    this.submit()
                }
            }
        },
        submit() {
            let data = {
                id: this.row.id,
                auditStatus: this.row.auditStatus
            }
            if (this.row.auditStatus === '拒绝') {
                data['auditResult'] = this.row.auditResult
            }
            this.$postRequest('/crossHistory/audit', data, {
                showErrMsg: true
            }).then(res => {
                this.$message({
                    showClose: true,
                    type: 'success',
                    message: res.message
                })
                this.dialogVisible = false
            })
        }
    }
}
</script>

<style scoped lang="scss">
</style>
