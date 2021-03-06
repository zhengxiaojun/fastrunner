<template>
    <div class="mytable">
        <el-input class="mysearch" placeholder="请输入任务名称" clearable v-model="search" @change="getTaskList">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-table highlight-current-row ref="multipleTable" :data="tasksData.results" height="calc(100% - 100px)"
            @selection-change="handleSelectionChange" v-loading="loading" align="left">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column label="任务名称">
                <template slot-scope="scope">
                    <span class="block-summary-description">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="时间配置">
                <template slot-scope="scope">
                    <span class="block_url">{{scope.row.kwargs.crontab}}</span>
                </template>
            </el-table-column>
            <el-table-column label="邮件策略">
                <template slot-scope="scope">
                    <span class="block_url">{{scope.row.kwargs.strategy}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.enabled === true">启用</el-tag>
                    <el-tag type="success" v-if="scope.row.enabled === false">未启用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="接收人">
                <template slot-scope="scope">
                    <div>{{scope.row.kwargs.receiver}}</div>
                </template>
            </el-table-column>
            <el-table-column label="抄送人">
                <template slot-scope="scope">
                    <div>{{scope.row.kwargs.copy}}</div>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-row>
                        <el-button type="info" icon="el-icon-edit" circle size="mini" @click="handleRowClick(scope.row.id)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delTaskById(scope.row.id)">
                        </el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <div class="mypagination">
            <el-row>
                <el-col :span="7">
                    <el-pagination :page-size="10" background @current-change="handleCurrentChange" :current-page.sync="currentPage"
                        layout="total, prev, pager, next, jumper" :total="tasksData.count">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
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
                selectedTask: [],
                currentRow: '',
                currentPage: 1,
                tasksData: {
                    count: 0,
                    results: []
                }
            }
        },
        watch: {
            update_list() {
                this.search = '';
                this.getTaskList();
            },
            checked() {
                if (this.checked) {
                    this.toggleAll();
                } else {
                    this.toggleClear();
                }
            },
            del() {
                if (this.selectedTask.length !== 0) {
                    this.$confirm('此操作将永久删除选择的任务，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllTask({
                            data: this.selectedTask
                        }).then(resp => {
                            if (resp.success) {
                                this.$notify.success({
                                    message: '删除成功',
                                    duration: 1500
                                });
                                this.search = '';
                                this.getTaskList();
                            } else {
                                this.$message.error(resp.msg);
                            }
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少选择一个任务!',
                        duration: 1000
                    })
                }
            }
        },
        methods: {
            // 查询任务列表
            getTaskList() {
                this.$api.getTaskList({
                    params: {
                        project: this.project,
                        search: this.search
                    }
                }).then(resp => {
                    this.tasksData = resp
                })
            },
            // 编辑任务
            handleRowClick(id) {
                this.$api.getSingleTask(id).then(resp => {
                    if (resp.success) {
                        this.$emit('api', resp);
                    } else {
                        this.$message.error(resp.msg)
                    }
                })
            },
            //删除任务
            delTaskById(id) {
                this.$confirm('此操作将永久删除该定时任务，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.delTaskById(id).then(resp => {
                        if (resp.success) {
                            this.$notify.success({
                                message: '删除成功',
                                duration: 1500
                            });
                            this.search = "";
                            this.getTaskList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
                })
            },
            handleCurrentChange(val) {
                this.$api.getTaskPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.$route.params.id
                    }
                }).then(resp => {
                    this.tasksData = resp;
                })
            },
            handleSelectionChange(val) {
                this.selectedTask = val;
            },
            toggleAll() {
                this.$refs.multipleTable.toggleAllSelection();
            },
            toggleClear() {
                this.$refs.multipleTable.clearSelection();
            },
            cellMouseEnter(row) {
                this.currentRow = row;
            },
            cellMouseLeave(row) {
                this.currentRow = '';
            }
        },
        mounted() {
            this.getTaskList();
        },
        name: "TaskListDetail"
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
