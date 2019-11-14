<template>
    <el-container>
        <el-header style="background: #fff; padding: 0; height: 50px">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 10px">
                    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addTaskHandle">添加任务
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="del = !del">批量删除</el-button>
                </div>
            </div>
        </el-header>

        <el-container>
            <el-main>
                <el-dialog v-show="addTaskDialogVisible" title="添加任务" :visible.sync="addTaskDialogVisible" width="60%"
                    :close-on-click-modal="false" center>
                    <task-dialog :project="$route.params.id" v-on:addSuccess="addSuccess" :opt="opt" :reset="reset">
                    </task-dialog>
                </el-dialog>
                <el-dialog v-show="editTaskDialogVisible" title="编辑任务" :visible.sync="editTaskDialogVisible" width="60%"
                    :close-on-click-modal="false" center>
                    <task-dialog :leveltagName="leveltagName" :project="$route.params.id" :response="response"
                        v-on:updateSuccess="updateSuccess" :opt="opt">
                    </task-dialog>
                </el-dialog>
                <task-list-detail v-on:api="editTaskHandle" :project="$route.params.id" :update_list="update_list" :del="del"></task-list-detail>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import TaskDialog from './components/TaskDialog'
    import TaskListDetail from './components/TaskListDetail'

    export default {
        components: {
            TaskDialog,
            TaskListDetail
        },
        data() {
            return {
                update_list: false,
                del: false,
                reset: false,
                opt: '',
                response: '',
                leveltagName: '',
                addTaskDialogVisible: false,
                editTaskDialogVisible: false
            }
        },
        methods: {
            addTaskHandle() {
                this.addTaskDialogVisible = true;
                this.opt = 'add';
                this.reset = !this.reset;
            },
            addSuccess() {
                this.$notify.success({
                    message: '添加成功',
                    duration: 1500
                });
                this.update_list = !this.update_list;
                this.addTaskDialogVisible = false;
            },
            editTaskHandle(response) {
                this.editTaskDialogVisible = !this.editTaskDialogVisible;
                this.opt = 'update';
                setTimeout(() => {
                    this.response = response;
                }, 100);
            },
            updateSuccess() {
                this.$notify.success({
                    message: '更新成功',
                    duration: 1500
                });
                this.update_list = !this.update_list;
                this.editTaskDialogVisible = false;
            }
        },
        name: "TaskList"
    }
</script>

<style scoped>
</style>
