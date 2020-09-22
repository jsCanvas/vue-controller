<template>
    <div>
        <table class="table-container">
            <caption class="clearfix" v-show="title">
                <div class="floatL">
                    <div class="title">{{title}}</div>
                </div>
                <div class="floatR right" v-if="showFold">
                    <el-button @click="isFold = !isFold" type="text" size="small">
                        <i :class="[isFold ? 'arrow-down' : 'arrow-up', 'el-icon-d-arrow-left']"></i>
                        {{isFold ? '更多' : ' 收起'}}
                    </el-button>
                </div>
            </caption>
            <tr-item v-for="(item, index) in alwaysShow" :key="index" :item="item" :data="data">
                <span v-if="item[0] && item[0].slotName" :slot="item[0].slotName">
                    <slot :name="item[0].slotName"></slot>
                </span>
                <span v-if="item[1] && item[1].slotName" :slot="item[1].slotName">
                    <slot :name="item[1].slotName"></slot>
                </span>
                <span v-if="item[2] && item[2].slotName" :slot="item[2].slotName">
                    <slot :name="item[2].slotName"></slot>
                </span>
                <span v-if="item[3] && item[3].slotName" :slot="item[3].slotName">
                    <slot :name="item[3].slotName"></slot>
                </span>
            </tr-item>
            <tr-item v-show="!isFold" v-for="(item, index) in foldedShow" :key="`fold-${index}`" :item="item" :data="data">
                <span v-if="item[0] && item[0].slotName" :slot="item[0].slotName">
                    <slot :name="item[0].slotName"></slot>
                </span>
                <span v-if="item[1] && item[1].slotName" :slot="item[1].slotName">
                    <slot :name="item[1].slotName"></slot>
                </span>
                <span v-if="item[2] && item[2].slotName" :slot="item[2].slotName">
                    <slot :name="item[2].slotName"></slot>
                </span>
                <span v-if="item[3] && item[3].slotName" :slot="item[3].slotName">
                    <slot :name="item[3].slotName"></slot>
                </span>
            </tr-item>
        </table>
    </div>
</template>

<script>
/*
example:
* accountInfo = {age: 1, sex: '男'}
* mapping = [{name: '年龄', key: 'age'}, {name: '性别', key: 'sex'}]
<folder-info title="基本信息" :unfoldRow="2" :data="accountInfo" :mapping="mapping" />

如果有需要特殊样式的则需要使用slot，mapping中配置slotName, 如{name: '性别', slotName: 'sex'}, {name: '年龄', slotName: 'age'}
同时父组件：
<folder-info title="基本信息" :unfoldRow="2" :data="accountInfo" :mapping="mapping">
    <span slot="sex">
        <span :class="{'error-msg': accountInfo.status === '已签约' || accountInfo.status === '未签约'}">{{accountInfo.status}}</span>
    </span>
    <span slot="age">
        <el-button type="text" class="btn" @click="getAccountInfo">[投保记录]</el-button>
    </span>
</folder-info>

*/

import trItem from './tr-item'
export default {
    name: 'folder-info',
    props: {
        title: String, // 标题
        unfoldRow: {
            default: 2,
            type: Number
        }, // 行数
        data: {
            default: () => {
                return {}
            },
            type: Object
        },
        mapping: {
            default: () => {
                return []
            },
            type: Array
        } // key, name, slotName映射
    },
    components: {
        trItem
    },
    data() {
        return {
            isFold: true
        }
    },
    computed: {
        showFold: function() {
            return Math.ceil(this.mapping.length/4) > this.unfoldRow
        },
        alwaysShow: function() {
            let i = 0
            let result = []
            while (i < this.unfoldRow) {
                result.push(this.mapping.slice(i * 4, (i + 1) * 4))
                i++
            }
            return result
        },
        foldedShow: function() {
            let remainItemCount = this.mapping.length - 4 * this.unfoldRow
            let remainRow = Math.ceil(remainItemCount / 4)
            let i = 0
            let result = []
            while (i < remainRow) {
                result.push(this.mapping.slice((this.unfoldRow + i) * 4, (this.unfoldRow + i + 1) * 4))
                i++
            }
            return result
        }
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {}
}
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
