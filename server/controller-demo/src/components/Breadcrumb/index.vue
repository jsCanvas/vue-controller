<template>
    <el-row class="breadcrum-bar">
        <el-col :span="22">
            <el-breadcrumb class="app-breadcrumb" separator="/">
                <transition-group name="breadcrumb">
                    <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
                        <span
                            v-if="item.redirect==='noRedirect' || index==levelList.length-1"
                            class="no-redirect"
                        >{{ item.meta.title }}</span>
                        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
                    </el-breadcrumb-item>
                </transition-group>
            </el-breadcrumb>
        </el-col>
        <el-col :span="2" class="right-back">
            <div
                :key="levelList.length"
                class="btn"
                v-if="$store.state.app.backBtn.show"
                @click="back">
                <img src="@/assets/back.png" alt class="back-icon" />
                <el-button type="text" size="small">返回</el-button>
            </div>
        </el-col>
    </el-row>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
export default {
    name: 'breadcrumb',
    data() {
        return {
            levelList: null
        }
    },
    watch: {
        $route() {
            this.getBreadcrumb()
        }
    },
    created() {
        this.getBreadcrumb()
    },
    methods: {
        getBreadcrumb() {
            let matched = this.$route.matched.filter(function(item) {
                return item.meta && item.meta.title
            })
            let isContractRoute = this.$route.path.search('contract-detail')
            let querys = this.$route.query
            this.levelList = matched.filter(function(item) {
                // 合同相关加上query
                if (~isContractRoute && ~item.path.search('contract-detail')) {
                    item['query'] = querys
                }
                return (
                    item.meta &&
                    item.meta.title &&
                    item.meta.breadcrumb !== false
                )
            })
        },
        isDashboard(route) {
            const name = route && route.name
            if (!name) {
                return false
            }
            return (
                name.trim().toLocaleLowerCase() ===
                'Dashboard'.toLocaleLowerCase()
            )
        },
        pathCompile(path) {
            const { params } = this.$route
            var toPath = pathToRegexp.compile(path)
            return toPath(params)
        },
        handleLink(item) {
            const { redirect, path } = item
            if (redirect) {
                this.$router.push(redirect)
                return
            }
            if (item.query) {
                this.$router.push({path: this.pathCompile(path), query: item.query})
            } else {
                this.$router.push(this.pathCompile(path))
            }
        },
        back() {
            if (this.$store.state.app.backBtn.url) {
                this.$router.push({path: this.$store.state.app.backBtn.url})
            } else {
                this.$router.go(-1)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.breadcrum-bar {
    padding: 8px 0;
}
.app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    font-size: 12px;
    background: rgba(76, 126, 233, 0.07);
    border-radius: 12px;
    border-radius: 12px;
    height: 24px;
    line-height: 24px;
    color: #9ba0b9;
    padding: 0 10px;
    .no-redirect {
        color: #4c7ee9;
        cursor: text;
    }
}
.right-back {
    position: relative;
}
.btn {
    position: absolute;
    right: 16px;
    padding: 4px 0;
    font-size: 14px;
    color: #4C7EE9;
    cursor: pointer;
    margin-top: -8px;
    .back-icon {
        width: 16px;
        vertical-align: sub;
    }
}
</style>
