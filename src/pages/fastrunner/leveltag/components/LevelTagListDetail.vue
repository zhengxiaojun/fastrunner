<template>
    <div class="mytable">
        <el-input class="mysearch" placeholder="请输入层级名称" clearable v-model="search" @change="getLevelTagList">
            <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <el-table highlight-current-row ref="multipleTable" :data="levelTagData.results" height="calc(100% - 100px)"
            @cell-mouse-enter="cellMouseEnter" @cell-mouse-leave="cellMouseLeave" @selection-change="handleSelectionChange"
            v-loading="loading" align="left">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <!-- <el-table-column label="ID">
                    <template slot-scope="scope">
                        <span class="block-summary-description">{{scope.row.id}}</span>
                    </template>
                </el-table-column> -->
            <el-table-column label="层级名称">
                <template slot-scope="scope">
                    <span class="block-summary-description">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column label="层级">
                <template slot-scope="scope">
                    <span v-if="scope.row.level === 1 ">一级</span>
                    <span v-if="scope.row.level === 2 ">二级</span>
                    <span v-if="scope.row.level === 3 ">三级</span>
                </template>
            </el-table-column>
            <el-table-column label="父级名称">
                <template slot-scope="scope">
                    <span>{{scope.row.parentName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="层级类别">
                <template slot-scope="scope">
                    <el-tag type="success" v-if="scope.row.ltype === 1 ">用例</el-tag>
                    <el-tag type="success" v-if="scope.row.ltype === 2 ">套件</el-tag>
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
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-row>
                        <el-button type="info" icon="el-icon-edit" circle size="mini" @click="handleRowClick(scope.row)"></el-button>
                        <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="handleDelApi(scope.row.id)">
                        </el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
        <div class="mypagination">
            <el-row>
                <el-col :span="7">
                    <el-pagination :page-size="10" background @current-change="handleCurrentChange" :current-page.sync="currentPage"
                        layout="total, prev, pager, next, jumper" :total="levelTagData.count">
                    </el-pagination>
                </el-col>
                <!-- page-size 需要跟后端设置保持一致 -->
            </el-row>
        </div>
    </div>

</template>

<script>
    export default {
        props: {
            project: {
                require: true
            },
            del: Boolean,
            update_list: Boolean
        },
        data() {
            return {
                checked: false,
                search: '',
                loading: false,
                selected: [],
                currentRow: '',
                currentPage: 1,
                levelTagData: {
                    count: 0,
                    results: []
                }
            }
        },
        watch: {
            update_list() {
                this.search = '';
                this.getLevelTagList();
            },
            checked() {
                if (this.checked) {
                    this.toggleAll();
                } else {
                    this.toggleClear();
                }
            },
            del() {
                if (this.selected.length !== 0) {
                    this.$confirm('此操作将永久删除选择的层级标签，是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning',
                    }).then(() => {
                        this.$api.delAllLevelTag({
                            data: this.selected
                        }).then(resp => {
                            this.search = '';
                            this.getLevelTagList();
                        })
                    })
                } else {
                    this.$notify.warning({
                        title: '提示',
                        message: '请至少选择一个层级标签',
                        duration: 1000
                    })
                }
            }
        },
        methods: {
            handleSelectionChange(val) {
                this.selected = val;
            },

            toggleAll() {
                this.$refs.multipleTable.toggleAllSelection();
            },

            toggleClear() {
                this.$refs.multipleTable.clearSelection();
            },
            // 列表
            getLevelTagList() {
                this.loading = true;
                this.$api.getLevelTagList({
                    params: {
                        project: this.project,
                        search: this.search,
                        ltype: ''
                    }
                }).then(res => {
                    this.levelTagData = res;
                    this.loading = false;
                })
            },
            // 下一页
            handleCurrentChange(val) {
                this.$api.getLevelTagPaginationBypage({
                    params: {
                        page: this.currentPage,
                        project: this.project,
                        search: this.search
                    }
                }).then(res => {
                    this.levelTagData = res;
                })
            },
            // 编辑
            handleRowClick(row) {
                this.$api.getSingleLevelTag(row.id).then(resp => {
                    if (resp.success) {
                        this.$emit('api', resp);
                    } else {
                        this.$message.error(resp.msg)
                    }
                })
            },
            //删除
            handleDelApi(id) {
                this.$confirm('此操作将永久删除该层级标签，是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                }).then(() => {
                    this.$api.deleteLevelTag(id).then(resp => {
                        if (resp.success) {
                            this.$notify.success({
                                message: '删除成功',
                                duration: 1500
                            });
                            this.search = "";
                            this.getLevelTagList();
                        } else {
                            this.$message.error(resp.msg);
                        }
                    })
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
            this.getLevelTagList();
        },
        name: "LevelTagListDetail"
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
