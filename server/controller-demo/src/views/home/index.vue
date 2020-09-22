<template>
    <div class = "dashboard-container">
        welcome
    </div>
</template>

<script>
// import { mapGetters } from 'vuex'

export default {
    name: 'Dashboard',
    // computed: {
    //     visitedViews() {
    //         return this.$store.state.tagsView.visitedViews
    //     },
    //     isClose(){
    //         return this.$route.query.isClose;
    //     }
    // },
    activated(){
        //console.log("++++++++++++ this created:",this);
       // console.log("+++++ this.$parent：",this.$parent);
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
