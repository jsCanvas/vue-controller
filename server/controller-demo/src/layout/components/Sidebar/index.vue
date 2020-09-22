<template>
    <div :class = "{'has-logo':showLogo}">
        <logo v-if = "showLogo" :collapse = "isCollapse" />
        <el-scrollbar wrap-class = "scrollbar-wrapper">
            <el-menu
                :collapse = "isCollapse"
                :default-active = "activeMenu"
                :background-color = "variables.menuBg"
                :text-color = "variables.menuText"
                :unique-opened = "true"
                :active-text-color = "variables.menuActiveText"
                :collapse-transition = "false"
                mode = "vertical">
                <sidebar-item
                    class = "sidebar-items-define"
                    v-for = "route in menu"
                    :key = "route.path"
                    :item = "route"
                    :base-path = "route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'

export default {
    components: { SidebarItem, Logo },
    computed: {
        ...mapGetters([
            'sidebar'
        ]),
        menu() {
            var tempArr = Object.assign([],this.$router.options.routes)
            return tempArr.concat(this.$store.getters.menu)
        },
        routes() {
            return this.$router.options.routes
        },
        activeMenu() {
            const route = this.$route
            const { meta, path } = route

            if (meta.activeMenu) {
                return meta.activeMenu
            }
            return path
        },
        showLogo() {
            return true;
            // return this.$store.state.settings.sidebarLogo
        },
        variables() {
            return variables
        },
        isCollapse() {
            return !this.sidebar.opened
        }
    }
}
</script>
<style lang = "scss">
.menu-wrapper{
    &.sidebar-items-define{
        margin-bottom: 8px;
    }
    .el-submenu__title i{
        color: #fff;
    }
}
</style>
