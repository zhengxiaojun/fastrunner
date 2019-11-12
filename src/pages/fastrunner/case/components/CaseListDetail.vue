<template>
    <div class="mytable">
        <el-input class="mysearch" placeholder="请输入用例名称" clearable v-model="search" @change="getCaseList">
        </el-input>
        <el-dialog title="调试报告" v-if="reportDialogVisible" :visible.sync="reportDialogVisible" width="65%" center
            :close-on-click-modal="false" append-to-body>
            <report :summary="summary"></report>
        </el-dialog>
        <el-dialog v-show="exportCaseDialogVisible" title="导出用例" :visible.sync="exportCaseDialogVisible"
            :close-on-click-modal="false" center append-to-body>
            <case-export-dialog :selectedCase="selectedCase"></case-export-dialog>
        </el-dialog>
        <el-table highlight-current-row ref="multipleTable" :data="caseData.results" height="calc(100% - 100px)"
            @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" @selection-change="handleSelectionChange"
            v-loading="loading" align="left">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column label="用例名称">
                <template slot-scope="scope">
                    <span class="block-summary-description">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="接口地址" width="350">
                <template slot-scope="scope">
                    <span class="block_url">{{scope.row.url}}</span>
                </template>
            </el-table-column>
            <el-table-column label="请求方法" width="100">
                <template slot-scope="scope">
                    <div v-if="scope.row.method.toUpperCase() === 'POST' ">
                        <span class="block-method block_method_post block_method_color">POST</span>
                    </div>

                    <div v-if="scope.row.method.toUpperCase() === 'GET' ">
                        <span class="block-method block_method_get block_method_color">GET</span>
                    </div>

                    <div v-if="scope.row.method.toUpperCase() === 'PUT' ">
                        <span class="block-method block_method_put block_method_color">PUT</span>
                    </div>

                    <div v-if="scope.row.method.toUpperCase() === 'DELETE' ">
                        <span class="block-method block_method_delete block_method_color">DELETE</span>
                    </div>

                    <div v-if="scope.row.method.toUpperCase() === 'PATCH' ">
                        <span class="block-method block_method_patch block_method_color">PATCH</span>
                    </div>

                    <div v-if="scope.row.method.toUpperCase() === 'HEAD' ">
                        <span class="block-method block_method_head block_method_color">HEAD</span>
                    </div>
                    <div v-if="scope.row.method.toUpperCase()=== 'OPTIONS' ">
                        <span class="block-method block_method_options block_method_color">OPTIONS</span>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="层级标签">
                <template slot-scope="scope">
                    <el-tag type="success">{{scope.row.leveltag_name}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-row>
                        <el-button type="info" icon="el-icon-edit" circle size="mini" @click="handleRowClick(scope.row.id)"></el-button>

                        <el-button type="success" icon="el-icon-document" circle size="mini" @click="handleCopyAPI(scope.row.id)">
                        </el-button>

                        <el-button type="primary" icon="el-icon-caret-right" circle size="mini" @click="handleRunCaseById(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleDelCase(scope.row.id)">
                        </el-button>
                    </el-row>
                </template>
            </el-table-column>

        </el-table>
        <div class="mypagination">
            <el-row>
                <el-col :span="7">
                    <el-pagination :page-size="10" background @current-change="handleCurrentChange" :current-page.sync="currentPage"
                        layout="total, prev, pager, next, jumper" :total="caseData.count">
                    </el-pagination>
                </el-col>
                <!-- page-size 需要跟后端设置保持一致 -->
            </el-row>
        </div>
    </div>
</template>

<script>
    import Report from '../../../reports/DebugReport'
    import CaseExportDialog from './CaseExportDialog'

    export default {
        components: {
            Report,
            CaseExportDialog
        },
        props: {
            run: Boolean,
            update_list: Boolean,
            leveltagName: {
                require: true
            },
            project: {
                require: true
            },
            del: Boolean,
            daochu: Boolean
        },
        data() {
            return {
                checked: false,
                search: '',
                loading: false,
                reportDialogVisible: false,
                exportCaseDialogVisible: false,
                summary: {},
                selectedCase: [],
                currentRow: '',
                currentPage: 1,
                caseData: {
                    count: 0,
                    results: []
                }
            }
        },
        watch: {
            update_list() {
                this.search = '';
                this.getCaseList();
            },
            checked() {
                if (this.checked) {
                    this.toggleAll();
                } else {
                    this.toggleClear();
                }
            },
            del() {
                if (this.selectedCase.length !== 0) {
                    this.$confirm('此操作将永久删除选择的用例，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllCase({
                            data: this.selectedCase
                        }).then(resp => {
                            if (resp.success) {
                                this.$notify.success({
                                    message: '删除成功',
                                    duration: 1500
                                });
                                this.search = '';
                                this.getCaseList();
                            } else {
                                this.$message.error(resp.msg);
                            }
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少选择一个用例',
                        duration: 1000
                    })
                }
            },
            daochu() {
                this.exportCaseDialogVisible = true;
            }
        },
        methods: {
            handleCopyAPI(id) {
                this.$prompt('请输入新用例名称', '提示', {
                    confirmButtonText: '确定',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '用例名称不能为空'
                }).then(({
                    value
                }) => {
                    this.$api.copyAPI(id, {
                        'name': value
                    }).then(resp => {
                        if (resp.success) {
                            this.$notify.success({
                                message: '复制成功',
                                duration: 1500
                            });
                            this.getCaseList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },
            handleSelectionChange(val) {
                this.selectedCase = val;
            },

            toggleAll() {
                this.$refs.multipleTable.toggleAllSelection();
            },

            toggleClear() {
                this.$refs.multipleTable.clearSelection();
            },
            // 查询用例列表
            getCaseList() {
                this.$api.getCaseList({
                    params: {
                        project: this.project,
                        leveltagName: this.leveltagName,
                        search: this.search,
                        need_page: true
                    }
                }).then(res => {
                    this.caseData = res;
                })
            },
            handleCurrentChange(val) {
                this.$api.getCasePaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.project,
                        search: this.search,
                        need_page: true
                    }
                }).then(res => {
                    this.caseData = res;
                })
            },

            //删除用例
            handleDelCase(id) {
                this.$confirm('此操作将永久删除该用例，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.delCaseById(id).then(resp => {
                        if (resp.success) {
                            this.$notify.success({
                                message: '删除成功',
                                duration: 1500
                            });
                            this.search = "";
                            this.getCaseList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },

            // 编辑用例
            handleRowClick(id) {
                this.$api.getSingleCase(id).then(resp => {
                    if (resp.success) {
                        this.$emit('api', resp);
                    } else {
                        this.$message.error(resp.msg)
                    }
                })
            },
            // 运行用例
            handleRunCaseById(id) {
                this.loading = true;
                this.$api.runCaseById(id, {
                    params: {
                        host: this.host,
                        config: this.config
                    }
                }).then(resp => {
                    this.summary = resp;
                    this.reportDialogVisible = true;
                    this.loading = false;
                }).catch(resp => {
                    this.loading = false;
                })
            },

            cellMouseEnter(row) {
                this.currentRow = row;
            },

            cellMouseLeave(row) {
                this.currentRow = '';
            }
        },
        mounted() {
            this.getCaseList();
        },
        name: "CaseListDetail"
    }
</script>

<style scoped>
    .mytable {
        position: fixed;
        bottom: 0;
        right: 0;
        left: 200px;
        top: 100px;
        padding: 0;
        margin-left: 10px;
        margin-top: 10px;
    }

    .mysearch {
        width: 300px;
        margin-left: 900px;
    }

    .mypagination {
        padding-top: 10px;
        padding-left: 20px;
    }
</style>
