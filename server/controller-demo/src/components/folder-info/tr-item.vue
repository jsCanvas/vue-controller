<template>
    <tr class="row">
        <td class="cell">{{item[0] ? item[0].name : ''}}</td>
        <td class="cell" v-if="item[0] && item[0].slotName">
            <slot :name="item[0].slotName"></slot>
        </td>
        <td class="cell" v-else>{{item[0] ? data[item[0].key] : ''}}</td>

        <td class="cell">{{item[1] ? item[1].name : ''}}</td>
        <td class="cell" v-if="item[1] && item[1].slotName">
            <slot :name="item[1].slotName"></slot>
        </td>
        <td class="cell" v-else>{{item[1] ? data[item[1].key] : ''}}</td>

        <td class="cell">{{item[2] ? item[2].name : ''}}</td>
        <td class="cell" v-if="item[2] && item[2].slotName">
            <slot :name="item[2].slotName"></slot>
        </td>
        <td class="cell" v-else>{{item[2] ? data[item[2].key] : ''}}</td>

        <td class="cell">{{item[3] ? item[3].name : ''}}</td>
        <td class="cell" v-if="item[3] && item[3].slotName">
            <slot :name="item[3].slotName"></slot>
        </td>
        <td class="cell" v-else>{{item[3] ? data[item[3].key] : ''}}</td>
    </tr>
</template>

<script>
export default {
    name: 'tr-item',
    props: {
        item: {
            default: () => {
                return []
            }
        },
        data: {
            default: () => {
                return {}
            }
        }
    },
    components: {},
    data() {
        return {}
    },
    computed: {},
    watch: {},
    created() {},
    mounted() {},
    methods: {}
}
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
