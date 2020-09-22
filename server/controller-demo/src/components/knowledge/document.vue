<template>
    <div class="document-detail-container marginTop16">
        <el-header v-if="detail && document" class="headers-el">
            <el-row :gutter="20">
  <el-col :span="8"><div class="grid-content bg-purple grid-title">{{document.title}}</div></el-col>
  <el-col :span="8"><div class="grid-content bg-purple">
        <el-button
        size = "mini"
        :loading="downloading"
        @click="downDoc(document)"
        type = "primary">
            下载
        </el-button>
        <el-button
        size = "mini"
        disabled
        type = "primary">
            收藏
        </el-button>
        <el-button
        class = "copy-btn"
        @click="copy"
		    :data-clipboard-target="'#client-message-docid-'+document.id"
        size = "mini"
        type = "primary">
            复制知识ID
        </el-button>
        <span style="color:#ffffff;" class = "description" 
		    :id = "'client-message-docid-'+document.id">{{document.id}}</span>
      </div></el-col>
</el-row>
<el-row :gutter="20">
  <el-col :span="4"><div class="grid-content bg-purple">创建人：<el-tooltip placement="top" :content="document.createUserName" effect="light"><span>{{document.createUserName}}</span></el-tooltip> </div></el-col>
  <el-col :span="5"><div class="grid-content bg-purple">创建时间：<el-tooltip placement="top" :content="document.createTime" effect="light"><span>{{document.createTime}}</span></el-tooltip> </div></el-col>
  <el-col :span="4"><div class="grid-content bg-purple">修改人：<el-tooltip placement="top" :content="document.updateUserName" effect="light"><span>{{document.updateUserName}}</span></el-tooltip></div></el-col>
  <el-col :span="6"><div class="grid-content bg-purple">修改时间：<el-tooltip placement="top" :content="document.updateTime" effect="light"><span>{{document.updateTime}}</span></el-tooltip> </div></el-col>
</el-row>
<el-row :gutter="20">
  <el-col :span="4"><div class="grid-content bg-purple">阅读量：<span>{{document.readCount}}</span> </div></el-col>
  <el-col :span="5"><div class="grid-content bg-purple">收藏量：<span>{{document.favoriteNum}}</span> </div></el-col>
  <el-col :span="4"><div v-if="document.tagNames" class="grid-content bg-purple">标签：<el-tooltip placement="top" :content="document.tagNames" effect="light"><span>{{document.tagNames?document.tagNames:'--'}}</span></el-tooltip> </div></el-col>
  <el-col :span="document.referenceTitle1?6:10"><div class="grid-content bg-purple">知识点目录：<catalog-breadcrumb :link="document.referenceTitle1" :id="document.catalogId+''"></catalog-breadcrumb> </div></el-col>
  <el-col v-if="document.referenceTitle1" :span="5"><el-tooltip placement="top" effect="light"><div v-if="document.referenceTitle1" slot="content" class="grid-content bg-purple">关联链接：
    <span class="link-document" @click="goLink(document.referenceId1)">{{document.referenceTitle1}}</span>
    <span class="link-document" @click="goLink(document.referenceId2)">{{document.referenceTitle2}}</span>
    <span class="link-document" @click="goLink(document.referenceId3)">{{document.referenceTitle3}}</span> </div>
    <div v-if="document.referenceTitle1" class="grid-content bg-purple">关联链接：
    <span class="link-document" @click="goLink(document.referenceId1)">{{document.referenceTitle1}}</span>
    <span class="link-document" @click="goLink(document.referenceId2)">{{document.referenceTitle2}}</span>
    <span class="link-document" @click="goLink(document.referenceId3)">{{document.referenceTitle3}}</span> </div></el-tooltip></el-col>
</el-row>
        </el-header>
    <el-main class="main-document" v-if="document && document.ip">
        <iframe :style="'height:'+(height?height:500)+'px;'"   class="document-details" :src="doclink" frameborder="0"></iframe>
    </el-main>
    </div>
</template>

