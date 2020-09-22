<template>
<el-dialog
    title = "用户标签"
    :visible.sync = "dialogVisible"
    width = "500px"
    :modal= false
    class = "user-tag-dailog"
    :loading = "loading"
    :before-close = "handleClose">
    <div>
        <el-tag
            v-for = "tag in tags"
            @click = "handleCurrentMarkTag(tag)"
            v-bind:style = "{ color: tag.color, border: '1px solid '+tag.color }"
            :key = "'workbench-user-tag-key'+tag.tagId">
            {{tag.tagName}}
        </el-tag>
    </div>
    <span slot = "footer" class = "dialog-footer">
        <el-button 
            size = "small"
            @click = "dialogVisible = false"
            plain>取 消</el-button>
    </span>
</el-dialog>
</template>

<script>

export default {
    name: 'userTag',
    props: {
        userTagPro: Object,
        mobile: String,
        recordNo: String,
        uniqueid: String,
        customerName: String
    },
    components: {
    },
    data() {
        return {
            dialogVisible: false,
            loading: true,
            tags: []
        }
    },
    watch: {
        'userTagPro': {
            handler: function(val, oldVal){
                this.dialogVisible = val.visiblePro || false;

                if(val.visiblePro){
                    this.handleGetTagList();
                }
            },
            immediate: true,
            deep: true
        },
        'mobile': {
            handler: function(val, oldVal){
                
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        handleGetTagList(){
            var self = this;

            self.$postRequest('/customerTag/customer/findManageTagList', {
                mobile: self.mobile
            }).then(function(res){
                if(res.code == '0'){
                    self.loading = false;
                    self.tags = (res.result && res.result) || [];
                }
            })
        },
        handleCurrentMarkTag(item){
            var self = this;
            self.$postRequest('/customerTag/customer/markTag',{
                tagId: item.tagId,
                mobile: self.mobile,
                recordNo: self.userTagPro && self.userTagPro.recordNo || '',
                lastTagNum: item.tagNum,
                uniqueId: self.uniqueid,
                cname: self.customerName
            }).then(function(res){
                if(res.code == '0'){
                    self.$message({
                        showClose: true,
                        message: '打标成功！',
                        type: 'success'
                    });
                    if(self.$parent.userTagPro){
                        self.$parent.userTagPro = Object.assign({}, self.$parent.userTagPro,{
                            visiblePro: false
                        })
                    }
                    self.$emit('handleTagSuccess')
                }else{
                    self.$message({
                        showClose: true,
                        message: res.message || '打标失败!',
                        type: 'warning'
                    });
                }
            }).catch( err =>{
                self.$message({
                    showClose: true,
                    message: err.message || '打标失败!',
                    type: 'warning'
                });
            })
        },
        handleClose(){
            this.dialogVisible = false;

            if(this.$parent.userTagPro){
                this.$parent.userTagPro = Object.assign({}, this.$parent.userTagPro,{
                    visiblePro: false
                })
            }
            
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

