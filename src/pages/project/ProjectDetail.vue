<template>

    <div>
        <ul class="title-project">
            <li class="title-li" title="Test API Project">
                <b>{{projectInfo.name}}</b>
                <b class="desc-li">{{projectInfo.desc}}</b>
            </li>
        </ul>
        <ul class="project_detail">
            <li class="pull-left" style="background-color: #85DE38;">
                <p class="title-p"><i class="iconfont">&#xe74a;</i> &nbsp;{{projectInfo.case_count}} 个用例</p>
                <p class="desc-p">用例总数</p>
                <a href="/fastrunner/case_list/1"></a>
            </li>
            <li class="pull-left" style="background-color: #4BD0D5;">
                <p class="title-p"><i class="iconfont">&#xe6da;</i> &nbsp;{{projectInfo.suite_count}} 个套件</p>
                <p class="desc-p">套件总数</p>
            </li>
            <li class="pull-left" style="background-color: #E3C939;">
                <p class="title-p"><i class="iconfont">&#xee32;</i> &nbsp;{{projectInfo.leveltag_count}} 个层级标签</p>
                <p class="desc-p">层级标签总数</p>
            </li>
            <li class="pull-left" style="background-color: #E8A9A9;">
                <p class="title-p"><i class="iconfont">&#xe66e;</i> &nbsp;{{projectInfo.report_count}} 个报告</p>
                <p class="desc-p">测试报告总数</p>
            </li>
        </ul>
        <ul class="project_detail">
            <li class="pull-left" style="background-color: #86E6DC;">
                <p class="title-p"><i class="iconfont">&#xe61e;</i> &nbsp;{{projectInfo.task_count}} 个任务</p>
                <p class="desc-p">定时任务总数</p>
            </li>
            <li class="pull-left" style="background-color: #61BDE4;">
                <p class="title-p"><i class="iconfont">&#xe692;</i> &nbsp;{{projectInfo.variables_count}} 对变量</p>
                <p class="desc-p">全局变量总数</p>
            </li>
            <li class="pull-left" style="background-color: #868AE4;">
                <p class="title-p"><i class="iconfont">&#xe609;</i> &nbsp;{{projectInfo.host_count}} 套环境</p>
                <p class="desc-p">环境总数</p>
            </li>
            <li class="pull-left" style="background-color: #E692F1;">
                <p class="title-p"><i class="iconfont">&#xee32;</i> &nbsp;{{projectInfo.config_count}} 套配置</p>
                <p class="desc-p">配置总数</p>
            </li>
        </ul>
        <div>
            <myechart :projectInfo="projectInfo"></myechart>
        </div>
    </div>
</template>

<script>
    import myechart from './myechart'
    export default {
        components: {
            myechart: myechart
        },
        data() {
            return {
                projectInfo: {}
            }
        },
        methods: {
            success(resp) {
                this.$notify({
                    message: resp["msg"],
                    type: 'success',
                    duration: 1000
                });
            },
            failure(resp) {
                this.$notify.error({
                    message: resp.msg,
                    duration: 1000
                });
            },
            getProjectDetail() {
                const pk = this.$route.params.id;
                this.$api.getProjectDetail(pk).then(res => {
                    this.projectInfo = res
                })
            }
        },
        mounted() {
            this.getProjectDetail();
        },
        name: "ProjectDetail"
    }
</script>

<style scoped>
    .desc-p {
        padding-top: 10px;
        font-size: 12px;
        color: #607d8b;
    }

    .title-p {
        font-size: 18px;
        margin-top: 10px;
    }

    .title-project li a {
        font-size: 12px;
        text-decoration: none;
        color: #a3a3a3;
        margin-left: 20px;

    }

    .pull-left {
        float: left;
        margin-left: 10px;
    }

    .project_detail li {
        margin-top: 10px;
        text-indent: 20px;
        display: inline-block;
        height: 90px;
        width: calc(23% - 1.5px);
        border: 1px solid #ddd;
    }

    .project_detail {
        height: 100px;
        margin-top: 20px;
    }

    .title-project {
        margin-top: 40px;
        margin-left: 10px;
    }

    ul li {
        list-style: none;
    }

    .title-li {
        font-size: 24px;
        color: #607d8b;
    }

    .desc-li {
        margin-top: 10px;
        color: #b6b6b6;
        font-size: 14px;
    }
</style>
