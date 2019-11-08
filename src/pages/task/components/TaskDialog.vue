<template>
    <div>
        <el-steps :active="active" finish-status="success">
            <el-step title="基本配置"></el-step>
            <el-step title="保存"></el-step>
        </el-steps>
        <div style="margin-top: 10px;" v-if="active === 0">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
                <el-form-item label="任务名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入任务名称" clearable=""></el-input>
                </el-form-item>
                <el-form-item label="时间配置" prop="crontab">
                    <el-input clearable v-model="ruleForm.crontab" placeholder="请输入cortab表达式，例如 2 12 * * *"></el-input>
                </el-form-item>
                <el-form-item label="任务状态" prop="switch">
                    <el-switch v-model="ruleForm.switch"></el-switch>
                </el-form-item>
                <el-form-item label="邮件策略" prop="strategy">
                    <el-radio-group v-model="ruleForm.strategy">
                        <el-radio label="始终发送"></el-radio>
                        <el-radio label="仅失败发送"></el-radio>
                        <el-radio label="从不发送"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="邮件接收人列表" prop="receiver">
                    <el-input type="textarea" v-model="ruleForm.receiver" placeholder="多个接收人以;分隔" clearable></el-input>
                </el-form-item>
                <el-form-item label="邮件抄送人列表" prop="copy">
                    <el-input type="textarea" v-model="ruleForm.copy" placeholder="多个抄送人以;分隔" clearable></el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="mydraggable" v-if="active === 1">
            <el-row :gutter="30">
                <el-col :span="10" :offset="4">
                    <template>
                        <el-select v-model="current_suite_id" filterable placeholder="请选择套件" style="width: 600px;"
                            @change="selectSuiteChange">
                            <el-option v-for="suite in suites" :key="suite.id" :label="suite.name" :value="suite.id">
                            </el-option>
                        </el-select>
                    </template>
                </el-col>
            </el-row>
            <el-row :gutter="30">
                <el-col :span="10" :offset="4" class="myborder">
                    <el-popover placement="left" title="排序" trigger="hover" content="上下拖动">
                        <draggable slot="reference" v-model="cases" :options="{animation:200}">
                            <transition-group>
                                <div class="mycase" v-for="test_case in cases" :key="test_case.case_id">
                                    {{test_case.case_name}}
                                </div>
                            </transition-group>
                        </draggable>
                    </el-popover>
                </el-col>
            </el-row>
        </div>
        <el-button type="primary" style="margin-top: 10px;" plain @click="prev" v-if="active === 1">上一步</el-button>
        <el-button type="success" style="margin-left: 600px;" @click="handleOpt" v-if="active === 1">保存</el-button>
        <el-button type="primary" plain @click="next" v-if="active === 0">下一步</el-button>
    </div>
</template>

