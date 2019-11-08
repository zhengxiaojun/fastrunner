<template>
    <div class="mytable">
        <el-input class="mysearch" placeholder="请输入套件名称" clearable v-model="search" @change="getSuiteList">
        </el-input>
        <el-dialog title="调试报告" v-if="reportDialogVisible" :visible.sync="reportDialogVisible" width="65%" center
            :close-on-click-modal="false" append-to-body>
            <report :summary="summary"></report>
        </el-dialog>
        <el-table highlight-current-row ref="multipleTable" :data="suiteData.results" height="calc(100% - 100px)"
            @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" @selection-change="handleSelectionChange"
            v-loading="loading" align="left">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column label="套件名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="用例个数">
                <template slot-scope="scope">
                    <span>{{scope.row.length}}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建时间">
                <template slot-scope="scope">
                    <span>{{scope.row.create_time | datetimeFormat}}</span>
                </template>
            </el-table-column>
            <el-table-column label="更新时间">
                <template slot-scope="scope">
                    <span>{{scope.row.update_time | datetimeFormat}}</span>
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
                        <el-button type="info" icon="el-icon-edit" circle size="mini" @click="handleRowClick(scope.row)"></el-button>

                        <el-button type="success" icon="el-icon-document" circle size="mini" @click="handleCopySuite(scope.row.id)">
                        </el-button>

                        <el-button type="primary" icon="el-icon-caret-right" circle size="mini" @click="handleRunSuite(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleDelSuite(scope.row.id)">
                        </el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <div class="mypagination">
            <el-row>
                <el-col :span="7">
                    <el-pagination :page-size="10" background @current-change="handleCurrentChange" :current-page.sync="currentPage"
                        layout="total, prev, pager, next, jumper" :total="suiteData.count">
                    </el-pagination>
                </el-col>
                <!-- page-size 需要跟后端设置保持一致 -->
            </el-row>
        </div>
    </div>
</template>

<script>
    import Report from '../../../reports/DebugReport'

    export default {
        components: {
            Report
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
            del: Boolean
        },
        data() {
            return {
                checked: false,
                search: '',
                loading: false,
                reportDialogVisible: false,
                summary: {},
                selectedSuite: [],
                currentRow: '',
                currentPage: 1,
                suiteData: {
                    count: 0,
                    results: []
                }
            }
        },
        watch: {
            update_list() {
                this.search = '';
                this.getSuiteList();
            },
            checked() {
                if (this.checked) {
                    this.toggleAll();
                } else {
                    this.toggleClear();
                }
            },
            del() {
                if (this.selectedSuite.length !== 0) {
                    this.$confirm('此操作将永久删除选择的套件，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.deleteAllSuite({
                            data: this.selectedSuite
                        }).then(resp => {
                            this.$notify.success({
                                message: '删除成功',
                                duration: 1500
                            });
                            this.search = '';
                            this.getSuiteList();
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少选择一个套件',
                        duration: 1000
                    })
                }
            }
        },

        methods: {
            handleCopySuite(id) {
                this.$prompt('请输入新套件名称', '提示', {
                    confirmButtonText: '确定',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '套件名称不能为空'
                }).then(({
                    value
                }) => {
                    this.$api.copySuite(id, {
                        'name': value
                    }).then(resp => {
                        if (resp.success) {
                            this.$notify.success({
                                message: '复制成功',
                                duration: 1500
                            });
                            this.getSuiteList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            handleSelectionChange(val) {
                this.selectedSuite = val;
            },

            toggleAll() {
                this.$refs.multipleTable.toggleAllSelection();
            },

            toggleClear() {
                this.$refs.multipleTable.clearSelection();
            },
            // 查询套件列表
            getSuiteList() {
                this.$api.getSuiteList({
                    params: {
                        project: this.project,
                        search: this.search
                    }
                }).then(res => {
                    this.suiteData = res;
                })
            },
            handleCurrentChange(val) {
                this.$api.getSuitePaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.project,
                        search: this.search
                    }
                }).then(res => {
                    this.suiteData = res;
                })
            },
            //删除套件
            handleDelSuite(id) {
                this.$confirm('此操作将永久删除该套件，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteSuiteById(id).then(resp => {
                        if (resp.success) {
                            this.$notify.success({
                                message: '删除成功',
                                duration: 1500
                            });
                            this.search = "";
                            this.getSuiteList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },
            // 编辑套件
            handleRowClick(row) {
                this.$api.getSingleSuite(row.id).then(resp => {
                    if (resp.success) {
                        this.$emit('api', resp);
                    } else {
                        this.$message.error(resp.msg)
                    }
                });
            },
            // 运行套件
            handleRunSuite(id) {
                this.loading = true;
                this.$api.runSuiteById(id, {
                    params: {
                        project: this.project
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
            this.getSuiteList();
        },
        name: "SuiteListDetail"
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
