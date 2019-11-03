<template>

    <el-container>
        <el-header style="background: #fff; padding: 0; ">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 10px">
                    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addSuiteHandle">添加套件
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="del = !del">批量删除</el-button>
                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0;">
                <el-dialog v-show="addSuiteDialogVisible" title="添加套件" :visible.sync="addSuiteDialogVisible" width="70%"
                    center>
                    <suite-dialog :leveltagName="leveltagName" :project="$route.params.id" :response="response"
                        v-on:addSuccess="addSuccess" :opt="opt" :reset="reset">
                    </suite-dialog>
                </el-dialog>
                <el-dialog v-show="editSuiteDialogVisible" title="编辑套件" :visible.sync="editSuiteDialogVisible" width="70%"
                    center>
                    <suite-dialog :leveltagName="leveltagName" :project="$route.params.id" :response="response"
                        v-on:updateSuccess="updateSuccess" :opt="opt">
                    </suite-dialog>
                </el-dialog>
                <suite-list-detail v-on:api="editSuiteHandle" :leveltagName="leveltagName" :project="$route.params.id"
                    :update_list="update_list" :run="run" :del="del">
                </suite-list-detail>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import SuiteDialog from './components/SuiteDialog'
    import SuiteListDetail from './components/SuiteListDetail'

    export default {
        components: {
            SuiteDialog,
            SuiteListDetail
        },
        data() {
            return {
                update_list: false,
                opt: '',
                reset: false,
                run: false,
                del: false,
                response: '',
                leveltagName: '',
                addSuiteDialogVisible: false,
                editSuiteDialogVisible: false
            }
        },
        methods: {
            addSuiteHandle() {
                this.addSuiteDialogVisible = true;
                this.opt = 'add';
                this.reset = !this.reset;
            },
            addSuccess() {
                this.$notify.success({
                    message: '添加成功',
                    duration: 1500
                });
                this.update_list = !this.update_list;
                this.addSuiteDialogVisible = false;
            },
            editSuiteHandle(response) {
                this.editSuiteDialogVisible = !this.editSuiteDialogVisible;
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
                this.editSuiteDialogVisible = false;
            }
        },
        name: "SuiteList"
    }
</script>

<style scoped>


</style>
