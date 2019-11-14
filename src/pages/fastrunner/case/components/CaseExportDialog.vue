<template>
    <div>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px" v-loading="loading">
            <el-form-item label="文件类型" prop="fileType">
                <el-radio-group v-model="form.fileType">
                    <el-radio label="1" disabled>Postman JSON</el-radio>
                    <el-radio label="2">Micsoft EXCEL</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="导出方式" prop="exportMethod">
                <el-radio-group v-model="form.exportMethod" @change="hide">
                    <el-radio label="1">全部的用例</el-radio>
                    <el-radio label="2">选中的用例</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="文件名称" prop="fileName">
                <el-input placeholder="请输入导出文件名称" v-model="form.fileName" clearable>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="success" @click="exportCase">开始导出</el-button>
                <download-csv v-if="downloadFlag" class="btn btn-default" :data="json_data" :name="exportFileName">
                    <el-button type="infor" @click="hide">点击下载</el-button>
                </download-csv>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import JsonCSV from 'vue-json-csv'
    export default {
        props: {
            selectedCase: Array
        },
        components: {
            'downloadCsv': JsonCSV
        },
        methods: {
            validateData() {
                if (this.form.fileType === '') {
                    this.$notify.error({
                        message: '请选择导出文件类型',
                        duration: 1500
                    });
                    return false;
                }
                if (this.form.exportMethod === '') {
                    this.$notify.error({
                        message: '请选择导出方式',
                        duration: 1500
                    });
                    return false;
                }
                if (this.form.fileName === '') {
                    this.$notify.error({
                        message: '请输入导出文件名称',
                        duration: 1500
                    });
                    return false;
                }
                return true
            },
            exportCase() {
                if (this.validateData()) {
                    if (this.form.exportMethod === '2') {
                        if (this.selectedCase.length === 0) {
                            this.$notify.warning({
                                title: '提示',
                                message: '请至少选择一个用例',
                                duration: 1000
                            });
                            this.downloadFlag = false;
                        } else {
                            this.loading = true;
                            this.downloadFlag = true;
                            this.json_data = this.parseBody(this.selectedCase)
                            this.loading = false;
                        }
                    } else {
                        this.loading = true;
                        this.$api.getCaseList({
                            params: {
                                project: this.$route.params.id,
                                leveltagName: '',
                                search: '',
                                need_page: false
                            }
                        }).then(res => {
                            this.json_data = this.parseBody(res);
                            this.loading = false;
                            this.downloadFlag = true;
                        })
                    }
                    this.exportFileName = `${this.form.fileName}.csv`;
                }
            },
            hide() {
                this.downloadFlag = false;
            },
            parseBody(rows) {
                const p_rows = [];
                for (let row of rows) {
                    row.body = JSON.stringify(row.body);
                    p_rows.push(row);
                }
                return p_rows;
            },
            download(data) {
                const blob = new Blob([data]);
                const fileName = `${this.form.fileName}.json`;
                if ("download" in document.createElement("a")) {
                    // 非IE下载
                    const elink = document.createElement("a");
                    elink.download = fileName;
                    elink.style.display = "none";
                    elink.href = URL.createObjectURL(blob);
                    document.body.appendChild(elink);
                    elink.click();
                    URL.revokeObjectURL(elink.href); // 释放URL 对象
                    document.body.removeChild(elink);
                } else {
                    // IE10+下载
                    navigator.msSaveBlob(blob, fileName);
                }
            }
        },
        data() {
            return {
                loading: false,
                form: {
                    fileType: '',
                    fileName: '',
                    exportMethod: ''
                },
                exportFileName: '',
                downloadFlag: false,
                json_data: [],
                rules: {
                    fileType: [{
                        required: true,
                        message: '请选择导出文件类型',
                        trigger: 'blur'
                    }],
                    exportMethod: [{
                        required: true,
                        message: '请选择导出方式',
                        trigger: 'blur'
                    }],
                    fileName: [{
                        required: true,
                        message: '请输入导出文件名称',
                        trigger: 'blur '
                    }],
                }
            }
        },
        name: "CaseExportDialog"
    }
</script>

<style scoped>

</style>
