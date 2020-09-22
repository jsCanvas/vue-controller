const mixin = {
    data() {
     return {
      routePath: ''
     }
    },
    mounted() {
     this.routePath = this.$route.path
    },
    computed: {
     visitedViews() {
      return this.$store.state.tagsView.visitedViews
     }
    },
    watch: {
     visitedViews(value) { 
         var  ok = false;
         for(let i in value){
            if(value[i].path == this.routePath){
                ok = true;
                break;
             }
         }  
      if(!ok){
       this.$destroy(this.$options.name)
      }
     }
    }
   }
   export default mixin