import axios from 'axios'
import store from '../store/state'
import router from '../router'
import {
    Message
} from 'element-ui';



export const baseUrl = "http://localhost:8000";
axios.defaults.withCredentials = true;
axios.defaults.baseURL = baseUrl;

axios.interceptors.request.use(function(config) {
    if (config.url.indexOf("/api/fastrunner/project/?cursor=") !== -1) {} else if (!config.url.startsWith(
            "/api/user/")) {
        config.url = config.url + "?token=" + store.token;
    }
    return config;
}, function(error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(function(response) {

    return response;
}, function(error) {
    try {
        if (error.response.status === 401) {
            router.replace({
                name: 'Login'
            })
        }

        if (error.response.status === 500) {
            console.log(error.response);
            Message.error({
                message: '服务器内部异常, 请检查',
                duration: 1000
            })
        }
    } catch (e) {
        Message.error({
            message: '服务器连接超时，请重试',
            duration: 1000
        })
    }
});

// user api
export const register = params => {
    return axios.post('/api/user/register/', params).then(res => res.data)
};

export const login = params => {
    return axios.post('/api/user/login/', params).then(res => res.data)
};


// fastrunner api
export const addProject = params => {
    return axios.post('/api/fastrunner/project/', params).then(res => res.data)
};

export const deleteProject = config => {
    return axios.delete('/api/fastrunner/project/', config).then(res => res.data)
};

export const getProjectList = params => {
    return axios.get('/api/fastrunner/project/').then(res => res.data)
};

export const getProjectDetail = pk => {
    return axios.get('/api/fastrunner/project/' + pk + '/').then(res => res.data)
};

export const getPagination = url => {
    return axios.get(url).then(res => res.data)
};

export const updateProject = params => {
    return axios.patch('/api/fastrunner/project/', params).then(res => res.data)
};

export const getDebugtalk = url => {
    return axios.get('/api/fastrunner/debugtalk/' + url + '/').then(res => res.data)
};

export const updateDebugtalk = params => {
    return axios.patch('/api/fastrunner/debugtalk/', params).then(res => res.data)
};

export const runDebugtalk = params => {
    return axios.post('/api/fastrunner/debugtalk/', params).then(res => res.data)
};

export const getTree = (url, params) => {
    console.log(url);
    return axios.get('/api/fastrunner/tree/' + url + '/', params).then(res => res.data)
};

export const updateTree = (url, params) => {
    return axios.patch('/api/fastrunner/tree/' + url + '/', params).then(res => res.data)
};

// FILE API

export const uploadFile = params => {
    return axios.put('/api/fastrunner/file/', params).then(res => res.data)
};

// CASE API
export const addCase = params => {
    return axios.post('/api/fastrunner/case/', params).then(res => res.data)
};

export const importCase = params => {
    return axios.post('/api/fastrunner/case/import/', params).then(res => res.data)
};

export const getCaseList = params => {
    return axios.get('/api/fastrunner/case/', params).then(res => res.data)
};

export const getCasePaginationBypage = params => {
    return axios.get('/api/fastrunner/case/', params).then(res => res.data)
};

export const getSingleCase = id => {
    return axios.get('/api/fastrunner/case/' + id + '/').then(res => res.data)
};

export const copyAPI = (pk, params) => {
    return axios.post('/api/fastrunner/case/' + pk + '/', params).then(res => res.data)
};

export const updateCase = (pk, params) => {
    return axios.patch('/api/fastrunner/case/' + pk + '/', params).then(res => res.data)
};

export const delCaseById = id => {
    return axios.delete('/api/fastrunner/case/' + id + '/').then(res => res.data)
};

export const delAllCase = params => {
    return axios.delete('/api/fastrunner/case/', params).then(res => res.data)
};

// SUITE API

export const addSuite = params => {
    return axios.post('/api/fastrunner/suite/', params).then(res => res.data)
};

export const getSuiteList = params => {
    return axios.get('/api/fastrunner/suite/', params).then(res => res.data)
};

export const getSuitePaginationBypage = params => {
    return axios.get('/api/fastrunner/suite/', params).then(res => res.data)
};

export const getSingleSuite = id => {
    return axios.get('/api/fastrunner/suite/' + id + '/').then(res => res.data)
};

export const copySuite = (id, params) => {
    return axios.post('/api/fastrunner/suite/' + id + '/', params).then(res => res.data)
};

export const updateSuite = (id, params) => {
    return axios.patch('/api/fastrunner/suite/' + id + '/', params).then(res => res.data)
};

export const deleteSuiteById = id => {
    return axios.delete('/api/fastrunner/suite/' + id + '/').then(res => res.data)
};

export const deleteAllSuite = suites => {
    return axios.delete('/api/fastrunner/suite/', suites).then(res => res.data)
};

// CONFIG API
export const addConfig = params => {
    return axios.post('/api/fastrunner/config/', params).then(res => res.data)
};

export const updateConfig = (url, params) => {
    return axios.patch('/api/fastrunner/config/' + url + '/', params).then(res => res.data)
};


export const configList = params => {
    return axios.get('/api/fastrunner/config/', params).then(res => res.data)
};

export const copyConfig = (url, params) => {
    return axios.post('/api/fastrunner/config/' + url + '/', params).then(res => res.data)
};

export const deleteConfig = url => {
    return axios.delete('/api/fastrunner/config/' + url + '/').then(res => res.data)
};
export const delAllConfig = params => {
    return axios.delete('/api/fastrunner/config/', params).then(res => res.data)
};

export const getConfigPaginationBypage = params => {
    return axios.get('/api/fastrunner/config/', params).then(res => res.data)
};

export const getAllConfig = url => {
    return axios.get('/api/fastrunner/config/' + url + '/').then(res => res.data)
};

// RUN CASE AND SUITE

export const runCaseByBody = params => {
    return axios.post('/api/fastrunner/run_case_by_body/', params).then(res => res.data)
};

export const runCaseById = (id, params) => {
    return axios.get('/api/fastrunner/run_case_by_id/' + id + '/', params).then(res => res.data)
};

export const runSuiteById = (id, params) => {
    return axios.get('/api/fastrunner/run_suite_by_id/' + id, params).then(res => res.data)
};

export const runAPITree = params => {
    return axios.post('/api/fastrunner/run_api_tree/', params).then(res => res.data)
};

export const runSingleTestSuite = params => {
    return axios.post('/api/fastrunner/run_testsuite/', params).then(res => res.data)
};

export const runSingleTest = params => {
    return axios.post('/api/fastrunner/run_test/', params).then(res => res.data)
};

export const runTestByPk = (url, params) => {
    return axios.get('/api/fastrunner/run_testsuite_pk/' + url + '/', params).then(res => res.data)
};

export const runSuiteTree = params => {
    return axios.post('/api/fastrunner/run_suite_tree/', params).then(res => res.data)
};

// VARIABLES API

export const addVariables = params => {
    return axios.post('/api/fastrunner/variables/', params).then(res => res.data)
};

export const variablesList = params => {
    return axios.get('/api/fastrunner/variables/', params).then(res => res.data)
};

export const getVariablesPaginationBypage = params => {
    return axios.get('/api/fastrunner/variables/', params).then(res => res.data)
};

export const updateVariables = (url, params) => {
    return axios.patch('/api/fastrunner/variables/' + url + '/', params).then(res => res.data)
};

export const deleteVariables = url => {
    return axios.delete('/api/fastrunner/variables/' + url + '/').then(res => res.data)
};

export const delAllVariabels = params => {
    return axios.delete('/api/fastrunner/variables/', params).then(res => res.data)
};

// LevelTag API

export const addLevelTag = params => {
    return axios.post('/api/fastrunner/leveltag/', params).then(res => res.data)
};

export const getLevelTagList = params => {
    return axios.get('/api/fastrunner/leveltag/', params).then(res => res.data)
};

export const getLevelTagParentList = params => {
    return axios.get('/api/fastrunner/leveltag/parentinfo/', params).then(res => res.data)
};

export const getSingleLevelTag = url => {
    return axios.get('/api/fastrunner/leveltag/' + url + '/').then(res => res.data)
};

export const getLevelTagPaginationBypage = params => {
    return axios.get('/api/fastrunner/leveltag/', params).then(res => res.data)
};

export const updateLevelTag = (url, params) => {
    return axios.patch('/api/fastrunner/leveltag/' + url + '/', params).then(res => res.data)
};

export const deleteLevelTag = url => {
    return axios.delete('/api/fastrunner/leveltag/' + url + '/').then(res => res.data)
};

export const delAllLevelTag = params => {
    return axios.delete('/api/fastrunner/leveltag/', params).then(res => res.data)
};

// REPORT API

export const reportList = params => {
    return axios.get('/api/fastrunner/reports/', params).then(res => res.data)
};

export const deleteReports = url => {
    return axios.delete('/api/fastrunner/reports/' + url + '/').then(res => res.data)
};

export const getReportsPaginationBypage = params => {
    return axios.get('/api/fastrunner/reports/', params).then(res => res.data)
};

export const delAllReports = params => {
    return axios.delete('/api/fastrunner/reports/', params).then(res => res.data)
};

export const watchSingleReports = url => {
    return axios.get('/api/fastrunner/reports/' + url + '/').then(res => res.data)
};

// TASK API

export const addTask = params => {
    return axios.post('/api/fastrunner/schedule/', params).then(res => res.data)
};

export const getTaskList = params => {
    return axios.get('/api/fastrunner/schedule/', params).then(res => res.data)
};

export const getTaskPaginationBypage = params => {
    return axios.get('/api/fastrunner/schedule/', params).then(res => res.data)
};

export const getSingleTask = id => {
    return axios.get('/api/fastrunner/schedule/' + id + '/').then(res => res.data)
};

export const updateTask = (id, params) => {
    return axios.patch('/api/fastrunner/schedule/' + id + '/', params).then(res => res.data)
};

export const deleteTasks = url => {
    return axios.delete('/api/fastrunner/schedule/' + url + '/').then(res => res.data)
};

// HOST API

export const addHostIP = params => {
    return axios.post('/api/fastrunner/host_ip/', params).then(res => res.data)
};

export const hostList = params => {
    return axios.get('/api/fastrunner/host_ip/', params).then(res => res.data)
};

export const updateHost = (url, params) => {
    return axios.patch('/api/fastrunner/host_ip/' + url + '/', params).then(res => res.data)
};

export const deleteHost = url => {
    return axios.delete('/api/fastrunner/host_ip/' + url + '/').then(res => res.data)
};

export const getHostPaginationBypage = params => {
    return axios.get('/api/fastrunner/host_ip/', params).then(res => res.data)
};

export const getAllHost = url => {
    return axios.get('/api/fastrunner/host_ip/' + url + '/').then(res => res.data)
};
