<template>
    <el-tree
        class ="filter-tree"
        :data ="treeData"
        highlight-current
        node-key="orgName"
        default-expand-all
        :filter-node-method="filterNode"
        @node-click ="handleCheckChange"
        ref = "tree">
        <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                        <!-- <i style="color:orange" class="el-icon-folder-opened"></i>  -->
                        {{ node.label }}
                        <i style="color:green" :class="selectList(data)?'el-icon-circle-check':''"></i>
                    </span>              
        </span>
    </el-tree>
            
</template>

<script>
export default {
    data() {
        let validatorOrgCode = (rule, value, cb) => {
            if(value){
                if(/[\u4E00-\u9FFF]/.test(value)){
                    cb(new Error('组织编码不能有汉字'));
                }else{
                    cb();
                }
            }else{
                cb(new Error('请输入组织编码'));
            }
        }
        return {
            labelPosition: 'right',
            type: 'show',
            isEdit: true,
            treeData: [],
            treeDetail: {},
            optionsLength: 1,
            tempDetail: {},
            seqArr: [],
            treeRules:{
                orgCode: [{ 
                    required: true, 
                    validator: validatorOrgCode,
                    trigger: 'blur' }],
                orgName: [{ 
                    required: true, 
                    message: '请输入组织名称', 
                    trigger: 'blur' }]
            }
        }
    },
    props: {
        filterText: String,
        selectOrg: Array 
    },
    watch: {
        filterText(val) {
            this.$refs.tree.filter(val);
        }
    },
    created(){
        this.queryOrganizationList();
    },
    mounted(){
        
    },
    methods: {
        selectList(item){
            // console.log('--=-==-=-=-=-99990000',list);
            if(this.selectOrg){
            var isck = false;
            this.selectOrg.forEach(data=>{
                if(data.orgName == item.orgName){
                    isck = true;
                }
            });
            return isck;
             }else{
                 return false;
             }
        },
        queryOrganizationList(sel){
            var self = this;
             
            this.$ajax({
                url: '/org/list',
                method: 'post'
            }).then(function(res){
                self.treeData = [];
                if(res.result && res.result.length){
                    self.treeData = res.result.map(function(item, index){
                        item.label = item.orgName;
                        item.orgId = item.id;

                        if(item.children && item.children.length){
                            self.children = self.adapterTreeData(item.children);
                        }
                        return item;
                    })
                    self.treeDetail = Object.assign({}, self.treeDetail, res.result[0]);
                }
            })
        },
        adapterTreeData(item) {
            var self = this;

            return item && item.map(function(itemMap, index){
                itemMap.label = itemMap.orgName;
                itemMap.orgId = itemMap.id;
                if(itemMap.children && itemMap.children.length){
                    itemMap.children = self.adapterTreeData(itemMap.children);
                }
                return itemMap;
            })
        },

        adapterTreeParent(parentId){
            var parentName = '',
                self = this;
            
            if(parentId){
                for(var i = 0; i < self.treeData.length; i++){
                    if(self.treeData[i].id == parentId){
                        parentName = self.treeData[i].orgName;
                        break;
                    }else if (self.treeData[i].children) {
                       parentName = self.adapterTreeParentByChildren(parentId,self.treeData[i].children)

                       if(parentName){
                           break;
                       }
                    }
                }
            }
            return parentName;
        },
        adapterTreeParentByChildren(id, item){
            var parentName = '';

            if(id){
                for(var i = 0; i< item.length; i++){
                    if(item[i].id == id){
                        parentName = item[i].orgName;
                        break;
                    }else if(item[i].children){
                        parentName = this.adapterTreeParentByChildren(id,item[i].children)

                        if(parentName){
                            break;
                        }
                    }
                }
            }
            return parentName;
        },
        adapterOneLevelData(){
            var currentLevel = this.treeDetail.orgLevel,
                parentId = this.treeDetail.parentId,
                id = this.treeDetail.id,
                self = this;

            self.treeData.forEach(function(item, index){
                if(id == item.parentId){
                    self.seqArr.push(item)
                }else if(item.children){
                    self.adapterOneLeveChildren(item.children || [], id);
                }

            })
        },
        adapterOneLeveChildren(childrenArr, id){
            var self = this;

            childrenArr.forEach(function(item, itemIndex){
                if(id == item.parentId){
                    self.seqArr.push(item)
                }else if(item.children){
                    self.adapterOneLeveChildren(item.children || [], id);
                }
            })
        },
        handleClickNode(node) {
            this.type = 'show';
            this.isEdit = true;
            this.seqArr = [];
            this.adapterOneLevelData();
            this.optionsLength = this.seqArr.length+1;
            // this.$refs['organizationForm'].resetFields();
            this.treeDetail = Object.assign({}, this.treeDetail, node);
            this.tempDetail = Object.assign({}, this.tempDetail, node)
        },
        handleCheckChange(data) {
            console.log(data);
            this.$emit('handleCheckChange',data);
        },
        handleAddOrganizationBtn() {
            this.isEdit = false;
            this.type = 'add';

            this.seqArr = [];
            this.adapterOneLevelData();
            this.optionsLength = this.seqArr.length+1;

            this.treeDetail = Object.assign({},this.treeDetail,{
                orgCode: '',
                orgName: '',
                orgLevel: this.treeDetail.orgLevel+1,
                parentId: this.treeDetail.id,
                seq: this.optionsLength
            })
        },
        handleEditOrganizationBtn(){
            var self = this,
                parentId = this.treeDetail.parentId;

            this.isEdit = false;
            this.type = 'edit';
            this.optionsLength = 0;

            this.treeData.forEach(function(item){
                if(item.parentId == parentId){
                    self.optionsLength = self.optionsLength+1
                }else if(item.children){
                    self.handleEditOptionLen(item.children, parentId)
                }
            })
        },
        handleEditOptionLen(arr, parentId){
            var self = this;

            arr.forEach(function(item){
                if(item.parentId == parentId){
                    self.optionsLength = self.optionsLength+1
                }else if(item.children){
                    self.handleEditOptionLen(item.children, parentId)
                }
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        }
    }
}
</script>

<style lang = "scss" scoped>
.organization-manager-container{
    .tree-contianer{
        border-right: 1px solid #EBEEF5;
    }
    .tree-edit{
        padding: 0px 0 20px 20px;
        .tree-title-container{
            h1{
                font-size: 16px;
                font-weight: bold;
            }
            .btn-contianer{
                text-align: right;
            }
        }
    }
}
.filter-tree{
        height: 500px;
        overflow-y: auto;
    }
</style>

