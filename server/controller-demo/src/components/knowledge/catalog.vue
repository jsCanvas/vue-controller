<template>
        <el-tree 
                v-loading="loading"
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                :filter-node-method="filterNode"
                @node-click="cheskfloder"
                ref="tree">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                        <i style="color:orange" class="el-icon-folder-opened"></i> {{ node.label }}
                        <i style="color:green" :class="data.id==floderId?'el-icon-circle-check':''"></i>
                    </span>              
                </span>
        </el-tree>
</template>

<script>

export default {
    name: 'catalog',
    props: {
        filterText: String,
        isManage: Boolean
    },
    components: {
    },
    data() {
        return {
            loading: false,
            treeData: [
            ],
            defaultProps: {
                children: "children",
                label: "label"
            },
            floderId: null
        }
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    computed: {

    },
    created(){
        console.log('------------->created>>');
        this.floderId = null;
        this.queryTree();
    },
    activated(){
        console.log('------------->created>>');
        this.floderId = null;
        this.queryTree();
    },
    mounted(){
      
    },
    methods: {
        queryTree(){
        var self = this;
        self.loading=true;
        // this.queryData = Object.assign({}, this.queryTreeData, this.tagDealForm);
        return this.$postRequest('/knowledge/catalog/queryPage')
                .then(function(res){
                self.loading=false;
                if(res.code == '0'){
                     function mapArry(pid,pname,parr){
                         var arr = [];
                         parr.forEach((i)=>{
                             if(i.pid == pid){
                                 var item = {
                                    pname:pname,
                                    pid: pid,
                                    id: i.id,
                                    label: i.name,
                                    name: i.name,
                                    orderNum: i.orderNum,
                                    isInheritAuthority: i.isInheritAuthority,
                                    delStatus: i.delStatus,
                                    children: [],
                                    isAuth: i.isAuth || true
                                 }
                                 if(self.isManage){
                                    arr.push(item);
                                 }else if(pid != 0){
                                    arr.push(item);
                                 }else if(i.isAuth){
                                    arr.push(item);
                                 }
                               
                                 
                                 if(self.isManage){
                                    item.children = mapArry(item.id,item.name,parr);
                                 }else if(pid != 0){
                                    item.children = mapArry(item.id,item.name,parr);
                                 }else if(i.isAuth){
                                    item.children = mapArry(item.id,item.name,parr);
                                 }
                                //  item.children = mapArry(item.id,item.name,parr);
                             }
                         });
                         return arr;
                     }

                     self.treeData = mapArry(0,'知识库', res.result);
                    // self.tableData = (res.result && res.result.pageList) || [];
                    // self.count = (res.result && res.result.total) || 0;
                }
        }).catch(e=>{
                self.loading=false;
                    self.$message({
                        showClose: true,
                        message: e,
                        type: 'warning'
                    });
        })
        },
        cheskfloder(node){
            this.floderId = node.id;
            this.$emit('cheskfloder',node);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    }
}
</script>

<style lang = "scss" scoped>
.user-tag-dailog{
    .el-tag{
        margin-right: 9px;
        margin-bottom: 13px;
        background: #fff;
        height: 32px;
        line-height: 32px;
        border-radius: 20px;
        padding: 0 20px;
        cursor: pointer;
    }
}
</style>

