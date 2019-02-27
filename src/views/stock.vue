<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<div class="h1">库存设置</div>
            <el-form :inline="true"  style="float:right">
                <!-- <el-form-item>
                    <el-input type="text" v-model="filters.cnlName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="default"  >查询</el-button>
                </el-form-item> -->
                <el-form-item>
                    <el-button type="primary" @click="handleAdd" >设置药品目录</el-button>
                </el-form-item>
            </el-form>
        </el-col>
        <el-table :data="tablet" highlight-current-row v-loading="listLoading" >
            <el-table-column type="index" width="100" label="序号">
            </el-table-column>
            <el-table-column prop="drugname" label="药品名称" min-width="150">
            </el-table-column>
            <el-table-column prop="drugnumber" label="药品编号" min-width="100">
            </el-table-column>
            <el-table-column prop="specification" label="规格" min-width="100">
            </el-table-column>
            <el-table-column prop="icount" label="库存数量" min-width="100" sortable>
                <template slot-scope="scope">
                    <el-input :class={inputBorder:scope.row.readOnly} v-model="scope.row.icount" type="number" :readonly="scope.row.readOnly"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="scope.row.readOnly?handleEdit(scope.$index, scope.row):handleSubmit(scope.$index, scope.row)">{{scope.row.readOnly?'更新库存':'完成'}}</el-button>
                    <el-button type="text" size="small" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--新增界面-->
        <el-dialog title="选择药品" :visible.sync="addFormVisible" width="75%" :close-on-click-modal="false">
            <!--工具条-->
            <el-col class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" style="float:left">
                    <el-form-item label="选择医院"  prop="selectedHos">
                        <el-select v-model="selectedHos" placeholder="请选择医院" @change="getHospitalDrug">
                            <el-option
                                    v-for="item in hospitalList"
                                    :key="item.hosid"
                                    :label="item.hospital"
                                    :value="item.hosid">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-table :data="hospitalDrug" @selection-change="selsChange">
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column property="drugname" label="药品名称" min-width="150"></el-table-column>
                <el-table-column property="drugnumber" label="药品编号" min-width="150"></el-table-column>
                <el-table-column property="price" label="价格" min-width="150"></el-table-column>
                <el-table-column property="dosageform" label="生产商" min-width="150"></el-table-column>
                <el-table-column property="drugtype" label="分类" min-width="150"></el-table-column>
                <el-table-column property="unit" label="单位" min-width="150"></el-table-column>
                <el-table-column property="specifiaction" label="规格" min-width="150"></el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
    </section>
    <!--详情页-->
</template>
<script>
    export default {
        data() {
            return {
                
                tablet:[],
                total: 3,
                page: 1,
                listLoading: false,
                hospitalList:[],
                selectedHos:'',
                addFormVisible: false,//新增界面是否显示
                addLoading:false,
                sels: [],//列表选中列
                hospitalDrug: [],
            }
        },

        methods: {
			handleCurrentChange(val) {
                this.page = val;
                // this.getChannelList();
            },
            //显示新增界面
            handleAdd: function () {
                this.addFormVisible = true;
                
            },
            addSubmit:function(){
                  
                let ids = this.sels.map(item => item.drugnumber).toString();
                if(ids){
                    let hosid = this.selectedHos
                    this.request('/pharmacy/adddraginfo?dragid='+ids+'&hospid='+hosid).then(res =>{
                        if(res.data.success){
                            this.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            this.getDrugList()
                            this.addFormVisible = false;
                            
                        }
                    
                    })
                }
                
            },
			handleEdit: function (index, row) {
                row.readOnly = false;
            },
            // 多选
            selsChange: function (sels) {
                this.sels = sels;
			},
            handleSubmit:function (index, row) {
                  
                let count = row.icount
                let _id = this.tablet[index].drugnumber 
                let hosid = this.tablet[index].hosid
                let _thi = this
                this.request('/pharmacy/setdragcount?drugnumber='+_id+'&icount='+count+'&hospid='+hosid).then(res =>{
                    if(res.data.success){
                        _thi.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        row.readOnly = true;
                        
                    }
                
                })
                
            },
            // 删除药品
            handleDelete(index, row){
                this.$confirm('此操作将删除药品, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        let _id = this.tablet[index].drugnumber 
                        let hosid = this.tablet[index].hosid

                        this.request('/pharmacy/deletedrugbypharmacy?drugnumber='+_id+'&hosid='+hosid).then(res =>{
                            if(res.data.code==0){
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getDrugList()
                            }else if(res.data.code==2){
                                this.$message({
                                    type: 'warning',
                                    message: '该药品已经被订购,不能删除'
                                }); 
                            }else{
                                this.$message({
                                    type: 'warning',
                                    message: '请重试'
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
            // 获取药品列表
            getDrugList(){
                  
                this.request('/pharmacy/selectpharmacydraginfo').then(res =>{
                    if(res.data.success){
                        this.tablet = res.data.model;
                        for(let item of this.tablet){
                            this.$set(item, 'readOnly', true)
                        }
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
            getHospitalDrug(){
                let hosid = this.selectedHos;
                this.request('/pharmacy/slecthospdraginfo?hosid='+hosid).then(res =>{
                    if(res.data.success){
                        this.hospitalDrug = res.data.model.model
                    }else{
                        this.hospitalDrug = []
                    }
                
                })
            },

            
            
        },
        mounted(){
            this.getDrugList()
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
</style>