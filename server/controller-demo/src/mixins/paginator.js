export default {
    data: function () {
        return {
            pageSize: 10,
            total: 0,
            pageNum: 1
        }
    },
    mounted() {
        if (!this.noPageInitData) {
            this.getPageData()
        }
    },
    methods: {
        initPaginator({ total = 0, pageSize = 10} = {}) {
            this.total = total
            this.pageSize = this.pageSize ? this.pageSize : pageSize
        },
        currentPageChange(val) {
            this.pageNum = val
            this.getPageData()
        },
        pageSizeChange(val) {
            this.pageSize = val
            this.pageNum = 1
            this.getPageData()
        },
        getPageData(){
            this.pageMethod ? this[this.pageMethod]() : ''
        }
    }
}
