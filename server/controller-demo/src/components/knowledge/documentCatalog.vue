<template>
        <el-tree 
                v-loading="loading"
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                :filter-node-method="filterNode"
                :load="loadNode"
                @node-click="cheskfloder"
                lazy
                ref="tree">
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                        <i :style="data.currentFileName?'color:blue':'color:orange'" 
                        :class="data.currentFileName?'el-icon-document':'el-icon-folder-opened'"></i> {{ node.label }}
                        <i style="color:green" :class="data.id==floderId?'el-icon-circle-check':''"></i>
                    </span>              
                </span>
        </el-tree>
</template>

<script>

export default {
    name: 'documentCatalog',
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
            flooer:[],
            defaultProps: {
                children: "children",
                label: "label",
                isLeaf: 'leaf'
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
        console.log('------------->created>>doccatalog');
        this.queryTree();
    },
    activated(){
        console.log('------------->created>>doccatalog');
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
                     console.log(res);
                     function mapArry(pid,parr){
                         var arr = [];
                         parr.forEach((i)=>{
                             if(i.pid == pid){
                                 var item = {
                                    pid: pid,
                                    id: i.id,
                                    label: i.name,
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
                                    item.children = mapArry(item.id,parr);
                                 }else if(pid != 0){
                                    item.children = mapArry(item.id,parr);
                                 }else if(i.isAuth){
                                    item.children = mapArry(item.id,parr);
                                 }
                                
                             }
                         });
                         return arr;
                     }

                     self.treeData = mapArry(0, res.result);
                     self.flooer =  self.treeData;
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
        queryFloor(id){
        var self = this;
        return this.$postRequest('/knowledge/point/queryPage',{catalogId: id})
                .then(function(res){
                if(res.code == '0'){
                    // console.log(res);
                    return res.result.pageList;
                    // self.tableData = (res.result && res.result.pageList) || [];
                    // self.count = (res.result && res.result.total) || 0;
                }
        }).catch(e=>{
                    self.$message({
                        showClose: true,
                        message: e,
                        type: 'warning'
                    });
                    return [];
        })
    },
        cheskfloder(node){
            this.floderId = node.id;
            this.$emit('cheskfloder',node);
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },
        async loadNode(node, resolve) {
        var atrr = [];
        if(!node.data.children){
            return;
        }
        atrr = node.data.children || [];
        
        atrr.forEach((item)=>{
            item.leaf = false;
        });
        // if (node.level > 1) return resolve([]);

        var docarr = await this.queryFloor(node.data.id);
        console.log('---------===========',docarr);
        docarr.forEach((item)=>{
            item.leaf = true;
            item.label = item.title;
        });
        atrr = atrr.concat(docarr);

        resolve(atrr);
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
.filter-tree{
    height: 500px;
    max-height: 500px;
    overflow-y: auto;
}
</style>

