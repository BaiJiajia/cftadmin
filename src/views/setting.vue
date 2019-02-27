<template>
    <section>
        <!--工具条-->
        <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<div class="h1">门店信息</div>
        </el-col>
        <el-card>
            <div class="-overflow-hidden -p-10">
                <div class="-f-l">药店名称：</div>
                <div class="-f-l -w-d-2">{{info.name}}</div>
            </div>
            <div class="-overflow-hidden -p-10">
                <div class="-f-l">药店地址：</div>
                <div class="-f-l -w-d-2">{{info.drugstoreAddress}}</div>
            </div>
            <div class="-overflow-hidden -p-10">
                <div class="-f-l">药店图片：</div>
                <div class="-f-l ">
                    <el-upload
                        v-loading="loading"
                        class="avatar-uploader"
                        name="file"
                        action="http://192.168.1.127:8080/iadmin.web/pharmacy/uploadimage"
                        :show-file-list="false"
                        :headers={token}
                        :on-progress="uploading"
                        :on-success="handleAvatarSuccess"
                        :on-preview="handlePictureCardPreview"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="info.imgurl" :src="'http://192.168.1.127:8080/iadmin.web/upload/'+info.imgurl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </div>
            </div>
            <el-dialog :visible.sync="dialogVisible">
                <!-- <img width="100%" :src="imgurl" alt=""> -->
            </el-dialog>
        </el-card>
    </section>
    <!--详情页-->
</template>
<script>
    export default {
        data() {
            return {
                info:{
                    imgurl:null
                },
                loading:false,
                dialogVisible:false,
                token:localStorage.getItem('token')
            }
        },

        methods: {
            uploading(){
                this.loading=true
            },
			handleAvatarSuccess(res, file) {
                this.$message({
                    type: 'success',
                    message: '上传成功!'
                });
                this.getInfo()
                this.loading = false
            },
            handlePictureCardPreview(file) {
                this.info.imgurl = file.url;
                this.dialogVisible = true;
            },

            beforeAvatarUpload(file) {
                const isJPGPNG = file.type === 'image/jpeg'||file.type === 'image/png';
                const isLt2M = file.size / 1024 / 1024 < 30;

                if (!isJPGPNG) {
                this.$message.error('上传图片只能是 JPG或png格式!');
                }
                if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 6MB!');
                }
                return isJPGPNG && isLt2M;
            },
            getInfo(){
                this.request('/pharmacy/selectpharmacy').then(res =>{
                    if(res.data.success){
                        this.info = res.data.model
                    }
                    
                })
            }
            
        },
        mounted(){
              this.getInfo()
            
        },
        computed:{
        },
        watch:{

        }
    }
</script>

<style >
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>