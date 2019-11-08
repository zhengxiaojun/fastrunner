<template>
    <el-container>
        <el-header style="background: #fff; padding: 0; ">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 10px">
                    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="initAddCase=true">添加用例
                    </el-button>
                    <el-button type="success" icon="el-icon-upload" size="mini" @click="importCaseHandle">导入用例</el-button>
                    <el-button type="infor" icon="el-icon-download" size="mini" @click="exportCaseHandle">导出用例</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="del = !del">批量删除</el-button>
                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0;">
                <el-dialog v-show="addCaseDialogVisible" title="添加用例" :visible.sync="addCaseDialogVisible" width="70%"
                    :close-on-click-modal="false" center>
                    <case-dialog :leveltagName="leveltagName" :project="$route.params.id" :response="response"
                        v-on:addSuccess="addSuccess">
                    </case-dialog>
                </el-dialog>
                <el-dialog v-show="editCaseDialogVisible" title="编辑用例" :visible.sync="editCaseDialogVisible" width="70%"
                    :close-on-click-modal="false" center>
                    <case-dialog :leveltagName="leveltagName" :project="$route.params.id" :response="response"
                        v-on:updateSuccess="updateSuccess">
                    </case-dialog>
                </el-dialog>
                <el-dialog v-show="importCaseDialogVisible" title="导入用例" :visible.sync="importCaseDialogVisible" width="70%"
                    :close-on-click-modal="false" center>
                    <case-import-dialog :leveltagName="leveltagName" :project="$route.params.id" v-on:importSuccess="importSuccess">
                    </case-import-dialog>
                </el-dialog>
                <case-list-detail v-on:api="editCase" :leveltagName="leveltagName" :project="$route.params.id"
                    :update_list="update_list" :run="run" :del="del">
                </case-list-detail>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import CaseDialog from './components/CaseDialog'
    import CaseImportDialog from './components/CaseImportDialog'
    // import CaseExportDialog from './components/CaseExportDialog'
    import CaseListDetail from './components/CaseListDetail'

    export default {
        components: {
            CaseDialog,
            CaseImportDialog,
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
                update_list: false,
                run: false,
                del: false,
                response: '',
                leveltagName: '',
                addCaseDialogVisible: false,
                editCaseDialogVisible: false,
                importCaseDialogVisible: false,
                exportCaseDialogVisible: false
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
                this.editCaseDialogVisible = !this.editCaseDialogVisible;
                setTimeout(() => {
                    this.response = response;
                }, 100);
            },
            importCaseHandle() {
                this.importCaseDialogVisible = true;
            },
            importSuccess() {
                this.$notify.success({
                    message: '导入成功',
                    duration: 1500
                });
                this.update_list = !this.update_list;
                this.importCaseDialogVisible = false;
            },
            exportCaseHandle() {
                // export type: postman: json, excel
                this.$message.error('开发中');
            }
        },
        name: "CaseList"
    }
</script>

<style scoped>


</style>
