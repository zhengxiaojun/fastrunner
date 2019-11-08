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
                <el-form-item label="时间配置" prop="corntab">
                    <el-input clearable v-model="ruleForm.corntab" placeholder="请输入cortab表达式，例如 2 12 * * *"></el-input>
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
            <el-radio-group v-model="taskType" class="myradio">
                <el-radio label="case">用例</el-radio>
                <el-radio label="suite">套件</el-radio>
            </el-radio-group>
            <el-row :gutter="30" v-if="taskType === 'case'">
                <el-col :span="10" :offset="1" class="myborder">
                    <h1 class="myh1">未选择的用例</h1>
                    <draggable v-model="myArray" draggable='true' group="case">
                        <transition-group>
                            <div class="mycase" v-for="element in myArray" :key="element.id">
                                {{element.name}}
                            </div>
                        </transition-group>
                    </draggable>
                </el-col>

                <el-col :span="10" :offset="1" class="myborder">
                    <h1 class="myh2">已选择的用例</h1>
                    <draggable v-model="myArray2" draggable='true' group="case">
                        <transition-group>
                            <div class="mycase" v-for="element in myArray2" :key="element.id">
                                {{element.name}}
                            </div>
                        </transition-group>
                    </draggable>
                </el-col>
            </el-row>
        </div>
        <el-button type="primary" plain @click="prev" v-if="active === 1">上一步</el-button>
        <el-button type="success" style="margin-left: 600px;" @click="save" v-if="active === 1">保存</el-button>
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
            }
        },
        methods: {
            prev() {
                this.active = 0;
            },
            next() {
                this.active = 1;
            },
            save() {

            },
            move: function(evt, originalEvent) {
                // console.log(evt);
                // console.log(this.myArray);
                // console.log(originalEvent); //鼠标位置
                // console.log(evt.item);
                // console.log(evt.to);
                // console.log(evt.from);
                // console.log(evt.oldIndex);
                // console.log(evt.newIndex);
            },

            start: function(evt) {
                console.log('2');
                console.log(evt);
            },

            end: function(evt) {
                console.log('3');
                console.log(evt);
            }
        },
        watch: {
            response: function() {
                this.name = this.response.body.name;
                this.method = this.response.body.method;
                this.url = this.response.body.url;
                this.times = this.response.body.times;
                this.id = this.response.id;
                this.currentLevelTagName = this.response.body.leveltag_name;
            }
        },
        data() {
            return {
                active: 0,
                taskType: 'case', // case, suite
                controlOnStart: true,
                ruleForm: {
                    name: '',
                    switch: true,
                    corntab: '',
                    strategy: '始终发送',
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
                    corntab: [{
                        required: true,
                        message: '请输入正确的corntab表达式',
                        trigger: 'blur'
                    }]
                },
                myArray: [{
                        name: "Jesus",
                        id: 1
                    },
                    {
                        name: "Paul",
                        id: 2
                    },
                    {
                        name: "Peter",
                        id: 3
                    }
                ],
                myArray2: [{
                    name: "Jesus",
                    id: 1
                }]
            }
        },
        mounted() {

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
        border: 1px solid #19A8FF;
        border-radius: 5px;
        padding: 10px 0;
        display: inline-block;
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
        border: 1px solid #67C23A;
        background-color: rgba(236, 248, 238, .4);
    }
</style>