<script>
    import draggable from 'vuedraggable'

    export default {
        components: {
            draggable
        },
        props: {
            leveltagName: {
                require: false
            },
            project: {
                require: false
            },
            response: {
                require: false
            },
            opt: {
                require: false
            },
            reset: {
                require: false
            }
        },
        data() {
            return {
                active: 0,
                current_suite_id: '',
                suites: [],
                cases: [],
                crontab_id: '',
                ruleForm: {
                    name: '',
                    switch: false,
                    crontab: '',
                    strategy: '',
                    receiver: '',
                    copy: ''
                },
                rules: {
                    name: [{
                            required: true,
                            message: '请输入任务名称',
                            trigger: 'blur'
                        },
                        {
                            min: 1,
                            max: 50,
                            message: '长度在 1 到 50 个字符',
                            trigger: 'blur'
                        }
                    ],
                    crontab: [{
                        required: true,
                        message: '请输入正确的crontab表达式',
                        trigger: 'blur'
                    }]
                },
            }
        },
        methods: {
            handleOpt() {
                if (this.opt == 'add') {
                    this.addTask();
                }
                if (this.opt == 'update') {
                    this.updateTask();
                }
            },
            validateData() {
                if (this.ruleForm.name === '') {
                    this.$notify.error({
                        message: '任务名称不能为空',
                        duration: 1500
                    });
                    return false;
                }
                if (this.ruleForm.crontab === '') {
                    this.$notify.error({
                        message: '时间配置不能为空',
                        duration: 1500
                    });
                    return false;
                }
                if (this.cases.length === 0) {
                    this.$notify.error({
                        message: '用例不能为空，请选择套件',
                        duration: 1500
                    });
                    return false;
                }
                return true
            },
            prev() {
                this.active = 0;
            },
            next() {
                this.active = 1;
            },
            getSuiteList() {
                this.$api.getSuiteList({
                    params: {
                        project: this.project,
                        search: ''
                    }
                }).then(res => {
                    // let suites = [];
                    // res.results.forEach(function(suite, index, obj) {
                    //     suites.push({
                    //         label: suite.name,
                    //         value: suite.id
                    //     });
                    // });
                    this.suites = res.results;
                })
            },
            selectSuiteChange() {
                this.$api.getSingleSuite(this.current_suite_id).then(resp => {
                    if (resp.success) {
                        this.cases = resp.data.case_list;
                        console.log(this.cases);
                    } else {
                        this.$message.error(resp.msg)
                    }
                })
            },
            addTask() {
                if (this.validateData()) {
                    var case_ids = [];
                    for (let value of this.cases) {
                        case_ids.push(value.case_id);
                    }
                    var form = this.ruleForm;
                    form["data"] = case_ids; // 执行的用例ID列表
                    form["project"] = this.project;
                    form["suite_id"] = this.current_suite_id;
                    this.$api.addTask(form).then(resp => {
                        if (resp.success) {
                            this.$emit("addSuccess");
                        } else {
                            this.$message.error(resp.msg)
                        }
                    })
                }
            },
            updateTask() {
                var case_ids = [];
                for (let value of this.cases) {
                    case_ids.push(value.case_id);
                }
                var form = this.ruleForm;
                console.log(case_ids);
                form["data"] = case_ids; // 执行的用例ID列表
                form["project"] = this.project;
                form["suite_id"] = this.current_suite_id;
                form["crontab_id"] = this.crontab_id;
                this.$api.updateTask(this.response.data.id, form).then(resp => {
                    if (resp.success) {
                        this.$emit("updateSuccess");
                    } else {
                        this.$message.error(resp.msg)
                    }
                })
            }
        },
        watch: {
            response: function() {
                this.ruleForm.name = this.response.data.name;
                this.ruleForm.switch = this.response.data.enable;
                let kwargs = JSON.parse(this.response.data.kwargs);
                this.ruleForm.crontab = kwargs.crontab;
                this.ruleForm.strategy = kwargs.strategy;
                this.ruleForm.receiver = kwargs.receiver;
                this.ruleForm.copy = kwargs.copy;
                this.current_suite_id = kwargs.suite_id;
                this.crontab_id = this.response.data.crontab_id;
                this.cases = this.response.data.cases;
            },
            reset: function() {
                this.ruleForm.name = '';
                this.ruleForm.switch = false;
                this.ruleForm.crontab = '';
                this.ruleForm.strategy = '';
                this.ruleForm.receiver = '';
                this.ruleForm.copy = '';
                this.current_suite_id = '';
                this.crontab_id = '';
                this.cases = [];
                this.active = 0;
            }
        },
        mounted() {
            this.getSuiteList();
        },
        name: "TaskDialog"
    }
</script>

<style scoped>
    .myh1 {
        font-size: 15px;
        padding: 10px;
        color: #B6B6B6;
    }

    .myh2 {
        font-size: 15px;
        padding: 10px;
        color: #19A8FF;
    }

    .myborder {
        /* border: 1px solid #19A8FF; */
        /* border-radius: 5px; */
        padding: 10px 0;
        display: inline-block;
        margin-top: 5px;
        width: 631px;
        height: 300px;
        overflow: auto;
    }

    .myradio {
        padding-left: 20px;
        padding-top: 5px;
        padding-bottom: 10px;
    }

    .mydraggable {
        margin-top: 10px;
        height: 350px;
    }

    .mycase {
        margin-top: 10px;
        padding: 10px;
        border: 1px solid #67C23A;
        background-color: rgba(236, 248, 238, .4);
    }
</style>
