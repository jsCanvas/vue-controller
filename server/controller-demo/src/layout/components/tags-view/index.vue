<template>
<div id = "tags-view-container" 
     class = "tags-view-container"
     v-bind:class="{ 'tag-padding': scrollable }">
    <span 
         v-if = "scrollLeft"
         @click = "handleScrollLeft"
         :class = "'tag-nav tag-left '+scrollLeftCls">
         <i class="el-icon-arrow-left"></i></span>
    <span 
         v-if = "scrollRight"
         @click = "handleScrollRight"
         :class = "'tag-nav tag-right '+scrollRightCls">
         <i class = "el-icon-arrow-right"></i></span>
    <scroll-pane ref = "scrollPane" class = "tags-view-wrapper">
        <router-link
            v-for = "tag in visitedViews"
            ref = "tag"
            :key = "tag.path"
            :class = "[isActive(tag)?'active':'', {'tags-view-item-only': visitedViews.length==1}]"
            :to = "{ path: tag.path, query: tag.query, fullPath: tag.fullPath, regex: tag.regex }"
            tag = "span"
            class = "tags-view-item"
            @click.middle.native = "!isAffix(tag)?closeSelectedTag(tag):''"
            @contextmenu.prevent.native = "openMenu(tag,$event)">
                <div class = "tags-container">
                    {{ tag.meta.matchedTitle || tag.title }}
                    <span v-if = "!isAffix(tag)"
                        class = "el-icon-close"
                        @click.prevent.stop = "closeSelectedTag(tag)" />
                </div>
        </router-link>
    </scroll-pane>
    
    <ul v-show = "visible"
        :style = "{left:left+'px',top:top+'px'}"
        class = "contextmenu">
<!--         <li @click = "refreshSelectedTag(selectedTag)">刷新</li> -->
        <li v-if = "!isAffix(selectedTag)"
            @click = "closeSelectedTag(selectedTag)">关闭</li>
        <li @click = "closeOthersTags(selectedTag)">关闭其它页面</li>
        <li @click = "closeAllTags(selectedTag)">关闭所有</li>
    </ul>
</div>
</template>

