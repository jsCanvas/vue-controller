<template>
    <el-pagination
        ref = "workbench-pagination"
        class = "page-container"
        @current-change = "currentPageChange"
        @size-change = "pageSizeChange"
        layout = "total, sizes, prev, pager, next, jumper, slot"
        :page-sizes = "[10, 30, 50, 100]"
        :total = "total"
        :page-size = "pageSize"
        :current-page = "pageNum">
        <el-button 
            size = "mini"
            class = "jumper-btn"
            @click = "handleJumperBtn"
            type = "primary">跳转</el-button>
    </el-pagination>
</template>

<script>
export default {
    name: 'paginator',
    props: {
        total: '',
        pageSize: '',
        pageNum: ''
    },
    components: {},
    data() {
        return {}
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {
        currentPageChange(val) {
            this.$emit('on-current-page-change', val)
        },
        pageSizeChange(val) {
            this.$emit('on-page-size-change', val)
        },
        handleJumperBtn(){
            var parent = this.$refs['workbench-pagination'],
                childrenItem = null,
                childrenLen = parent.$children.length;

            for(var i = 0; i < childrenLen; i++){
                childrenItem = parent.$children[i];

                if(childrenItem.handleKeyup){
                    childrenItem.handleChange(childrenItem.$parent.currentPage);
                    break;
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
.page-container{
    .jumper-btn{
        margin-left: 10px;
        &:hover{
            color: #fff !important;
        }
    }
}
</style>
