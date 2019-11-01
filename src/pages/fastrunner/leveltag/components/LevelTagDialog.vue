<template>
    <div>
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="层级名称" prop="name">
                <el-input v-model="form.name" placeholder="请输入层级名称"></el-input>
            </el-form-item>
            <el-form-item label="层级" prop="level">
                <el-select v-model="form.level" placeholder="请选择层级" @change="getParentInfo">
                    <el-option label="一级" value="1"></el-option>
                    <el-option label="二级" value="2"></el-option>
                    <el-option label="三级" value="3"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="父级名称" v-if="this.form.level === '2' || this.form.level === '3'" prop="parentName">
                <el-select v-model="form.parentName" placeholder="请选择层级">
                    <el-option v-for="item in this.parent" :key="item.id" :label="item.name" :value="item.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="层级类别" prop="ltype">
                <el-radio-group v-model="form.ltype">
                    <el-radio label="1">用例</el-radio>
                    <el-radio label="2">套件</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleOpt">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>


<script>
    export default {
        props: {
            response: {
                require: false
            },
            project: {
                require: false
            },
            opt: {
                require: false
            },
            reset: Boolean
        },
        watch: {
            response: function() {
                this.form.id = this.response.id;
                this.form.name = this.response.name;
                this.form.level = this.response.level;
                this.form.parentName = this.response.parentName;
                this.form.ltype = this.response.ltype;
            },
            reset: function() {
                this.$refs.form.resetFields();
                this.parent = [];
            }
        },
        methods: {
            handleOpt() {
                if (this.opt == 'add') {
                    this.addLevelTag();
                }
                if (this.opt == 'update') {
                    this.updateLevelTag();
                }
            },
            validateData() {
                if (this.form.name === '') {
                    this.$notify.error({
                        message: '层级名称不能为空',
                        duration: 1500
                    });
                    return false;
                }
                if (this.form.level === '') {
                    this.$notify.error({
                        message: '层级不能为空',
                        duration: 1500
                    });
                    return false;
                }
                if (this.form.level != 1 && this.form.parentName === '') {
                    this.$notify.error({
                        message: '父级名称不能为空',
                        duration: 1500
                    });
                    return false;
                }
                return true;
            },
            // 添加
            addLevelTag() {
                if (this.validateData()) {
                    this.$api.addLevelTag({
                        project: this.project,
                        name: this.form.name,
                        level: this.form.level,
                        parentName: this.form.parentName,
                        ltype: this.form.ltype,
                    }).then(resp => {
                        if (resp.success) {
                            this.$emit('addSuccess');
                        } else {
                            this.$message.error({
                                message: resp.msg,
                                duration: 1000
                            })
                        }
                    })
                }
            },
            // 更新
            updateLevelTag() {
                if (this.validateData()) {
                    this.$api.updateLevelTag(this.form.id, {
                        project: this.project,
                        name: this.form.name,
                        level: this.form.level,
                        parentName: this.form.parentName,
                        ltype: this.form.ltype,
                    }).then(resp => {
                        if (resp.success) {
                            this.$emit('updateSuccess');
                        } else {
                            this.$message.error({
                                message: resp.msg,
                                duration: 1000
                            })
                        }
                    })
                }
            },
            // 获取一二级
            getParentInfo() {
                if (this.form.level === '2' || this.form.level === '3') {
                    this.$api.getLevelTagParentList({
                        params: {
                            project: this.project,
                            level: this.form.level
                        }
                    }).then(resp => {
                        this.parent = resp;

                        //当一级改为二级，避免选到自己
                        var name = this.form.name;
                        this.parent = this.parent.filter(function(item, index, arr) {
                            return item.name != name;
                        });
                        this.form.parentName = '';
                    })
                } else {
                    this.parent = [];
                    this.form.parentName = '';
                }
            }
        },
        data() {
            return {
                form: {
                    id: '',
                    name: '',
                    level: '',
                    parentName: '',
                    ltype: '1'
                },
                parent: []
            }
        },
        name: "LevelTagDialog"
    }
</script>

<style scoped>
    .request {
        margin-top: 15px;
        border: 1px solid #ddd;
    }
</style>
