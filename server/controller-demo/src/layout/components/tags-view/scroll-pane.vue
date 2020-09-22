<template>
    <el-scrollbar
        ref = "scrollContainer"
        :vertical = "false"
        class = "scroll-container"
        @wheel.native.prevent = "handleScroll">
        <slot />
    </el-scrollbar>
</template>

<script>
const tagAndTagSpacing = 4 // tagAndTagSpacing
export default {
    name: 'ScrollPane',
    data() {
        return {
            left: 0
        }
    },
    computed: {
        scrollWrapper() {
             return this.$refs.scrollContainer.$refs.wrap
        }
    },
    methods: {
        handleScroll(e) {
            const eventDelta = e.wheelDelta || -e.deltaY * 40
            const $scrollWrapper = this.scrollWrapper
            $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
        },
        moveToTarget(currentTag) {
            const $container = this.$refs.scrollContainer.$el
            const $containerWidth = $container.offsetWidth
            const $scrollWrapper = this.scrollWrapper
            const tagList = this.$parent.$refs.tag

            let firstTag = null
            let lastTag = null
            let $scrollWidth = null

            // find first tag and last tag

            if (tagList.length > 0) {
                firstTag = tagList[0]
                lastTag = tagList[tagList.length - 1]
            }else{
                return ;
            }

            $scrollWidth = lastTag.$el.offsetLeft + lastTag.$el.offsetWidth + tagAndTagSpacing;

            if (firstTag === currentTag) {
                $scrollWrapper.scrollLeft = 0
                this.$parent.scrollLeftCls = 'disabled-cls';
                this.$parent.scrollRightCls = '';
            } else if (lastTag === currentTag) {
                $scrollWrapper.scrollLeft = $scrollWrapper.scrollWidth - $containerWidth
                this.$parent.scrollLeftCls = '';
                this.$parent.scrollRightCls = 'disabled-cls';
            } else {
                const currentIndex = tagList.findIndex(item => item === currentTag)
                const prevTag = tagList[currentIndex - 1]
                const nextTag = tagList[currentIndex + 1]

                const afterNextTagOffsetLeft = nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagAndTagSpacing

                const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagAndTagSpacing

                if (afterNextTagOffsetLeft > $scrollWrapper.scrollLeft + $containerWidth) {
                    $scrollWrapper.scrollLeft = afterNextTagOffsetLeft - $containerWidth
                } else if (beforePrevTagOffsetLeft < $scrollWrapper.scrollLeft) {
                    $scrollWrapper.scrollLeft = beforePrevTagOffsetLeft
                }
            }

            if($scrollWrapper.scrollLeft < $containerWidth){
                this.$parent.scrollLeftCls = 'disabled-cls';
                this.$parent.scrollRightCls = '';
            }else if($scrollWrapper.scrollLeft < $scrollWidth && ($scrollWrapper.scrollLeft-$scrollWidth) < $scrollWrapper.scrollLeft){
                this.$parent.scrollLeftCls = '';
                this.$parent.scrollRightCls = 'disabled-cls';
            }
        },

        update(){
            const tagList = this.$parent.$refs.tag
            const $container = this.$refs.scrollContainer.$el
            const $scrollWrapper = this.scrollWrapper
            const $containerWidth = $container.offsetWidth
            var lastTag = null,
                $scrollWidth = null;

            if (tagList.length > 0) {
                lastTag = tagList[tagList.length - 1]
            }else{
                return ;
            }

            $scrollWidth = lastTag.$el.offsetLeft + lastTag.$el.offsetWidth + tagAndTagSpacing

            if($scrollWidth > $containerWidth){
                this.$parent.scrollable = true;

                if($scrollWrapper.scrollLeft > 0){
                    this.$parent.scrollLeftCls = '';
                }else{
                    this.$parent.scrollLeftCls = 'disabled-cls';
                }
                this.$parent.scrollLeft = true;
                this.$parent.scrollRight = true;
            }else{
                this.$parent.scrollable = false;
                this.$parent.scrollLeft = false;
                this.$parent.scrollRight = false;
            }
        },
        findCurrentTag(){
            const tagList = this.$parent.$refs.tag
            var currentTag = null;

            for (const tag of tagList) {
                if (tag.to.path === this.$route.path) {
                    currentTag = tag
                    break;
                }
            }

            return currentTag;
        },
        scrollLeft(){
            const $container = this.$refs.scrollContainer.$el
            const $scrollWrapper = this.scrollWrapper
            const $containerWidth = $container.offsetWidth

            if($scrollWrapper.scrollLeft > 0){
                if($scrollWrapper.scrollLeft/$containerWidth > 1){
                    $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft - $containerWidth;
                    this.$parent.scrollLeftCls = '';
                    this.$parent.scrollRightCls = '';
                }else{
                    this.$parent.scrollLeftCls = 'disabled-cls';
                    this.$parent.scrollRightCls = '';
                    $scrollWrapper.scrollLeft = 0;
                }
            }else{
                $scrollWrapper.scrollLeft = 0;
            }


        },
        scrollRight(){
            const $container = this.$refs.scrollContainer.$el
            const $scrollWrapper = this.scrollWrapper
            const $containerWidth = $container.offsetWidth
            const tagList = this.$parent.$refs.tag

            var lastTag = null,
                $scrollWidth = null;

            if (tagList.length > 0) {
                lastTag = tagList[tagList.length - 1]
            }else{
                return ;
            }

            $scrollWidth = lastTag.$el.offsetLeft + lastTag.$el.offsetWidth + tagAndTagSpacing;

            if(($scrollWrapper.scrollLeft + $containerWidth*2) < ($scrollWidth - 40)){
                $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + $containerWidth;
                this.$parent.scrollRightCls = '';
                this.$parent.scrollLeftCls = '';
            }else {
                $scrollWrapper.scrollLeft = $scrollWidth;
                this.$parent.scrollLeftCls = '';
                this.$parent.scrollRightCls = 'disabled-cls';
            }
        }
    }
}
</script>

<style lang = "scss">
.scroll-container {
    white-space: nowrap;
    position: relative;
    overflow: hidden;
    width: 100%;
    .el-scrollbar__wrap{
        background: #EDEFF4;
    }
    .el-scrollbar__view{
        background: #EDEFF4;
    }
    /deep/ {
      .el-scrollbar__bar {
        bottom: 0px;
          height:0;
      }
    }
}
</style>
