<template>
    <el-menu class="common-side-bar" :default-active="$store.state.routerName" background-color="#304056" text-color="#BFCBD9"
        active-text-color="#318DF1" @select="select">
        <el-menu-item index="ProjectList">
            <i class="iconfont">&#xe631;</i>&nbsp;&nbsp;项目列表
        </el-menu-item>
        <!--<el-menu-item-group>-->
        <el-menu-item v-for="item of side_menu" :index="item.url" :key="item.url" :disabled="$store.state.routerName === 'ProjectList'">
            <span class="iconfont" v-html="item.code"></span>&nbsp;&nbsp;{{item.name}}
        </el-menu-item>
    </el-menu>
</template>

<script>
    export default {
        name: "Side",
        data() {
            return {
                side_menu: [{
                        name: "项目概况",
                        url: "ProjectDetail",
                        code: "&#xe64a;"
                    },
                    {
                        name: "API 模板",
                        url: "RecordApi",
                        code: "&#xe74a;"
                    },
                    {
                        name: "用例管理",
                        url: "AutoTest",
                        code: "&#xe6da;",
                        subs: [{
                            name: "用例列表",
                            url: "AutoTest"
                        }, {
                            name: "套件列表",
                            url: "suitelist"
                        }]
                    },
                    {
                        name: "层级列表",
                        url: "LevelTagList",
                        code: "&#xe74a;"
                    },
                    {
                        name: "用例列表",
                        url: "CaseList",
                        code: "&#xe74a;"
                    },
                    {
                        name: "套件列表",
                        url: "SuiteList",
                        code: "&#xe74a;"
                    },
                    {
                        name: "配置管理",
                        url: "RecordConfig",
                        code: "&#xee32;"
                    },
                    {
                        name: "全局变量",
                        url: "GlobalEnv",
                        code: "&#xe692;"
                    },
                    {
                        name: "域名管理",
                        url: "HostIP",
                        code: "&#xe609;"
                    },
                    {
                        name: "驱动代码",
                        url: "DebugTalk",
                        code: "&#xe7ca;"
                    },
                    {
                        name: "定时任务",
                        url: "Task",
                        code: "&#xe61e;"
                    },
                    {
                        name: "历史报告",
                        url: "Reports",
                        code: "&#xe66e;"
                    }
                ],
            }
        },
        methods: {
            select(url) {
                this.$store.commit('setRouterName', url);
                this.$router.push({
                    name: url
                });
                this.setLocalValue("routerName", url);
            }
        }
    }
</script>

<style scoped>
    .common-side-bar {
        position: fixed;
        top: 48px;
        border-right: 1px solid #ddd;
        height: 100%;
        width: 202px;
        background-color: #fff;
        display: inline-block;
    }
</style>
