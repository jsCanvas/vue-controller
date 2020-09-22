
function nopagestr(model,path,api){
    let apikeys = Object.keys(api.params);
    let resdatas = api.res.datas;
    let reskeys = Object.keys(resdatas);
    let tabledata = [];
    let apirr = api.url.split('/');
    let star1 = apirr[apirr.length-2];
    let star2 = apirr[apirr.length-1];
    let tablearr = '';
    let thisdiaoyong = api.type+star1.slice(0,1).toUpperCase()+star1.slice(1)+star2.slice(0,1).toUpperCase()+star2.slice(1);
    let thisshujucangku = star1+star2.slice(0,1).toUpperCase()+star2.slice(1);
    if(resdatas instanceof Array){
        tabledata = resdatas;
    }else{
    for(let i in resdatas){
        if(resdatas[i] instanceof Array){
            tablearr = i;
            tabledata = resdatas[i];
            break;
        }
    };
    }
    let tableKeys = [];
    if(tabledata[0]){
        for(let i in tabledata[0]){
            if(tabledata[0][i] instanceof Object ){

            }else{
                tableKeys.push(i);
            }
        }
    }
    let strpage = `<template>
<!-- 模块: ${model}
path: ${path}
component: @/views/${model}-manager/${path}/index 
ref: ${model}-${path} -->
<div
    ref = "${model}-${path}"
    class = "${model}-${path} marginTop16 paddingRL16">
    <div class = "manager-form">
    <el-form ref = "form" 
	        size = "mini"
	        :inline = "true" 
	        :model = "form">
	        <el-row>
                <el-col :span = "12">
                ${(function(){let aoi = '' ;apikeys.map(item=>{
                    aoi+= `
            <el-form-item label = "${item}">
                    <el-input 
                        style = "width: 163px" 
                        v-model = "form.${item}" />
                </el-form-item>`}); return aoi;})()}
			     	
			    </el-col>
				<el-col :span = "8">
					<el-form-item>
					     <el-button 
					         @click = "${thisdiaoyong}"
					         size = "mini"
					         type = "primary">查询</el-button>
                         <el-button 
					         @click = "reset"
					         size = "mini"
					         type = "primary">重置</el-button>    
					</el-form-item>
				</el-col>
			</el-row>
		</el-form>
        </div>

        <el-table
        v-loading="initloading"
	    :data = "${tablearr?thisshujucangku+'.'+tablearr:thisshujucangku}"
	    size = "small"
	    style = "width: 100%">
		    <el-table-column
		        fixed
                type = "index"
		        label = "序号"
		        width = "60">
            </el-table-column>
            ${(function(){ let toar = '';tableKeys.map(item=>{
                toar+=`
        <el-table-column
            prop = "${item}"
            label = "${item}">
        </el-table-column>`}); return toar})()}
    </el-table>

    <div class = "footer-container">
        <paginator
            @on-page-size-change = "handleSizeChange"
            @on-current-page-change = "handleCurrentChange"
            :pageSize = "queryData.pageSize"
            :pageNum = "queryData.pageNum"
            :total = "${thisshujucangku}.size || 1">
        </paginator>
    </div>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@/utils/index.js' 
export default {
name:'${model}-${path}',
components: {
},
data() {
    return {
        initloading:false,
        form: {
            ${(function(){ foi = '' ;apikeys.map(item=>{
             foi+= `${item}: '',
`}); return foi})()}
        },
        tableData: [{"uniqueId":"tLD","startDate":1599709835,"endDate":1599709835,"autoPay":-8820872079645616,"memberFlag":false}],
        detailData: {},
        typePro: '',
        total: 0,
        instance: {},
        loginMessage: {},
        loading: false,
        queryData: {
            pageSize: 30,
            pageNum: 1
        }
    }
},
computed: {
    //数据源store
    ...mapGetters([
        '${thisshujucangku}'
    ]),
},
watch:{
},
mounted(){
    this.init();
},
filters: {
    formatDate(time) {
    var date = new Date(time);
    return utils.parseTime(date, "{y}-{m}-{d}");
    }
},  
methods: {
    async init(){
        //获取初始数据
        if(this.${thisshujucangku} && this.${thisshujucangku}.pageNum){
            this.queryData.pageSize = this.${thisshujucangku}.pageSize;
            this.queryData.pageNum = this.${thisshujucangku}.pageNum;
            return
        }
        await this.${thisdiaoyong}();
    },
    //数据方法
    ${thisdiaoyong}(page){
        var promise = new Promise( (resolve,reject) => { 
            // resolve(true)
            this.queryData =  Object.assign({},this.queryData,page||{});
            let params = Object.assign({},this.form,this.queryData);
            this.initloading = true;
            this.$store.dispatch('${api.modules}/${thisdiaoyong}',params).then(solve=>{
                this.initloading = false;
            }).catch(e=>{
                this.initloading = false;
            });
        })
        return promise;
    },
    reset(){
        for(let i in this.form){
            this.form[i] = ''
        };
        this.${thisdiaoyong}({
            pageSize: 30,
            pageNum: 1
        });
    },
    handleSizeChange(val){
        this.${thisdiaoyong}({
            pageNum: 1,
            pageSize: val
        })
    },
    handleCurrentChange(val){
        this.${thisdiaoyong}({
            pageNum: val
        })
    }
}
}
</script>

<style lang = "scss" scoped>

</style>`;
    return strpage;
};

module.exports = nopagestr;