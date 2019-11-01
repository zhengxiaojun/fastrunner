<template>
    <div>
        <div style="margin-bottom: 10px;">
            <el-input placeholder="请输入用例名称" v-model="name" clearable>
                <template slot="prepend">用例名称</template>
            </el-input>
        </div>
        <div>
            <div>
                <el-input style="width: 650px;" placeholder="请输入接口请求地址" v-model="url" clearable>
                    <el-select style="width: 96px" slot="prepend" v-model="method">
                        <el-option v-for="item of httpOptions" :label="item.label" :value="item.label" :key="item.value">
                        </el-option>
                    </el-select>

                </el-input>

                <el-tooltip effect="dark" content="循环次数" placement="bottom">
                    <el-input-number v-model="times" controls-position="right" :min="1" :max="100" style="width: 100px">
                    </el-input-number>
                </el-tooltip>
                <el-button type="primary" @click="test_api" v-loading="loading" :disabled="loading">测试请求
                </el-button>
                <el-button slot="append" type="success" @click="handleCase">保存
                </el-button>
            </div>
        </div>
        <div class="request">
            <el-dialog title="调试报告" v-if="reportDialogVisible" :visible.sync="reportDialogVisible" width="65%" center
                append-to-body>
                <report :summary="summary"></report>
            </el-dialog>
            <el-tabs style="margin-left: 20px;" v-model="activeTag">
                <el-tab-pane label="Header" name="first">
                    <headers :save="save" v-on:header="handleHeader" :header="response ? response.body.header: [] ">
                    </headers>
                </el-tab-pane>

                <el-tab-pane label="Request" name="second">
                    <request :save="save" v-on:request="handleRequest" :request="response ? response.body.request: []">
                    </request>
                </el-tab-pane>

                <el-tab-pane label="Extract" name="third">
                    <extract :save="save" v-on:extract="handleExtract" :extract="response ? response.body.extract : []">
                    </extract>
                </el-tab-pane>

                <el-tab-pane label="Validate" name="fourth">
                    <validate :save="save" v-on:validate="handleValidate" :validate="response ? response.body.validate: []">

                    </validate>
                </el-tab-pane>

                <el-tab-pane label="Variables" name="five">
                    <variables :save="save" v-on:variables="handleVariables" :variables="response ? response.body.variables : []">

                    </variables>
                </el-tab-pane>

                <el-tab-pane label="Hooks" name="six">
                    <hooks :save="save" v-on:hooks="handleHooks" :hooks="response ? response.body.hooks: []">
                    </hooks>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
    import Headers from '../../../httprunner/components/Headers'
    import Request from '../../../httprunner/components/Request'
    import Extract from '../../../httprunner/components/Extract'
    import Validate from '../../../httprunner/components/Validate'
    import Variables from '../../../httprunner/components/Variables'
    import Hooks from '../../../httprunner/components/Hooks'
    import Report from '../../../reports/DebugReport'

    export default {
        components: {
            Headers,
            Request,
            Extract,
            Validate,
            Variables,
            Hooks,
            Report
        },

        props: {
            host: {
                require: false
            },
            nodeId: {
                require: false
            },
            project: {
                require: false
            },
            config: {
                require: false
            },
            response: {
                require: false
            }
        },
        methods: {
            test_api(header) {
                this.save = !this.save;
                this.run = true;
            },
            handleHeader(header) {
                this.header = header;
            },
            handleRequest(request) {
                this.request = request;
            },
            handleValidate(validate) {
                this.validate = validate;
            },
            handleExtract(extract) {
                this.extract = extract;
            },
            handleVariables(variables) {
                this.variables = variables;
            },
            handleHooks(hooks) {
                this.hooks = hooks;
                if (!this.run) {
                    if (this.id === '') {
                        this.addAPI();
                    } else {
                        this.updateAPI();
                    }
                } else {
                    this.runAPI();
                    this.run = false;
                }
            },
            handleCase() {
                this.save = !this.save;
            },
            handledata() {
                this.header = this.response ? this.response.body.header : [];
                this.request = this.response ? this.response.body.request : [];
                this.validate = this.response ? this.response.body.validate : [];
                this.extract = this.response ? this.response.body.extract : [];
                this.variables = this.response ? this.response.body.variables : [];
                this.hooks = this.response ? this.response.body.hooks : [];
            },
            validateData() {
                if (this.url === '') {
                    this.$notify.error({
                        title: 'url错误',
                        message: '接口请求地址不能为空',
                        duration: 1500
                    });
                    return false;
                }

                if (this.name === '') {
                    this.$notify.error({
                        title: 'name错误',
                        message: '用例名称不能为空',
                        duration: 1500
                    });
                    return false;
                }
                return true
            },
            test_validate_data() {
                if (this.url === '') {
                    this.$notify.error({
                        title: 'url错误',
                        message: '接口请求地址不能为空',
                        duration: 1500
                    });
                    return false;
                }
                return true
            },
            runAPI() {
                if (this.test_validate_data()) {
                    this.loading = true;
                    this.$api.runSingleAPI({
                        header: this.header,
                        request: this.request,
                        extract: this.extract,
                        validate: this.validate,
                        variables: this.variables,
                        hooks: this.hooks,
                        url: this.url,
                        method: this.method,
                        name: this.name,
                        times: this.times,
                        project: this.project,
                        config: this.config,
                        host: this.host,
                        nodeId: this.nodeId
                    }).then(resp => {
                        this.summary = resp;
                        this.reportDialogVisible = true;
                        this.loading = false;
                    }).catch(resp => {
                        this.loading = false;
                    })
                }
            },
            addAPI() {
                if (this.validateData()) {
                    this.$api.addAPI({
                        header: this.header,
                        request: this.request,
                        extract: this.extract,
                        validate: this.validate,
                        variables: this.variables,
                        hooks: this.hooks,
                        url: this.url.trim(),
                        method: this.method,
                        name: this.name.trim(),
                        times: this.times,
                        nodeId: this.nodeId,
                        project: this.project,
                    }).then(resp => {
                        if (resp.success) {
                            this.$emit('addSuccess');
                        } else {
                            this.$message.error({
                                message: resp.msg,
                                duration: 1000
                            })
                        }
                    })
                }
            },
            updateAPI() {
                if (this.validateData()) {
                    this.$api.updateAPI(this.id, {
                        header: this.header,
                        request: this.request,
                        extract: this.extract,
                        validate: this.validate,
                        variables: this.variables,
                        hooks: this.hooks,
                        url: this.url.trim(),
                        method: this.method,
                        name: this.name.trim(),
                        times: this.times,
                    }).then(resp => {
                        if (resp.success) {
                            this.$emit('updateSuccess');
                        } else {
                            this.$message.error({
                                message: resp.msg,
                                duration: 1000
                            })
                        }
                    })
                }
            }
        },
        watch: {
            response: function() {
                this.name = this.response.body.name;
                this.method = this.response.body.method;
                this.url = this.response.body.url;
                this.times = this.response.body.times;
                this.id = this.response.id;
            }
        },
        data() {
            return {
                loading: false,
                times: 1,
                name: '',
                url: '',
                id: '',
                header: [],
                request: [],
                extract: [],
                validate: [],
                variables: [],
                hooks: [],
                method: 'GET',
                reportDialogVisible: false,
                save: false,
                run: false,
                summary: {},
                activeTag: 'second',
                httpOptions: [{
                    label: 'GET',
                }, {
                    label: 'POST',
                }, {
                    label: 'PUT',
                }, {
                    label: 'DELETE',
                }, {
                    label: 'HEAD',
                }, {
                    label: 'OPTIONS',
                }, {
                    label: 'PATCH',
                }],
            }
        },
        name: "CaseDialog"
    }
</script>

<style scoped>
    .request {
        margin-top: 15px;
        border: 1px solid #ddd;
    }
</style>
