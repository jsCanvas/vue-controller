var commonVue = {};
window.openConsole = 1
var VueLog = console.log
var VueErr = console.error
var VueWarn = console.warn

console.log = function(string){
	if(!window.openConsole){
		return
	}
    // log(string);
    VueLog.apply(null,  [].slice.apply(arguments))
}
console.error = function(warn){
	if(!window.openConsole){
		return
	}
    // err(warn)
    VueErr.apply(null,  [].slice.apply(arguments))
}
console.warn = function(warn){
	if(!window.openConsole){
		return
	}
    // err(warn)
    VueWarn.apply(null,  [].slice.apply(arguments))
}
commonVue.install = function (Vue, options) {
    Vue.mixin({
    	beforeRouteLeave(to, from, next){
    		var isClear = this.$store.state.tagsView.isClear,
    		    isChildren = this.$route.meta.isChildren || false;

    		if(isChildren){
    		}else{
                if(isClear){
                    console.log("+++++++++++++++++++++++++== shanch")
                    //this.$destroy();
                    this.$store.dispatch('tagsView/modifyClearStatus', false);
                }
            }
            next();
    	}
    })	
}

export default commonVue