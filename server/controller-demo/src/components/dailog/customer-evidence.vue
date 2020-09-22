<template>
    <el-dialog
        title="凭证详情"
        :visible.sync="dialogVisible"
        width="500px"
        @open="dialogVisibleChange(true)"
        @close="dialogVisibleChange(false)"
    >
        <el-form :model="dialogData" ref="evidenceForm" label-width="110px">
            <el-form-item label="凭证描述">
                <p>{{ dialogData.description || ''}}</p>
            </el-form-item>
            <el-form-item label="附件">
                <p v-for="(item, index) in dialogData.list" :key="index">
                    <a
                        target="_blank"
                        style="color: #4c7ee9;"
                        :href="origin+'/customer/evidence/download?id='+item.id"
                    >{{ item.fileName }}</a>
                </p>
            </el-form-item>
            <el-form-item label="UUID">
                <p
                    style="color: #4c7ee9;cursor: pointer;"
                    @click="handleClientPage"
                >{{ dialogData.uniqueid || ''}}</p>
            </el-form-item>
            <el-form-item label="接收短信手机号">
                <p>{{ dialogData.mobile || ''}}</p>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">关闭</el-button>
        </span>
    </el-dialog>
</template>

<script>
export default {
    name: 'customer-evidence-dialog',
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
            dialogData: Object.assign({}, this.info),
            dialogVisible: this.visible
        }
    },
    computed: {
        origin() {
            return `${window.location.origin}${process.env.VUE_APP_BASE_API}`
        }
    },
    watch: {
        visible(to) {
            this.dialogVisible = to
        },
        info(to, from) {
            this.dialogData = Object.assign({}, to)
        }
    },
    created() {},
    mounted() {},
    methods: {
        dialogVisibleChange(val) {
            this.$emit('visibleChange', val)
        },
        handleClientPage() {
            if (this.dialogData.uniqueid) {
                this.$router.push({
                    path: '/client-manager/index/' + this.dialogData.uniqueid
                })
                this.$emit('visibleChange', false)
            }
        }
    }
}
</script>

<style scoped lang="scss">
</style>
