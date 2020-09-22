<template>
    <router-view :key="key" />
</template>

<script>
export default {
    name: 'Iframewrap',
    components: {
    },
    computed: {
    },
    data(){
        return {
            evidenceList: []
        }
    },
    watch: {
    },
    created(){
    },
    updated(){},
    methods: {
        key() {
            return this.$route.path
        }
    }
}
</script>