<script>
import ScrollPane from './scroll-pane'
import path from 'path'
import { mapGetters } from 'vuex'
import dispatch from '../../../mixins/mon.js'
export default {
    components: {
        ScrollPane
    },
    mixins: [dispatch],
    data() {
        return {
            visible: false,
            top: 0,
            left: 0,
            scrollable: false,
            scrollLeft: false,
            scrollRight: false,
            scrollLeftCls: '',
            scrollRightCls: '',
            selectedTag: {},
            affixTags: []
        }
    },
    computed: {
        ...mapGetters([
        ]),
        iccData(){
            return this.$store.state.icclogic.iccLogicArr;
        },
        visitedViews() {
            return this.$store.state.tagsView.visitedViews
        },
        currentError(){
            return this.$store.state.tagsView.currentError
        },
        cacheError() {
            return this.$store.state.tagsView.cacheError
        },
        routes() {
            return this.$store.state.user.menu
        },
        tabName() {
            return this.$route.query.time
        },
        clearOther(){
            return this.$store.state.tagsView.clearOther
        }
    },
    watch: {
        '$route.path': {
            handler: function(val, oldVal){
                this.addTags()
                this.moveToCurrentTag()
            },
            immediate: true,
            deep: true
        },
        visible(value) {
            if (value) {
                 document.body.addEventListener('click', this.closeMenu)
            } else {
                 document.body.removeEventListener('click', this.closeMenu)
            }
        },
        clearOther(val){
            if(val){
                this.selectedTag = this.$route;
                this.closeOthersTags(this.selectedTag);
                this.$store.commit("tagsView/MODIFY_CLEAR_OTHER_STATUS",false);
            }
        }
    },
    mounted() {
        this.initTags()
        this.addTags()
        this.listeningTags()
    },
    updated(){
        this.$refs.scrollPane.update()
    },
    methods: {
        handleScrollLeft(){
            this.$refs.scrollPane.scrollLeft()
        },
        handleScrollRight(){
            this.$refs.scrollPane.scrollRight()
        },
        isActive(route) {
            var self = this,
                isActive = (route.path === self.$route.path);

            if(!isActive){
                if(self.$route.path == '/error' && self.tabName){
                    return route.path == self.currentError.path;
                }else if(self.$route.meta && self.$route.meta.isNewTab == false){
                    if(route.name == self.$route.meta.matchedName){
                        if(route.path == self.$route.path){
                            isActive = true;
                        }
                    }
                }
            }
            return isActive
        },
        isAffix(tag) {
            return tag.meta && tag.meta.affix
        },
        filterAffixTags(routes, basePath = '/') {
            let tags = []
            routes.forEach(route => {
                if (route.meta && route.meta.affix) {
                    const tagPath = path.resolve(basePath, route.path)
                    tags.push({
                        fullPath: tagPath,
                        path: tagPath,
                        name: route.name,
                        meta: { ...route.meta }
                    })
                }
                if (route.children) {
                    const tempTags = this.filterAffixTags(route.children, route.path)
                    if (tempTags.length >= 1) {
                        tags = [...tags, ...tempTags]
                    }
                }
            })
            return tags
        },
        initTags() {
            const affixTags = this.affixTags = this.filterAffixTags(this.routes)
            for (const tag of affixTags) {
                if (tag.name) {
                    this.$store.dispatch('tagsView/addVisitedView', tag)
                }
            }
        },
        addTags() {
            const { name, meta, path } = this.$route
            var self = this,
                deleteArr = [];
            
            
            if(meta && meta.isNewTab == false){
                if(meta && meta.matchedName){
                    var matchedPath = meta.matchedPath,
                        appendPath = meta.appendPath,
                        pathParam = meta.matchedParam;

                    if(pathParam){
                        matchedPath = matchedPath +'/'+ this.$route.params[pathParam];
                    }

                    if(appendPath){
                        matchedPath = matchedPath + appendPath;
                    }

                    let alreadyHasTagView = false
                    this.visitedViews.forEach(item => {
                        if (item.path === path) {
                            alreadyHasTagView = true
                        }
                    })
                    if (!alreadyHasTagView) {
                        this.$store.dispatch('tagsView/delView', {
                            path: matchedPath
                        }).then(({ visitedViews }) =>{
                            this.$store.dispatch('tagsView/addView', this.$route);
                        })
                    }
                }
            }else{
                if(path == '/error' && self.tabName){
                    this.$store.dispatch('tagsView/addView', this.currentError);
                    return false;
                }else if (name) {

                    this.visitedViews.map(function(item, index) {
                        var matchedPath = '',
                            pathParam = '';

                        if(pathParam){
                            matchedPath = matchedPath +'/'+ item.params[pathParam];
                        }
                        if(item.meta && item.meta.isNewTab == false){
                            matchedPath = item.meta.matchedPath;
                            pathParam = item.meta.matchedParam;

                            if(pathParam){
                                matchedPath = matchedPath +'/'+ item.params[pathParam];
                            }

                            if(matchedPath == path){
                                deleteArr.push(item);
                            }
                        }
                    })

                    if(deleteArr.length){
                        this.$store.dispatch('tagsView/delViewArr', deleteArr).then(({ visitedViews }) =>{
                            this.$store.dispatch('tagsView/addView', this.$route);
                        })
                    }else{
                        this.$store.dispatch('tagsView/addView', this.$route);
                    }
                }
            }
            return false
        },
        listeningTags(){
            //监听事件关闭对应的工作台
            // this.dispatch.$on('threeCatchVoice',(liaisonHistoryId)=>{
            //     this.visitedViews.map(view=>{
            //         if(view.params 
            //         && view.params.liaisonHistoryId
            //         && view.params.liaisonHistoryId == liaisonHistoryId){
            //             this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) =>{
                
            //                 if(view.name == 'child-deal' || view.name == 'main-deal'){
            //                     var tipsArr = view.meta.tipsArr || [],
            //                         currentIndex = -1;

            //                     tipsArr.some(function(item, index){
            //                         if(item == view.params.workOrderNumber){
            //                             currentIndex = index
            //                         }
            //                     })

            //                     if(currentIndex > -1){
            //                         tipsArr = tipsArr.splice(0, currentIndex);
            //                         view.meta.tipsArr = tipsArr;
            //                     }
            //                 }
            //                 // console.log('['+new Date().toLocaleString()+'] 查看缓存状态:',visitedViews,cachedViews,view);
            //                 //  console.log('查看缓存状态： ',this.$vnode.parent.componentInstance.cache );
            //                 if (this.isActive(view)) {
            //                     this.toLastView(visitedViews, view)
            //                 }
            //             })
            //         }
            //     })
            // });
        },
        moveToCurrentTag() {
            const tags = this.$refs.tag
            this.$nextTick(() => {
                if(tags){
                    for (const tag of tags) {
                        if (tag.to.path === this.$route.path) {
                            this.$refs.scrollPane.moveToTarget(tag)
                            if (tag.to.fullPath !== this.$route.fullPath) {
                                this.$store.dispatch('tagsView/updateVisitedView', this.$route)
                            }
                            break
                        }
                    }
                }
            })
        },
        refreshSelectedTag(view) {
            this.$store.dispatch('tagsView/delCachedView', view).then(() => {
                const { fullPath } = view
                this.$nextTick(() => {
                    this.$router.replace({
                         path: '/redirect' + fullPath
                    })
                })
            })
            //this.$store.dispatch('tagsView/delCacheError', view)
        },
        closeSelectedTag(view) {
            var childrenEle = [],
                retValue = '',
                isPhone = false,
                self = this;
            /**清除页面缓存 修改这里 */
            if(view.name == 'user-list'){
                this.$store.commit('member/GET_MEMBERLIST',{});
            }
            this.$store.dispatch('tagsView/delView', view).then(({ visitedViews }) =>{
                
                if(view.name == 'child-deal' || view.name == 'main-deal'){
                    var tipsArr = view.meta.tipsArr || [],
                        currentIndex = -1;

                    tipsArr.some(function(item, index){
                        if(item == view.params.workOrderNumber){
                            currentIndex = index
                        }
                    })

                    if(currentIndex > -1){
                        tipsArr = tipsArr.splice(0, currentIndex);
                        view.meta.tipsArr = tipsArr;
                    }
                }
                if (this.isActive(view)) {
                    this.toLastView(visitedViews, view)
                }
            })
        },
        closeOthersTags(view) {
            // this.$router.push(this.selectedTag)
            /**清除页面缓存 修改这里 */
            if(this.selectedTag.name != 'user-list'){
                this.$store.commit('member/GET_MEMBERLIST',{});
            }
            this.$store.dispatch('tagsView/delOthersViews', this.selectedTag).then(({visitedViews}) => {
            //   this.moveToCurrentTag()
             if (this.affixTags.some(tag => tag.path === view.path)) {
                    return
                }
                this.toLastView(visitedViews, view)
            })
            // this.$store.dispatch('tagsView/delAllCacheError')
            //this.$store.dispatch('tagsView/delCacheError', view)
        },
        closeAllTags(view) {
            /**清除页面缓存 修改这里 */
            this.$store.commit('member/GET_MEMBERLIST',{});
            
            this.$store.dispatch('tagsView/delAllViews').then(({ visitedViews }) => {
                if (this.affixTags.some(tag => tag.path === view.path)) {
                    return
                }
                this.toLastView(visitedViews, view)
            })
            this.$store.dispatch('tagsView/delAllCacheError')
        },
        toLastView(visitedViews, view) {
            const latestView = visitedViews.slice(-1)[0]
            if (latestView) {
                this.$router.push(latestView.fullPath)
            } else {
                if (view.name === 'Dashboard') {
                    this.$router.replace({ path: '/redirect' + view.fullPath })
                } else {
                    this.$router.push('/')
                }
            }
        },
        openMenu(tag, e) {
            const menuMinWidth = 105
            const offsetLeft = this.$el.getBoundingClientRect().left
            const offsetTop = this.$el.getBoundingClientRect().top
            const offsetWidth = this.$el.offsetWidth
            const maxLeft = offsetWidth - menuMinWidth
            const left = e.clientX - offsetLeft + 15

            if (left > maxLeft) {
                 this.left = maxLeft
            } else {
                 this.left = left
            }

            this.top = e.clientY - offsetTop;
            this.visible = true
            this.selectedTag = tag
        },
        closeMenu() {
            this.visible = false
        }
    }
}
</script>

