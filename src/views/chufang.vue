<template>
    <section class="-overflow-hidden">
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<div class="h1">查询处方单</div>
            <el-form :inline="true" :model="filters" style="float:right">
				<el-form-item>
					<el-input v-model="filters.number" placeholder="请输入处方单号"></el-input>
				</el-form-item>
                <el-form-item >
                    <el-select v-model="filters.selectedHos" placeholder="请选择医院">
                        <el-option
                                v-for="item in hospitalList"
                                :key="item.hosid"
                                :label="item.hospital"
                                :value="item.hosid">
                        </el-option>
                    </el-select>
                </el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getChufang">查询</el-button>
				</el-form-item>
			</el-form>
        </el-col>
        <el-col :span="18" class="-f-n -m-0-auto" v-show="chufangVisible">
            <div class="-bg-fff rem12 -p-10" >
                <div class="hospital -f-s18">延安大学附属医院</div>
                <div class="-b-b -m-t10 -p-b5 -t-bold rem12">
                    <span>处方号：{{clinicrecipeid}}</span>
                </div>
                <div class="-p-10 -b-b rem12">
                    <div class="-m-b5 patient">
                        <span>姓名：{{patientname}}</span>
                        <span>性别：{{patientgender}}</span>
                        <span>年龄:{{patientage}}</span>
                    </div>
                    <div>
                        <p class="-m-b5">科室：{{deptname}}</p>
                        <p class="-m-b5">处方时间：{{operatordate}}</p>
                        <p class="">临床诊断：{{diagnosis}}{{disease}}</p>
                    </div>

                </div>
                <div class="drug  rem12">
                    <div class="-t-bold -p-5-0">Rp</div>
                    <div class="" >
                        <div class="-p-5-0" v-for="(item,index) of drugInfo" :key="index">
                            <div class=" -overflow-hidden -p-b5">
                                <div class="-f-l">1.{{item.drugname}} {{item.specification}}</div>
                                <div class="-f-r">x{{item.quantity}}{{item.unit}}</div>
                            </div>
                            <div class="-p-b5 -color-666">用法用量：{{item.drugusage}} 一次{{item.dosage}}片 每日{{item.frequency}}次 {{item.instruction}}</div>
                        </div>
                    </div>
                </div>
                <div class="-p-t5 -overflow-hidden bottomTab -b-t">
                    <div class="-f-r rem12">诊断医生：{{doctorname}}</div>
                </div>
            </div>
            <div class="sureBox" v-show="isBtnshow">
                <el-button type="primary" @click="handleSure" v-if="showContent==0">确认</el-button>
                <el-tag v-else-if="showContent==6">处方单已交易完成</el-tag>
            </div>
        </el-col>
    </section>
    <!--详情页-->
</template>
<script>
    
    export default {
        data() {
            return {
                clinicrecipeid:'',
                deptname:'',//科室
                patientname:'',
                patientgender:'',
                patientage:'',
                operatordate:null,
                doctorname:'',
                totalmoney:'',
                dosage:'',
                drugusage:'',
                frequency:'',
                hosid:'',
                disease:'',
                diagnosis:'',
                drugInfo:[
                    {
                        drugname:'',
                        quantity:0,
                        unit:''//瓶（单位）
                    }
                ],
                isBtnshow:false,
                showContent:null,
                chufangVisible:false,
                filters:{
                    selectedHos:'',
                    number:null
                },
                hospitalList:[],
            }
        },

        methods: {
			getChufang(){
                  
                let number = this.filters.number
                let hos = this.filters.selectedHos
                this.request('/pharmacy/getprescriptiondetailinfo?clinicRecipeId='+number+'&hospid='+hos).then(res =>{
                    if(res.data.code==0||res.data.code==1||res.data.code==6){
                        this.$message({
                            message: '查询成功',
                            type: 'success'
                        });
                        if(res.data.code==0||res.data.code==6){
                            this.isBtnshow = true
                            if(res.data.code==0){
                                this.showContent = 0
                            }else{
                                this.showContent = 6
                            }
                        }else {
                            this.isBtnshow = false
                            
                        }
                        var res = res.data.model
                        this.clinicrecipeid=res.clinicrecipeid
                        this.deptname = res.deptname
                        this.patientname = res.patientname
                        this.patientgender = res.patientgender
                        this.patientage = res.patientage
                        this.operatordate = res.operatordate
                        this.drugInfo = res.drugInfo
                        this.totalmoney = res.totalmoney
                        this.doctorname = res.doctorname
                        this.drugusage = res.drugusage
                        this.frequency = res.frequency
                        this.hosid = res.hosid
                        this.diagnosis = res.diagnosis
                        this.disease = res.disease
                        this.chufangVisible = true
                    }else if(res.data.code==5){
                        this.isBtnshow = false
                        this.$message({
                            message: res.data.message,
                            type: 'warning'
                        });
                        this.chufangVisible = false
                    }else if(res.data.code==3){
                        this.isBtnshow = false
                        this.$message({
                            message: '无相关处方信息',
                            type: 'warning'
                        });
                        this.chufangVisible = false
                    }
                    
                })
            },
            getHospitalList(){
                this.request('/pharmacy/selecthosplist').then(res =>{
                    if(res.data.success){
                        this.hospitalList = res.data.model;
                    }
                
                })
            },
            handleSure(){
                let hosid = this.hosid
                let clinicrecipeid = this.clinicrecipeid
                this.request('/pharmacy/insertorder?clinicRecipeId='+clinicrecipeid+'&hosid='+hosid).then(res =>{
                    if(res.data.code==0){
                        this.$message({
                            type: 'success',
                            message: '已确认!'
                        });
                    }else{
                        this.$message({
                            type: 'warning',
                            message: res.data.message
                        });
                    }
                    
                })
            }
        },
        mounted(){
            // this.getChufang()
            this.getHospitalList()
        },
        computed:{
        },
        watch:{

        }
    }
</script>

<style>
    .inputBorder .el-input__inner{
        border:none;
        background: none;
    }
    .hospital{
        text-align: center;
    }
    .sureBox{
        text-align: right;
        padding: 10px;
        /* border-top: 1px solid #ccc; */
    }
    .patient span{
        display: inline-block;
        margin-right: 10px;
    }
</style>