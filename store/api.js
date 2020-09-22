export const state = ()=>{
    return {
      api : []
    }
  }
  
  // 将登录成功的数据赋值到userInfo里面
  export const mutations = {
    // 存登录成功的数据
      getApi(state , data){
         state.api = data
      // console.log(state.userInfo)
      // console.log(data)
      }
  }
  
  // 异步请求
  export const actions={
    // 登录请求
    postApi(store){
      return  this.$axios({
            url: "/api",
            method: "get"
          }).then(res => {
            const {data} = res;
            console.log(data)
            // this.$store.commit('user/getData',res.data)
            store.commit('getApi', data);
            // return data
          });
    },
    addApi(store,data){
      return  this.$axios({
        url: "/addapi",
        method: "post",
        data: data
      }).then(res => {
        const {data} = res;
        console.log(data)
        // this.$store.commit('user/getData',res.data)
        // store.commit('getApi', data);
        // return data
      });
    },
    addPage(store,data){
      return  this.$axios({
        url: "/addpage",
        method: "post",
        data: data
      }).then(res => {
        const {data} = res;
        console.log(data)
        // this.$store.commit('user/getData',res.data)
        // store.commit('getApi', data);
        // return data
      });
    },
  }
  
  