<script>
import store from '../../store';
import catalogBreadcrumb from './catalogBreadcrumb';
import { down } from '@/api/common';
export default {
    name: 'documentComponents',
    props: {
        id: String,
        detail: Boolean,
        isModify: Boolean,
        height: Number
    },
    components: {
      catalogBreadcrumb
    },
    data() {
        return {
            document: {},
            doclink: '',
            downloading:false
        }
    },
    watch: {
      id(val){
        console.log('docujkasdhakdhaksdhhask========>',val);
        this.getDoc();
      }
    },
    computed: {
    },
    created(){
       console.log('------------->created>>doc');
       this.getDoc();
    },
    activated(){
    },
    mounted(){
      console.log(this.height);
    },
    methods: {
        async getDoc(){
            if (!this.isModify) {
                // 当前已审核通过
                var doc =  await store.dispatch('knowledge/getDocument',{params:{id:this.id}});
                console.log('=============>compotent document',doc);
                this.document = doc;
                this.documentLink(doc);
            } else {
                // 当前修改中的
                this.$postRequest('/knowledge/point/findById', {id: this.id}).then(res => {
                    this.document = res.result
                    this.documentLink(res.result)
                })
            }
        },
        copy(){
          this.utils.copyFun();
        },
        goLink(id){
          this.$router.push({path:'/knowledge-library/knowledge-document/'+id
            })
        },
        documentLink(doc){
          if(doc.ip){
              if (!this.isModify) {
                  // 当前已审核通过
                  if (doc.ip.indexOf(doc.currentTargetFastdfsGroup) != -1){
                    this.doclink =  doc.ip + doc.currentTargetFastdfsName;
                  } else if (/MS01/.test(doc.ip)) {
                    var ip = doc.ip.split('MS01/')[0]
                    this.doclink = ip + doc.currentTargetFastdfsGroup+'/'+doc.currentTargetFastdfsName
                  } else {
                    this.doclink =  doc.ip + doc.currentTargetFastdfsGroup+'/'+doc.currentTargetFastdfsName
                  }
              } else {
                  // 当前修改中的
                  if (doc.ip.indexOf(doc.modifiedTargetFastdfsGroup) != -1){
                    this.doclink =  doc.ip + doc.modifiedTargetFastdfsName;
                  } else if (/MS01/.test(doc.ip)) {
                    var ip = doc.ip.split('MS01/')[0]
                    this.doclink = ip + doc.modifiedTargetFastdfsGroup+'/'+doc.modifiedTargetFastdfsName
                  } else {
                    this.doclink =  doc.ip + doc.modifiedTargetFastdfsGroup+'/'+doc.modifiedTargetFastdfsName
                  }
              }
          }
          this.$emit('getdoclink',this.doclink);

          console.log(this.doclink);
          
        },
         downDoc(doc){
            var self = this;
            self.downloading = true;
            down({
                fileName: doc.currentFileName,
                fileRelativePath:  doc.currentFilePath,
                fastDFSDocFileGroup: doc.currentOriginalFastdfsGroup,
                fastDFSHtmlFileGroup: doc.currentTargetFastdfsGroup,
                fastDFSDocFileName: doc.currentOriginalFastdfsName,
                fastDFSHtmlFileName: doc.currentTargetFastdfsName
            }).then( res => {
  let blob = new Blob([res], {type: res.type})
  let downloadElement = document.createElement('a')
  let href = window.URL.createObjectURL(blob); //创建下载的链接
  downloadElement.href = href;
  downloadElement.download =  doc.currentFileName;; //下载后文件名
  document.body.appendChild(downloadElement);
  downloadElement.click(); //点击下载
  document.body.removeChild(downloadElement); //下载完成移除元素
  window.URL.revokeObjectURL(href); //释放blob对象
  self.downloading = false;
      
 });
        },
        // downDoc(doc){
          // var doclink = '';
          // if(doc.ip){
          // if(doc.ip.indexOf(doc.currentOriginalFastdfsGroup) != -1){
          //   doclink =  doc.ip + doc.currentOriginalFastdfsName;
          // }else if(/MS01/.test(doc.ip)){
          //   var ip = doc.ip.split('MS01/')[0]
          //   doclink = ip + doc.currentOriginalFastdfsGroup+'/'+doc.currentOriginalFastdfsName
          // }else{
          //   doclink =  doc.ip + doc.currentOriginalFastdfsGroup+'/'+doc.currentOriginalFastdfsName
          // }
          // }

          // console.log(doclink);
          // var downa = document.createElement('a');
          // downa.href = doclink;
          // downa.download = doc.currentFileName;
          // downa.click();

        // }
    }
}
</script>

<style lang = "scss" scoped>
.document-details{
      display: block;
      width: 100%;
      height: 500px;
      background: #ffffff;
  }
  .main-document{
      background: #d3dce6;
      padding: 0;
  }
  .el-row {
    margin-bottom: 6px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    /* background: #d3dce6; */
    line-height: 36px;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    color: #99a9bf;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    span{
      color: #444444;
    }
  }
  .grid-content.grid-title{
    color: #444444;
    font-size: 16px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .headers-el{
      height:140px!important;
      border: 1px solid #eee;
      border-top:none;
  }
  .link-document{
    color: #409eff!important;
    cursor: pointer;
  }
  .link-document:hover{
    text-decoration: underline;
  }
</style>

