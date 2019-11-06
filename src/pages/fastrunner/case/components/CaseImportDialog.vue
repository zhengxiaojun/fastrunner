<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px" v-loading="loading">
            <el-form-item label="导入用例类型" prop="fileType">
                <el-radio-group v-model="form.fileType">
                    <el-radio label="1">Postman JSON</el-radio>
                    <el-radio label="2">Micsoft EXCEL</el-radio>
                </el-radio-group>
            </el-form-item>
            <!--            <el-form-item v-if="form.fileType === '1'" label="目录层数" prop="folder_level">
                <el-radio-group v-model="form.folder_level">
                    <el-radio label="1">1 层</el-radio>
                    <el-radio label="2">2 层</el-radio>
                </el-radio-group>
            </el-form-item> -->
            <el-form-item label="层级名称" prop="leveltagName">
                <el-select v-model="form.leveltagName" placeholder="请选择层级名称">
                    <el-option v-for="item in leveltags" :label="item.name" :key="item.id" :value="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用例上传" prop="casefile">
                <el-upload class="upload-demo" action="" :http-request="uploadFile" :multiple="false" :before-upload="beforeUpload"
                    ref="upload" :file-list="fileList" :on-change="handleChange" :on-success="uploadSuccess" drag>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传Json/Excel文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="importCase">开始导入</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    export default {
        props: {
            leveltagName: {
                require: false
            },
            project: {
                require: false
            },
            response: {
                require: false
            }
        },
        methods: {
            getLevelTagNamesByLtype() {
                this.$api.getLevelTagList({
                    params: {
                        project: this.project,
                        search: '',
                        ltype: '1'
                    }
                }).then(res => {
                    this.leveltags = res.results;
                })
            },
            validateData() {
                if (this.form.fileType === '') {
                    this.$notify.error({
                        message: '请选择用例文件类型',
                        duration: 1500
                    });
                    return false;
                }
                if (this.form.leveltagName === '') {
                    this.$notify.error({
                        message: '请选择层级名称',
                        duration: 1500
                    });
                    return false;
                }
                if (this.fileList.length === 0) {
                    this.$notify.error({
                        message: '请选择上传的用例文件',
                        duration: 1500
                    });
                    return false;
                }
                return true
            },
            importCase() {
                if (this.validateData()) {
                    this.loading = true;
                    this.$api.importCase({
                        project: this.project,
                        filetype: this.form.fileType,
                        filename: this.filename,
                        leveltagName: this.form.leveltagName,
                        folder_level: this.form.folder_level
                    }).then(resp => {
                        if (resp.success) {
                            this.loading = false;
                            this.$emit('importSuccess');
                        } else {
                            this.$message.error({
                                message: resp.msg,
                                duration: 1000
                            })
                        }
                    })
                }
            },
            reset() {
                this.$refs['form'].resetFields();
                this.$refs.upload.clearFiles();
            },
            beforeUpload(file) {
                var FileExt = file.name.replace(/.+\./, "");
                if (['json', 'xlsx'].indexOf(FileExt.toLowerCase()) === -1) {
                    this.$message({
                        type: 'warning',
                        message: '请上传后缀名为 json 或 xlsx 的文件！'
                    });
                    return false;
                }
            },
            handleChange(file, fileList) {
                this.fileList = fileList.slice(-1); //只保留最新的文件
            },
            uploadFile(uploadFile) {
                this.filename = uploadFile.file.name;
                let file = uploadFile.file;
                let formData = new FormData();
                formData.append('file', file);
                formData.append('filename', this.filename);

                this.$api.uploadFile(formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(res => {
                    console.log(res);
                })
            },
            uploadSuccess(response, file, fileList) {
                console.log(response);
                console.log(file);
                console.log(fileList);
            }

        },
        data() {
            return {
                loading: false,
                leveltags: [],
                limit: 1,
                filename: '',
                fileList: [],
                form: {
                    fileType: '',
                    folder_level: '1',
                    leveltagName: ''
                },
                rules: {
                    fileType: [{
                        required: true,
                        message: '请选择用例类型',
                        trigger: 'change'
                    }],
                    leveltagName: [{
                        required: true,
                        message: '请选择层级名称',
                        trigger: 'change'
                    }],
                    casefile: [{
                        required: true,
                        message: '请上传用例文件',
                        trigger: 'blur '
                    }],
                }
            }
        },
        mounted() {
            this.getLevelTagNamesByLtype();
        },
        name: "CaseImportDialog"
    }
</script>

<style scoped>
    .request {
        margin-top: 15px;
        border: 1px solid #ddd;
    }
</style>
