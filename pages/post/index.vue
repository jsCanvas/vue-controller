<template>
  <div class="post">
      <el-collapse accordion>
  <el-collapse-item v-for="(item,index) in apiList" :key="index">
    <template slot="title">
      <div class="api-item">接口说明：<span>{{item.name}}</span></div>
      <div class="api-item">url地址：<span>{{item.url}}</span></div>  
      <div class="api-item">请求方式：<span>{{item.type}}</span></div>
    </template>
    <div style="line-height: 40px;border-top: 1px solid #ddd;">
      <div style="display:inline-block" class="api-item">wiki：<span>{{item.wiki}}</span></div>
      <div style="display:inline-block" class="api-item">所属模块：<span>{{item.modules}}</span></div>
      <div style="display:inline-block" class="api-item"><el-button sizi="mini" @click="editoes(index)">编辑</el-button></div>
    </div>
    <div style="border-top:1px solid #ddd" class="api-params">入参：
      <p v-for="(sub,ind) in Object.keys(item.params)" :key="ind">
        <span style="width:20%;display:inline-block;">字段：{{sub}}</span>
        <span style="width:40%;display:inline-block;" v-if="item.params[sub]">说明：{{item.params[sub].text}}</span>
        <span style="width:30%;display:inline-block;" v-if="item.params[sub]">参考值：{{item.params[sub].value}}</span>
      </p>
    </div>
    <div style="border-top:1px solid #ddd">mock返回值：</div>
    <MonacoEditor
        height="500"
        language="json"
        theme="vs-dark"
        @mounted="onMounted"
        @codeChange="onCodeChange(item,index)"
        :code="JSON.stringify(item.res)"
        :changeThrottle="500"
        >

    </MonacoEditor>
    <!-- <div ref="container" style="background:#f6f7f8;" :id="'monaco-'+index"></div> -->
  </el-collapse-item>
</el-collapse>
  </div>
</template>

<script>
import MonacoEditor from '@/components/vue-monaco-editor/src/Monaco'
export default {
  components: {
     MonacoEditor
  },
  data(){
    return {
      monacoInstance:[],
      editor:null
    }
  },
  computed:{
    apiList(){
      return this.$store.state.api.api;
    }
  },
   mounted(){
     this.$store.dispatch('api/postApi').then(() =>{
    })
   },
   methods:{
     onMounted(editor){
        console.log(editor);   
        // editor.trigger('','editor.action.format');
        if(!this.monacoInstance.includes(editor)){
           this.monacoInstance.push(editor);
        }
       
     },
      onCodeChange(eitor,tem,index){

      },
      editoes(ind){
        this.monacoInstance[ind].updateOptions({
          readOnly: false //是否只读
        });
      } 
   }
}
</script>

<style>
  .post{
    padding: 16px;
    text-align: left;
  }
  .el-collapse-item__header{
    text-indent: 2em;
  }
  .el-collapse-item__content{
    padding: 10px;
  }
  .api-item{
    margin-right: 10px;
    width: 15%;
  }
  .api-item:nth-child(1){
    width: 45%;
  }
  .api-item:nth-child(2){
    width: 30%;
  }
  .api-item span{
      background:#f6f7f8;
      padding: 5px;
    }
  .api-params{
    background:#f6f7f8;
  }
  .monaco-editor,.monaco-editor>div{
    min-height: 500px!important;
  }
  .monaco-scrollable-element{
    min-height: 19px!important;
  }
  /* .monaco-editor div{
    min-height: 19px!important;
  } */

</style>