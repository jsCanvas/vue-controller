<template>
    <div>
        <el-dialog title="消息详情" :visible.sync="show" @close="dialogVisible(false)">
            <el-form ref="form" :model="info">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="消息标题：">{{info.remindTitle}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="备注：">{{info.remark}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="消息分类：">{{info.noticeTypeName}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="消息事件名称：">{{info.noticeTypeDetailName}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="消息发布人：">{{info.createName}}</el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提醒类型：">
                            {{info.remindType === 1 ? '消息提醒' : '' }}
                            {{info.remindType === 2 ? '强制阅读' : '' }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提醒时间：">{{info.remindStartTime}}</el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible(false)">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'monitor-warning-dialog',
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
            show: this.visible
        }
    },
    computed: {},
    watch: {
        visible(to) {
            this.show = to
        }
    },
    created() {},
    mounted() {},
    methods: {
        dialogVisible(val) {
            this.$emit('visibleChange', val)
        }
    }
}
</script>

<style scoped lang="scss">
</style>
