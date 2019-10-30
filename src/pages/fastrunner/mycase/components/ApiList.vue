<template>
    <div>
        <div>
            <el-input placeholder="请输入用例名称" clearable v-model="search" style="width: 300px;margin-left: 930px;">
            </el-input>
            <el-dialog title="调试报告" v-if="reportDialogVisible" :visible.sync="reportDialogVisible" width="65%" center>
                <report :summary="summary"></report>
            </el-dialog>
            <el-table highlight-current-row ref="multipleTable" :data="apiData.results.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
                height="530px" :page-size="3" @selection-change="handleSelectionChange" v-loading="loading" align="left">
                <el-table-column type="selection" width="50">
                </el-table-column>
                <el-table-column label="用例名称">
                    <template slot-scope="scope">
                        <span class="block-summary-description">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="接口地址">
                    <template slot-scope="scope">
                        <span class="block_url">{{scope.row.url}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="请求方法">
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
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-row>
                            <el-button type="info" icon="el-icon-edit" circle size="mini" @click="handleRowClick(scope.row)"></el-button>

                            <el-button type="success" icon="el-icon-document" circle size="mini" @click="handleCopyAPI(scope.row.id)">
                            </el-button>

                            <el-button type="primary" icon="el-icon-caret-right" circle size="mini" @click="handleRunAPI(scope.row.id)"></el-button>
                            <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleDelApi(scope.row.id)">
                            </el-button>
                        </el-row>
                    </template>
                </el-table-column>

            </el-table>
        </div>
        <div style=" padding-left: 10px;">
            <el-row>
                <el-col :span="7">
                    <el-pagination style="margin-top: 5px" :page-size="10" background @current-change="handleCurrentChange"
                        :current-page.sync="currentPage" layout="total, prev, pager, next, jumper" :total="apiData.count">
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
        name: "ApiList",
        props: {
            host: {
                require: true
            },
            config: {
                require: true
            },
            run: Boolean,
            update_list: Boolean,
            node: {
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
                reportName: '',
                asyncs: false,
                filterText: '',
                loading: false,
                expand: '&#xe65f;',
                reportDialogVisible: false,
                summary: {},
                selectAPI: [],
                currentRow: '',
                currentPage: 1,
                apiData: {
                    count: 0,
                    results: []
                }
            }
        },
        watch: {
            run() {
                this.asyncs = false;
                this.reportName = "";
            },
            update_list() {
                this.search = '';
                this.getAPIList();
            },
            node() {
                this.search = '';
                this.getAPIList();
            },
            checked() {
                if (this.checked) {
                    this.toggleAll();
                } else {
                    this.toggleClear();
                }
            },

            del() {
                if (this.selectAPI.length !== 0) {
                    this.$confirm('此操作将永久删除API，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllAPI({
                            data: this.selectAPI
                        }).then(resp => {
                            this.search = '';
                            this.getAPIList();
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少选择一个接口',
                        duration: 1000
                    })
                }
            }
        },

        methods: {
            handleCopyAPI(id) {
                this.$prompt('请输入接口名称', '提示', {
                    confirmButtonText: '确定',
                    inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                    inputErrorMessage: '接口名称不能为空'
                }).then(({
                    value
                }) => {
                    this.$api.copyAPI(id, {
                        'name': value
                    }).then(resp => {
                        if (resp.success) {
                            this.getAPIList();
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
                this.selectAPI = val;
            },

            toggleAll() {
                this.$refs.multipleTable.toggleAllSelection();
            },

            toggleClear() {
                this.$refs.multipleTable.clearSelection();
            },
            // 查询api列表
            getAPIList() {
                this.$api.apiList({
                    params: {
                        node: this.node,
                        project: this.project,
                        search: this.search
                    }
                }).then(res => {
                    this.apiData = res;
                    console.log(res);
                })
            },
            handleCurrentChange(val) {
                this.$api.getPaginationBypage({
                    params: {
                        page: this.currentPage,
                        node: this.node,
                        project: this.project,
                        search: this.search
                    }
                }).then(res => {
                    this.apiData = res;
                })
            },

            //删除api
            handleDelApi(index) {
                this.$confirm('此操作将永久删除该API，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.delAPI(index).then(resp => {
                        if (resp.success) {
                            this.search = "";
                            this.getAPIList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },

            // 编辑API
            handleRowClick(row) {
                this.$api.getAPISingle(row.id).then(resp => {
                    if (resp.success) {
                        this.$emit('api', resp);
                    } else {
                        this.$message.error(resp.msg)
                    }
                })
            },
            // 运行API
            handleRunAPI(id) {
                this.loading = true;
                this.$api.runAPIByPk(id, {
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
            this.getAPIList();
        }
    }
</script>

<style scoped>


</style>
