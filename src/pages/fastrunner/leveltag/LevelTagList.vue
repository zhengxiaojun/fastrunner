<template>
    <el-container>
        <el-header style="background: #fff; padding: 0; ">
            <div class="nav-api-header">
                <div style="padding-top: 10px; margin-left: 10px">
                    <el-button type="primary" size="small" icon="el-icon-circle-plus-outline" @click="addLevelTagHandle">添加层级
                    </el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="del = !del">批量删除</el-button>
                </div>
            </div>
        </el-header>

        <el-container>
            <el-main style="padding: 0;">
                <el-dialog v-show="addLevelTagDialogVisible" title="添加层级" :visible.sync="addLevelTagDialogVisible"
                    :close-on-click-modal="false" width="50%" center>
                    <level-tag-dialog v-on:addSuccess="addSuccess" :project="$route.params.id" :opt="opt" :reset="reset"></level-tag-dialog>
                </el-dialog>
                <el-dialog v-show="editLevelTagDialogVisible" title="编辑层级" :visible.sync="editLevelTagDialogVisible"
                    :close-on-click-modal="false" width="50%" center>
                    <level-tag-dialog v-on:updateSuccess="updateSuccess" :response="response" :project="$route.params.id"
                        :opt="opt" :reset="reset"></level-tag-dialog>
                </el-dialog>
                <level-tag-list-detail v-on:api="editLevelTagHandle" :project="$route.params.id" :update_list="update_list"
                    :del="del"></level-tag-list-detail>
            </el-main>
        </el-container>
    </el-container>

</template>

<script>
    import LevelTagDialog from './components/LevelTagDialog'
    import LevelTagListDetail from './components/LevelTagListDetail'

    export default {
        components: {
            LevelTagDialog,
            LevelTagListDetail
        },
        data() {
            return {
                addLevelTagDialogVisible: false,
                editLevelTagDialogVisible: false,
                project: '',
                opt: '',
                reset: false,
                del: false,
                update_list: false,
                response: ''
            }
        },
        methods: {
            addLevelTagHandle() {
                this.addLevelTagDialogVisible = true;
                this.opt = 'add'
                this.reset = !this.reset;
            },
            addSuccess() {
                this.$notify.success({
                    message: '添加成功',
                    duration: 1500
                });
                this.update_list = !this.update_list;
                this.addLevelTagDialogVisible = false;
            },
            editLevelTagHandle(resp) {
                this.editLevelTagDialogVisible = true;
                this.opt = 'update'
                setTimeout(() => {
                    this.response = resp.data;
                }, 100);
            },
            updateSuccess() {
                this.$notify.success({
                    message: '更新成功',
                    duration: 1500
                });
                this.update_list = !this.update_list;
                this.editLevelTagDialogVisible = false;
            }
        },
        name: "LevelTagList"
    }
</script>

<style scoped>


</style>
