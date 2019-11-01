<template>

    <el-container>
        <el-header style="background: #fff; padding: 0; ">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 10px">
                    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="initAddCase=true">添加用例
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="del = !del">批量删除</el-button>
                    &nbsp环境:
                    <el-select placeholder="请选择" size="small" tyle="margin-left: -6px" v-model="currentHost">
                        <el-option v-for="item in hostOptions" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    &nbsp配置:
                    <el-select placeholder="请选择" size="small" tyle="margin-left: -6px" v-model="currentConfig">
                        <el-option v-for="item in configOptions" :key="item.id" :label="item.name" :value="item.name">
                        </el-option>
                    </el-select>
                    <!--                    <el-button style="margin-left: 20px" type="primary" icon="el-icon-caret-right" circle size="mini"
                        @click="run = !run"></el-button> -->
                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0;">
                <el-dialog v-show="addCaseDialogVisible" title="添加用例" :visible.sync="addCaseDialogVisible" width="70%"
                    center>
                    <case-dialog nodeId="3" :project="$route.params.id" :response="response" v-on:addSuccess="addSuccess"
                        :config="currentConfig" :host="currentHost">
                    </case-dialog>
                </el-dialog>
                <el-dialog v-show="editCaseDialogVisible" title="编辑用例" :visible.sync="editCaseDialogVisible" width="70%"
                    center>
                    <case-dialog nodeId="3" :project="$route.params.id" :response="response" v-on:updateSuccess="updateSuccess"
                        :config="currentConfig" :host="currentHost">
                    </case-dialog>
                </el-dialog>
                <case-list-detail v-on:api="editCase" node="3" :project="$route.params.id" :update_list="update_list"
                    :config="currentConfig" :host="currentHost" :run="run" :del="del">
                </case-list-detail>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import CaseDialog from './components/CaseDialog'
    import CaseListDetail from './components/CaseListDetail'

    export default {
        components: {
            CaseDialog,
            CaseListDetail
        },
        computed: {
            initAddCase: {
                get() {
                    return this.addCaseDialogVisible;
                },
                set(value) {
                    this.addCaseDialogVisible = value;
                    this.response = {
                        id: '',
                        body: {
                            name: '',
                            times: 1,
                            url: '',
                            method: 'GET',
                            header: [{
                                key: "",
                                value: "",
                                desc: ""
                            }],
                            request: {
                                data: [{
                                    key: "",
                                    value: "",
                                    desc: "",
                                    type: 1
                                }],
                                params: [{
                                    key: "",
                                    value: "",
                                    desc: "",
                                    type: 1
                                }],
                                json_data: ''
                            },
                            validate: [{
                                expect: "",
                                actual: "",
                                comparator: "equals",
                                type: 1
                            }],
                            variables: [{
                                key: "",
                                value: "",
                                desc: "",
                                type: 1
                            }],
                            extract: [{
                                key: "",
                                value: "",
                                desc: ""
                            }],
                            hooks: [{
                                setup: "",
                                teardown: ""
                            }]
                        }
                    };
                }
            }
        },
        data() {
            return {
                configOptions: [],
                hostOptions: [],
                currentConfig: '请选择',
                currentHost: '请选择',
                update_list: false,
                run: false,
                del: false,
                response: '',
                nodeForm: {
                    name: '',
                },
                rules: {
                    name: [{
                            required: true,
                            message: '请输入节点名称',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 50,
                            message: '最多不超过50个字符',
                            trigger: 'blur'
                        }
                    ]
                },
                maxId: '',
                addCaseDialogVisible: false,
                editCaseDialogVisible: false,
                currentNode: '',
                data: '',
                expand: '&#xe65f;',
            }
        },
        methods: {
            addSuccess() {
                this.$notify.success({
                    message: '添加成功',
                    duration: 1500
                });
                this.update_list = !this.update_list;
                this.addCaseDialogVisible = false;
            },
            updateSuccess() {
                this.$notify.success({
                    message: '更新成功',
                    duration: 1500
                });
                this.update_list = !this.update_list;
                this.editCaseDialogVisible = false;
            },
            editCase(response) {
                // console.log(JSON.stringify(response));
                this.editCaseDialogVisible = !this.editCaseDialogVisible;
                setTimeout(() => {
                    this.response = response;
                }, 100);
            },
            getConfig() {
                this.$api.getAllConfig(this.$route.params.id).then(resp => {
                    this.configOptions = resp;
                    this.configOptions.push({
                        name: '请选择'
                    })
                })
            },
            getHost() {
                this.$api.getAllHost(this.$route.params.id).then(resp => {
                    this.hostOptions = resp;
                    this.hostOptions.push({
                        name: '请选择'
                    })
                })
            }
        },
        name: "RecordApi",
        mounted() {
            this.getConfig();
            this.getHost();
        }
    }
</script>

<style scoped>


</style>
