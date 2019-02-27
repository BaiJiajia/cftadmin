<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<div class="h1">实时订单</div>
        </el-col>
        <!--列表-->
        <el-table :data="list" highlight-current-row v-loading="listLoading">
            <el-table-column type="index" width="50" label="序号">
            </el-table-column>
            <el-table-column prop="id" label="订单编号" min-width="100">
            </el-table-column>
            <el-table-column prop="clinicrecipeid" label="处方单编号" min-width="100">
            </el-table-column>
            <el-table-column prop="name" label="姓名" min-width="100">
            </el-table-column>
            <el-table-column prop="phone" label="电话" min-width="120">
            </el-table-column>
            <el-table-column prop="createtime" label="下单时间" min-width="120">
            </el-table-column>
            <el-table-column prop="status" label="订单状态" min-width="120">
                <template scope="scope">
                    <div v-if="scope.row.status==1" style="color:#399bff">已确认</div>
                    <div v-else-if="scope.row.status==2" style="color:#e02833">待处理</div>
                    <div v-else-if="scope.row.status==0">已取消</div>
                </template> 
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template scope="scope">
                    <el-button type="primary" size="small" @click="getDetail(scope.$index, scope.row)">查看详情</el-button>
                    <el-button type="text" size="small" v-show="scope.row.status!=0" @click="deleteOrder(scope.row)">取消</el-button>
                </template>
            </el-table-column>
        </el-table>
		<!-- <el-col :span="24" class="toolbar">
            <el-pagination layout="prev, pager, next"  :page-size="10" :total="total" style="float:right;">
            </el-pagination>
        </el-col> -->
        <!--弹窗界面-->
        <el-dialog title="订单详情" :visible.sync="addFormVisible" width="50%" :close-on-click-modal="false">
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
            <div slot="footer" class="dialog-footer" v-show="status==2">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit">确认订单</el-button>
            </div>
        </el-dialog>
    </section>
    <!--详情页-->

</template>
<script>

    export default {
        data() {
            return {
                timeout: null,
                list:[],
                druglist:[],
                total: 3,
                page: 1,
                listLoading: false,
                addFormVisible: false,//新增界面是否显示
                activeId:null, //当前确认订单的订单id
                status:null,  //当前订单的状态 1是已确认  2是待确认   0是已取消
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
                ]
                
                
            }
        },

        methods: {
			handleCurrentChange(val) {
                this.page = val;
                // this.getChannelList();
            },
            deleteOrder(row){
                
                this.$confirm('此操作将删除订单, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        let orderid = row.id
                        this.request('/pharmacy/updateorderinfo?id='+orderid).then(res =>{
                            if(res.data.code==0){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getorderList()
                            }else if(res.data.code==2){
                                this.$message({
                                    type: 'warning',
                                    message: '该药品已经被订购,不能删除'
                                }); 
                            }else if(res.data.code==4){
                                this.$message({
                                    type: 'warning',
                                    message: '订单已完成，不能取消'
                                });
                            }
                            
                        })
                    }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            },  
            getDetail(index, row){
                  
                this.activeId = this.list[index].id
                this.status = this.list[index].status  //当前订单的状态 1是已确认  2是待确认
                this.request('/pharmacy/getorderdetail?id='+this.activeId).then(res =>{
                    
                    if(res.data.code==0){
                        // this.druglist = res.data.model
                        this.addFormVisible = true
                        var res = res.data.model.model
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
                        
                    }
                
                })

            },
            // 获取订单列表
            getorderList(){
                  
			    clearTimeout(this.timeout)
                this.request('/pharmacy/getorderinfobyphyid').then(res =>{
                    if(res.data.success){
                        this.list = res.data.model;
                        let newOrderCount = 0
                        for(let item of this.list){
                            if(item.status==2){
                                newOrderCount++
                            }
                        }
                        this.$store.commit('getNewOrder',newOrderCount)
                    }
                    this.timeout = setTimeout(this.getorderList, 5000)
                })
            },
            // 确认订单的提交
            addSubmit(){
                  
                this.request('/pharmacy/confirmorder?id='+this.activeId).then(res =>{
                    if(res.data.code==0){
                        this.list = res.data.model;
                        this.$message({
                            message: '订单已确认',
                            type: 'success'
                        });
                        this.addFormVisible = false
                    }else if(res.data.code==4){
                        this.$message({
                            message: '处方单确认失败,缺失药品或库存不足',
                            type: 'warning'
                        });
                        this.addFormVisible = false
                    }
                
                })
            }
        },
        mounted(){
            this.getorderList()
        },
        computed:{
        },
        watch:{

        }
    }
</script>

<style scoped>
    .hospital{
        text-align: center;
    }
    .patient span{
        display: inline-block;
        margin-right: 10px;
    }
</style>