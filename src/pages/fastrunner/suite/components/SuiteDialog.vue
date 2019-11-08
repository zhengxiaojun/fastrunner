<template>
    <div>
        <el-steps :active="active" finish-status="success">
            <el-step title="选择用例"></el-step>
            <el-step title="保存"></el-step>
        </el-steps>
        <div style="margin-left: 200px;" v-if="active === 0">
            <el-transfer filterable :filter-method="filterMethod" filter-placeholder="请输入用例名称" v-model="value" :data="data"
                :titles="['未选择的用例', '已选择的用例']" :format="{noChecked: '${total}',hasChecked: '${checked}/${total}'}"
                target-order="push">
            </el-transfer>
        </div>
        <div style="margin-left: 200px;" v-if="active === 1">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="套件名称" prop="name">
                    <el-input v-model="ruleForm.name" style="width: 300px;" placeholder="请输入套件名称"></el-input>
                </el-form-item>
                <el-form-item label="层级名称" prop="leveltag_name">
                    <el-select v-model="ruleForm.leveltag_name" placeholder="请选择层级名称">
                        <el-option v-for="item in leveltags" :label="item.name" :key="item.id" :value="item.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleOpt">保存</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-button type="primary" style="margin-top: 20px;" plain @click="prev" v-if="active === 1">上一步</el-button>
        <el-button type="primary" style="margin-top: 20px;" plain @click="next" v-if="active === 0">下一步</el-button>
    </div>
</template>

<script>
    export default {
        props: {
            project: {
                require: false
            },
            response: {
                require: false
            },
            opt: {
                require: false
            },
            reset: Boolean
        },
        methods: {
            prev() {
                this.active = 0;
            },
            next() {
                if (this.value.length === 0) {
                    this.$notify.warning({
                        duration: 1000,
                        message: '请至少选择一条用例！'
                    });
                    return;
                }
                this.active = 1;
            },
            filterMethod(query, item) {
                return item.label.indexOf(query) > -1;
            },
            // 用例列表
            getCaseList() {
                this.$api.getCaseList({
                    params: {
                        project: this.project,
                        leveltagName: '',
                        search: '',
                        need_page: false
                    }
                }).then(res => {
                    const data = [];
                    res.forEach((item, index) => {
                        data.push({
                            label: item.name,
                            key: item.id,
                            step: index
                        });
                    });
                    this.data = data;
                })
            },
            // 根据层级标签获取层级名称
            getLevelTagNamesByLtype() {
                this.$api.getLevelTagList({
                    params: {
                        project: this.project,
                        search: '',
                        ltype: '2'
                    }
                }).then(res => {
                    this.leveltags = res.results;
                })
            },
            getselectedCases() {
                this.caseList = [];
                for (let key of this.value) {
                    for (let item of this.data) {
                        if (key === item.key) {
                            this.caseList.push({
                                case_id: item.key,
                                case_name: item.label,
                                step: this.value.indexOf(key)
                            });
                        }
                    }
                }
            },
            validateData() {
                if (this.ruleForm.name === '') {
                    this.$notify.error({
                        message: '套件名称不能为空',
                        duration: 1500
                    });
                    return false;
                }

                if (this.ruleForm.leveltag_name === '') {
                    this.$notify.error({
                        message: '层级名称不能为空',
                        duration: 1500
                    });
                    return false;
                }
                return true
            },
            handleOpt() {
                if (this.opt == 'add') {
                    this.addSuite();
                }
                if (this.opt == 'update') {
                    this.updateSuite();
                }
            },
            // 添加套件
            addSuite() {
                this.getselectedCases();
                if (this.validateData()) {
                    this.$api.addSuite({
                        project: this.project,
                        name: this.ruleForm.name,
                        case_list: this.caseList,
                        length: this.value.length,
                        leveltag_name: this.ruleForm.leveltag_name
                    }).then(resp => {
                        if (resp.success) {
                            this.$emit("addSuccess");
                        } else {
                            this.$message({
                                message: resp.msg,
                                type: 'error',
                                duration: 1000
                            });
                        }
                    })
                }
            },
            // 更新套件
            updateSuite() {
                this.getselectedCases();
                if (this.validateData()) {
                    this.$api.updateSuite(this.response.data.id, {
                        project: this.project,
                        name: this.ruleForm.name,
                        case_list: this.caseList,
                        length: this.value.length,
                        leveltag_name: this.ruleForm.leveltag_name
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
            }
        },
        watch: {
            response: function() {
                this.ruleForm.name = this.response.data.name;
                this.ruleForm.leveltag_name = this.response.data.leveltag_name;
                this.caseList = this.response.data.case_list;
                this.value = [];
                for (let item of this.caseList) {
                    this.value.push(item.case_id); // value [key]
                }
            },
            reset: function() {
                this.ruleForm.name = '';
                this.ruleForm.leveltag_name = '';
                this.value = [];
                this.active = 0;
            }
        },
        data() {
            return {
                active: 0,
                data: [], // 所有的用例
                value: [], // 选中的用例 index
                caseList: [],
                leveltags: [],
                ruleForm: {
                    name: '',
                    leveltag_name: ''
                },
                rules: {
                    name: [{
                            required: true,
                            message: '请输入套件名称',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 100,
                            message: '长度在 1 到 100 个字符',
                            trigger: 'blur'
                        }
                    ],
                    leveltag_name: [{
                        required: true,
                        message: '请选择层级名称',
                        trigger: 'change'
                    }]
                }
            };
        },
        mounted() {
            this.getCaseList();
            this.getLevelTagNamesByLtype();
        },
        name: "SuiteDialog"
    }
</script>

<style scoped>
    .request {
        margin-top: 15px;
        border: 1px solid #ddd;
    }
</style>
