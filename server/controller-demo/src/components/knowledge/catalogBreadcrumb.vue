<template>
<el-tooltip placement="top" effect="light">
  <el-breadcrumb class="no-warp" slot="content" separator=">">
        <el-breadcrumb-item v-for="(item,ind) in treeArr" :key="ind">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb :style="link?'width:122px':''" separator=">">
        <el-breadcrumb-item v-for="(item,ind) in treeArr" :key="ind">{{item.name}}</el-breadcrumb-item>
    </el-breadcrumb>
</el-tooltip>
</template>

<script>

export default {
    name: 'catalogBreadcrumb',
    props: {
        filterText: String,
        isManage: Boolean,
        id:String,
        link:String
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
            floderId: null,
            treeArr:[],
            result:[]
        }
    },
    watch: {
        id (to, from) {
            if (to) {
                this.queryTree()
            }
        },
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    computed: {

    },
    created(){
        console.log('------------->created>>');
        this.queryTree();
    },
    activated(){
        console.log('------------->created>>');
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
                self.treeArr = [];
                if(res.code == '0'){
                     function mapArry(pid,pname,parr){
                         var arr = [];
                         parr.forEach((i)=>{
                             if(i.pid == pid){
                                 if(i.id == self.id){
                                     self.treeArr.unshift({id:i.id,name:i.name});
                                     if(pid != 0){
                                         self.treeArr.unshift({id:pid,name:pname});
                                     }else{
                                         self.treeArr.unshift({id:0,name:'知识库'});
                                     }
                                 }
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
                     self.result = res.result;
                     self.maptree(self.treeArr[0].id);
                    // self.tableData = (res.result && res.result.pageList) || [];
                    // self.count = (res.result && res.result.total) || 0;
                }
        }).catch(e=>{
                self.loading=false;
                    // self.$message({
                    //     message: e,
                    //     type: 'warning'
                    // });
        })
        },
        cheskfloder(node){
            this.floderId = node.id;
            this.$emit('cheskfloder',node);
        },
        maptree(ids){
            var self = this;
            if(this.treeArr[0].id !== 0){
              this.treeArr.splice(0,1);
              function mapArry(pid,pname,parr){
                         var arr = [];
                         parr.forEach((i)=>{
                             if(i.pid == pid){
                                 if(i.id == ids){
                                     self.treeArr.unshift({id:i.id,name:i.name});
                                     if(pid != 0){
                                         self.treeArr.unshift({id:pid,name:pname});
                                     }else{
                                         self.treeArr.unshift({id:0,name:'知识库'});
                                     }
                                 }
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
                         return false;
                     }
                     mapArry(0,'知识库', this.result);
                     self.maptree(self.treeArr[0].id);
                    
                }else{
                    return false;
                }
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
.el-tooltip__popper .el-breadcrumb{
     width: auto;
}
.el-breadcrumb {
    font-size: 12px;
    line-height: 1;
    width: auto;
    min-width: 122px;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    .el-breadcrumb__item{
        float: unset;
        display: inline-block;
    }
}
</style>

