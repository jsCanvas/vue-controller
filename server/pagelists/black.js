
function nopagestr(model,path,api){
    let strpage = `<template>
<!-- 模块: ${model}
path: ${path}
component: @/views/${model}-manager/${path}/index 
ref: ${model}-${path} -->
<div
    ref = "${model}-${path}"
    class = "${model}-${path} marginTop16 paddingRL16">
    ${model}-${path}
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
            uniqueId: '',
            mobile: ''
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
    //...mapGetters([
    //    
    //]),
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
        //await this.get...();
    },
    //数据方法
    //getMemberList(page){
    //    var promise = new Promise( (resolve,reject) => { 
    //        // resolve(true)
    //        this.queryData =  Object.assign({},this.queryData,page||{});
    //        let params = Object.assign({},this.form,this.queryData);
    //        this.initloading = true;
    //        this.$store.dispatch('member/getMemberList',params).then(solve=>{
    //            this.initloading = false;
    //        }).catch(e=>{
    //            this.initloading = false;
    //        });;
    //    })
    //    return promise;
    //},
    handleSizeChange(val){
        this.getMemberList({
            pageNum: 1,
            pageSize: val
        })
    },
    handleCurrentChange(val){
        this.getMemberList({
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