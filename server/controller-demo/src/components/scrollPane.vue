<template>
    <div
        ref = "scrollContainer"
        :vertical = "false"
        class = "scroll-dev"
        @wheel.prevent = "handleScroll">
        <slot />
    </div>
</template>

<script>
    const tagAndTagSpacing = 4 // tagAndTagSpacing
    export default {
        name: 'inScrollPane',
        data() {
            return {
                left: 0
            }
        },
        computed: {
        },
        methods: {
            handleScroll(e) {
                const eventDelta = e.wheelDelta || -e.deltaY * 40
                const $scrollWrapper = this.$refs.scrollContainer

                $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4;

            }
        }
    }
</script>

<style lang = "scss">
    .scroll-dev {
        /*white-space: nowrap;*/
        position: relative;
        overflow: hidden;
        width: 100%;
        background: transparent;
    }
</style>
