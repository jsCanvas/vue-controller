export const state = ()=>{
    return {
      route : []
    }
  }
  
  // 将登录成功的数据赋值到userInfo里面
  export const mutations = {
    // 存登录成功的数据
      getRoute(state , data){
         state.route = data
      // console.log(state.userInfo)
      // console.log(data)
      }
  }
  
  // 异步请求
  export const actions={
    // 登录请求
    postRoute(store){
      return  this.$axios({
            url: "/hello",
            method: "get"
          }).then(res => {
            const {data} = res;
            console.log(data)
            // this.$store.commit('user/getData',res.data)
            store.commit('getRoute', data);
            // return data
          });
    }
  }
  
  