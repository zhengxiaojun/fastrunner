import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/pages/home/Home'
import Register from '@/pages/auth/Register'
import Login from '@/pages/auth/Login'
import ProjectList from '@/pages/project/ProjectList'
import ProjectDetail from '@/pages/project/ProjectDetail'
import DebugTalk from '@/pages/httprunner/DebugTalk'
import CaseList from '@/pages/fastrunner/case/CaseList'
import SuiteList from '@/pages/fastrunner/suite/SuiteList'
import LevelTagList from '@/pages/fastrunner/leveltag/LevelTagList'
import GlobalEnv from '@/pages/variables/GlobalEnv'
import ReportList from '@/pages/reports/ReportList'
import RecordConfig from '@/pages/fastrunner/config/RecordConfig'
import TaskList from '@/pages/task/TaskList'
import HostAddress from '@/pages/variables/HostAddress'

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [{
            path: '/fastrunner/register',
            name: 'Register',
            component: Register,
            meta: {
                title: '用户注册'
            }
        },
        {
            path: '/fastrunner/login',
            name: 'Login',
            component: Login,
            meta: {
                title: '用户登录'
            }
        },
        {
            path: '/fastrunner',
            name: 'Index',
            component: Home,
            meta: {
                title: '首页',
                requireAuth: true
            },
            children: [{
                    name: 'ProjectList',
                    path: 'project_list',
                    component: ProjectList,
                    meta: {
                        title: '项目列表',
                        requireAuth: true,
                    }
                },
                {
                    name: 'ProjectDetail',
                    path: 'project/:id/dashbord',
                    component: ProjectDetail,
                    meta: {
                        title: '项目概览',
                        requireAuth: true,
                    }

                },
                {
                    name: 'DebugTalk',
                    path: 'debugtalk/:id',
                    component: DebugTalk,
                    meta: {
                        title: '编辑驱动',
                        requireAuth: true,
                    }
                },
                {
                    name: 'LevelTagList',
                    path: 'leveltag_list/:id',
                    component: LevelTagList,
                    meta: {
                        title: '层级列表',
                        requireAuth: true
                    }
                },
                {
                    name: 'CaseList',
                    path: 'case_list/:id',
                    component: CaseList,
                    meta: {
                        title: '用例列表',
                        requireAuth: true
                    }
                },
                {
                    name: 'SuiteList',
                    path: 'suite_list/:id',
                    component: SuiteList,
                    meta: {
                        title: '套件列表',
                        requireAuth: true
                    }
                },
                {
                    name: 'RecordConfig',
                    path: 'record_config/:id',
                    component: RecordConfig,
                    meta: {
                        title: '配置管理',
                        requireAuth: true
                    }
                },
                {
                    name: 'GlobalEnv',
                    path: 'global_env/:id',
                    component: GlobalEnv,
                    meta: {
                        title: '全局变量',
                        requireAuth: true
                    }
                },
                {
                    name: 'Reports',
                    path: 'reports/:id',
                    component: ReportList,
                    meta: {
                        title: '历史报告',
                        requireAuth: true
                    }
                },
                {
                    name: 'TaskList',
                    path: 'task_list/:id',
                    component: TaskList,
                    meta: {
                        title: '定时任务',
                        requireAuth: true
                    }
                },
                {
                    name: 'HostIP',
                    path: 'host_ip/:id',
                    component: HostAddress,
                    meta: {
                        title: 'HOST配置',
                        requireAuth: true
                    }
                }
            ]
        },

    ]
})
