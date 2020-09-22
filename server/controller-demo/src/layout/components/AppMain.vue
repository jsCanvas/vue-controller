<template>
    <section class="app-main">
        <tagsView/>
        <transition v-if="!isworkbrench" name="fade-transform" mode="out-in">
            <div :class = "[hasTags ? 'main-wrapper-with-tags' : 'main-wrapper-no-tags', 'scroll-bar']">
            <div style = "padding-bottom: 30px;">
                <!-- <keep-alive ref="alive" :include="cachedViews" :exclude="exclude"> -->
                    <router-view :key="key" />
                <!-- </keep-alive> -->
            </div>
            </div>
        </transition>
    </section>
</template>

<script>
import tagsView from './tags-view'
import router from '../../router'

export default {
    name: 'AppMain',
    components: {
        tagsView
    },
    data(){
        return {
            isworkbrench:false,
            workbrenchArr:[],
        }
    },
    computed: {
        hasTags(){
            return true;
        },
        exclude(){
            return this.$store.state.tagsView.exclude
        },
        cachedViews() {
            return this.$store.state.tagsView.cachedViews
        },
        key() {
            return this.$route.path
        }
    }
}
</script>

<style scoped>
.app-main {
    /*50 = navbar  */
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;
    padding: 0px;
    background-color: #fff;
}
.fixed-header+.app-main {
    padding-top: 50px;
}
.main-wrapper-with-tags {
    overflow-y: auto;
    height: calc(100% - 32px);
}
.main-wrapper-no-tags {
    overflow-y: auto;
    height: 100%;
}
</style>

<style lang="scss">
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
