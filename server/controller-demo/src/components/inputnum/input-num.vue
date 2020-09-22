<template>
    <el-input v-model = "oldVal" clearable/>
</template>

<script>
    export default {
        name: 'inputNum',
        data() {
            return {
                oldVal: 0,
                reg: /^\d*$/
            }
        },
        props: {
            value: {
                default: 0
            }
        },
        model: {
            value: 'value',
            event: 'change'
        },
        watch:{
            oldVal(val, oldVal){
                if(this.reg.test(val)){
                    this.change()
                }else{
                    this.numFn(oldVal)
                }
            },
            value(val, oldVal){
                this.oldVal = val
            }
        },
        methods: {
            change(){
                this.$emit('change', this.oldVal)
            },
            numFn(oldVal){
                this.oldVal = oldVal
            }
        },
        mounted(){
            console.log('activated',this.value)
            this.oldVal = this.value

        }
    }
</script>

<style lang = "scss">
</style>
