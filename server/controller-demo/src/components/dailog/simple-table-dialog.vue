<template>
    <div>
        <el-dialog
        :title="title"
        :visible.sync="show"
        :width="width"
        @close="dialogVisible(false)"
    >
        <el-table :data="tableData" :height="height" v-loading="loading">
            <el-table-column
                v-if="hasTableIndex"
                type="index"
                label="序号"
                :index="(index) => {return index + 1}"
                width="80"
            ></el-table-column>
            <el-table-column
                v-for="(item, index) in tableColumns"
                :key="index"
                :prop="item.prop"
                :label="item.label"
                :width="item.width"
                :show-overflow-tooltip="item.tooltip"
            />
        </el-table>
        <p v-if="title==='溢缴款明细'" class="tips">注：如下记录代表超36%的费用转溢交款成功，但此记录并不代表用户提取溢交款成功。</p>
        <p v-if="title==='寿险投保记录'" class="tips">注：此处仅能查询2018-9-27日之后的投保记录。</p>
        <div class="dialog-paginator" v-if="showPage">
            <paginator
                :total="pageInfo.total"
                :pageNum="pageInfo.pageNum"
                :pageSize="pageInfo.pageSize"
                @on-page-size-change="pageSizeChange"
                @on-current-page-change="currentPageChange"
            />
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible(false)">关 闭</el-button>
        </span>
    </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'simple-table-dialog',
    props: {
        visible: '',
        title: String,
        width: {
            default: '40%',
            type: String
        },
        height: {
            default: 300,
            type: Number
        },
        tableColumns: {
            default: () => {
                return []
            },
            type: Array
        },
        tableData: {
            default: () => {
                return []
            },
            type: Array
        },
        hasTableIndex: {
            default: false,
            type: Boolean
        }, // 是否显示表格序号
        loading: {
            default: false,
            type: Boolean
        },
        showPage: {
            default: false,
            type: Boolean
        }, // 是否分页
        pageInfo: {
            default: {
                total: 0,
                pageSize: 10,
                pageNum: 1,
                method: ''
            },
            type: Object
        }
    },
    components: {},
    data() {
        return {
            show: this.visible,
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
        },
        currentPageChange(val) {
            this.$emit('currentPagechange', val)
        },
        pageSizeChange(val) {
            this.$emit('pageSizeChange', val)
        }
    }
}
</script>

<style scoped lang="scss">
@import '@/styles/rule-variables.scss';
.tips {
    margin: 16px 0;
    color: $tipsTextColor;
    font-size: 14px;
}
.dialog-paginator {
    text-align: right;
}
</style>
