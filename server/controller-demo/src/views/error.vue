<template>
    <div class = "workbench-error-container marginT24">
        <div class = "error-content clearfix">
            <div class = "error-img">
                <img src = "../assets/404_images/error.png"/>
            </div>
            <div class = "error-text">
                 <p class = "error-tips">抱歉！您所访问的页面不存在或没权限</p>
                 <p class = "error-btn">
                      <el-button type = "primary">
                         <router-link 
                            to = "/">返回首页</router-link> 
                        </el-button></p>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    
}
</script>

<style lang = "scss" scoped>

.workbench-error-container{
    background-color: rgb(235,240,245);
    min-height: calc(100vh - 145px);
    margin: 16px;
    .error-content{
         width: 590px;
         margin: 0 auto;
         padding-top: 100px;
        .error-img{
             width: 180px;
             height: 180px;
             float: left;
             img{
                 width: 100%;
             }
        }
        .error-text{
            float: right;
            .error-tips{
                padding-top: 35px;
                font-size: 22px;
                color: #303133;
            }
            .error-btn{
                margin-top: 20px;
            }
        }
    }
}
</style>