<style lang = "scss" scoped>
.tags-view-container {
    width: 100%;
    background: #fff;
    position: relative;
    &.tag-padding{
        padding: 0 20px;
        .tag-nav{
            position: absolute;
            top: 0px;
            width: 20px;
            height: 32px;
            line-height: 32px;
            border-bottom: 1px solid #EBEEF5;
            &.disabled-cls{
                background: #f9f9f9;
                color: #DCDFE6;
            }
            &.tag-left{
                left: 0;
            }
            &.tag-right{
                right: 0;
            }
        }
    }
    .tags-view-wrapper {
        .tags-view-item {
            display: inline-block;
            position: relative;
            cursor: pointer;
            height: 32px;
            line-height: 32px;
            color: #495060;
            background: #fff;
            padding: 0 15px;
            font-size: 14px;
            border: 1px solid #EBEEF5;
            border-bottom: none;
            margin-right: 4px;
            border-radius: 4px 4px 0 0;
            &.active {
                color: #4c7ee9;
                border-bottom-color: #fff;
                position: relative;
                z-index: 2;
                &::before {
                  content: '';
                  background: #fff;
                  display: inline-block;
                  width: 8px;
                  height: 8px;
                  border-radius: 50%;
                  position: relative;
                  margin-right: 2px;
                  display: none;
                }
            }
            &:first-child{
                border-left: none;
            }
            &.tags-view-item-only{
                border-radius: 4px 4px 0px 0px;
            }
        }
        &:after{
            content: '';
            border-bottom: 1px solid #EBEEF5;
            width: 100%;
            height: 1px;
            display: block;
            position: absolute;
            bottom: 0;
        }
    }


    .contextmenu {
        margin: 0;
        background: #fff;
        z-index: 3000;
        position: absolute;
        list-style-type: none;
        padding: 5px 0;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 400;
        color: #333;
        box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
        li {
            margin: 0;
            padding: 7px 16px;
            cursor: pointer;
            &:hover {
              background: #eee;
            }
        }
    }
}
.tags-view-wrapper {
    .tags-view-item {
        .el-icon-close {
            width: 16px;
            height: 16px;
            vertical-align: 2px;
            border-radius: 50%;
            text-align: center;
            font-size: 16px;
            transition: all .3s cubic-bezier(.645, .045, .355, 1);
            transform-origin: 100% 50%;
            &:before {
                transform: scale(.6);
                display: inline-block;
                vertical-align: -3px;
            }
            &:hover {
                color: #4c7ee9;
            }
        }
    }
}
</style>
