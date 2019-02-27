<template>
	<el-row class="container">
		<el-col :span="24" class="header">
			<el-col :span="10" class="logo" :class="collapsed?'logo-collapse-width':'logo-width'">
				<!-- {{collapsed?'':sysName}} -->
			</el-col>
			<el-col :span="10">
				<div class="tools" @click.prevent="collapse">
					<i class="fa fa-align-justify"></i>
				</div>
			</el-col>
			<el-col :span="10" class="userinfo">
				<span style="cursor:default">{{sysUserName}}</span>&nbsp;
				<span @click="editPassword">修改密码</span>&nbsp;
				<span @click="logout">退出登录</span>
				<!-- <el-dropdown trigger="hover">
					<span class="el-dropdown-link userinfo-inner"><img :src="this.sysUserAvatar" /> {{sysUserName}}</span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown> -->
			</el-col>
		</el-col>
		<el-col :span="24" class="main">
			<aside :class="collapsed?'menu-collapsed':'menu-expanded'">
				<!--导航菜单-->
				<el-menu :default-active="$route.meta.index" class="el-menu-vertical-demo" @open="handleopen" @close="handleclose" @select="handleselect"
					 unique-opened router v-show="!collapsed">
					<template v-for="(item,index) in $router.options.routes" v-if="!item.hidden">
						<!-- <el-submenu :index="index+''" v-if="!item.leaf" :key="index" > -->
							<!-- <template slot="title"><i :class="item.iconCls"></i>{{item.name}}</template> -->
							<!-- <el-menu-item v-for="child in item.children" :index="child.path" :key="child.path" >{{child.name}}</el-menu-item> -->
						<!-- </el-submenu> -->
						<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path" :key="item.children[0].path">
							<i :class="item.iconCls"></i>{{item.children[0].name}}
							<el-badge v-show="item.meta.badge&&newOrder" :value="newOrder" class="item" type="primary" style="border:none"></el-badge>
							</el-menu-item>
					</template>
				</el-menu>
				<!--导航菜单-折叠后-->
				<ul class="el-menu el-menu-vertical-demo collapsed" v-show="collapsed" ref="menuCollapsed">
					<li v-for="(item,index) in $router.options.routes"  class="el-submenu item" :key="index" v-if="!item.hidden">
						<template v-if="!item.leaf" >
							<div class="el-submenu__title" style="padding-left: 20px;" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"><i :class="item.iconCls"></i></div>
							<ul class="el-menu submenu" :class="'submenu-hook-'+index" @mouseover="showMenu(index,true)" @mouseout="showMenu(index,false)"> 
								<li v-for="child in item.children" :key="child.path" class="el-menu-item" style="padding-left: 40px;" :class="$route.meta.index==child.meta.index?'is-active':''" @click="$router.push(child.path)">{{child.name}}</li>
							</ul>
						</template>
						<template v-else>
							<li class="el-submenu">
								<div class="el-submenu__title el-menu-item" style="padding-left: 20px;height: 56px;line-height: 56px;padding: 0 20px;" :class="$route.meta.index==item.children[0].meta.index?'is-active':''" @click="$router.push(item.children[0].path)"><i :class="item.iconCls"></i></div>
							</li>
						</template>
					</li>
				</ul>
			</aside>
			<section class="content-container">
				<div class="grid-content bg-purple-light">
					<el-col :span="24" class="content-wrapper">
						<transition name="fade" mode="out-in">
							<router-view></router-view>
						</transition>
					</el-col>
				</div>
			</section>
		</el-col>
		<el-dialog title="修改密码" :visible.sync="dialogVisible" width="50%" :show-close="false">
			<el-form :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
				<el-form-item label="旧密码" prop="oldPass">
					<el-input type="password" v-model="ruleForm2.oldPass"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPass">
					<el-input type="password" v-model="ruleForm2.newPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="ruleForm2.checkPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
					<el-button @click="resetForm('ruleForm2')">取消</el-button>
				</el-form-item>
			</el-form>
			<!-- <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span> -->
		</el-dialog>
	</el-row>
</template>

<script>
	export default {
		data() {
			var checkOldPass = (rule, value, callback) => {
				if (!value) {
				return callback(new Error('密码不能为空'));
				}else{
					callback();
				}
				
			};
			var validatePass = (rule, value, callback) => {
				if (value === '') {
				callback(new Error('请输入新密码'));
				} else {
				if (this.ruleForm2.checkPass !== '') {
					this.$refs.ruleForm2.validateField('checkPass');
				}
				callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
				callback(new Error('请再次输入密码'));
				} else if (value !== this.ruleForm2.newPass) {
				callback(new Error('两次输入密码不一致!'));
				} else {
				callback();
				}
			};
			return {
				dialogVisible:false,
				sysName:'VUEADMIN',
				collapsed:false,
				sysUserName: '',
				sysUserAvatar: '',
				ruleForm2: {
					oldPass: '',
					newPass: '',
					checkPass: ''
				},
				rules2: {
					newPass: [ 
						{ validator: validatePass, trigger: 'blur' }
					],
					checkPass: [
						{ validator: validatePass2, trigger: 'blur' }
					],
					oldPass: [
						{ validator: checkOldPass, trigger: 'blur' }
					]
				}
			}
		},
		computed:{
			newOrder(){
				var order = this.$store.state.newOrder
				return order
			}
		},
		methods: {
			editPassword(){
				this.dialogVisible = true
			},
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
				if (valid) {
					this.request('pharmacy/updatepharmacypassword?oldPwd='+this.ruleForm2.oldPass+'&newPwd='+this.ruleForm2.newPass).then(res =>{
                    if(res.data.success){
						this.resetForm(formName)
						this.$message({
							message: '密码修改成功，请重新登录',
							type: 'success'
						});
						setTimeout(()=>{
							localStorage.removeItem('token');
							this.$router.push('/');
						},2000)
                        
                    }
                    
                })
				
				} else {
					console.log('error submit!!');
					return false;
				}
				});
			},
			resetForm(formName) {
				this.dialogVisible = false
				this.$refs[formName].resetFields();
				
			},
			onSubmit() {
				console.log('submit!');
			},
			handleopen() {
				//console.log('handleopen');
			},
			handleclose() {
				//console.log('handleclose');
			},
			handleselect: function (a, b) {
			},
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					localStorage.removeItem('token');
					_this.$router.push('/');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {
			// var user = sessionStorage.getItem('user');
			// if (user) {
			// 	user = JSON.parse(user);
			// 	this.sysUserName = user.name || '';
			// 	this.sysUserAvatar = user.avatar || '';
			// }
			this.request('/pharmacy/selectpharmacy').then(res =>{
              if(res.data.success){
                this.sysUserName = res.data.model.name
              }
              
            })

		}
	}

</script>
<style>
.el-badge__content{
	border: none
}
</style>

<style scoped lang="scss">
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		.header {
			height: 60px;
			line-height: 60px;
			background: $color-blue;
			color:#fff;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color:#fff;
					img {
						width: 40px;
						height: 40px;
						border-radius: 20px;
						margin: 10px 0px 10px 10px;
						float: right;
					}
				}
				span{
					cursor: pointer;
				}
			}
			.logo {
				//width:230px;
				height:60px;
				font-size: 22px;
				border-color: rgba(238,241,146,0.3);
				border-right-width: 1px;
				border-right-style: solid;
				background:url('../assets/images/frame-huifu-logo.png') no-repeat;
				background-position: center;
				img {
					width: 40px;
					float: left;
					margin: 10px 10px 10px 18px;
				}
				.txt {
					color:#fff;
				}
			}
			.logo-width{
				width:180px;
			}
			.logo-collapse-width{
				width:60px
			}
			.tools{
				padding: 0px 23px;
				width:14px;
				height: 60px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			// background: #324057;
			position: absolute;
			top: 60px;
			bottom: 0px;
			overflow: hidden;
			aside {
				flex:0 0 180px;
				width: 180px;
				// position: absolute;
				// top: 0px;
				// bottom: 0px;
				.el-menu{
					height: 100%;
					background-color: #292b30;
					.el-menu-item{
						color: $color-999;
						box-sizing: border-box;
					}
					.el-menu-item:hover,.el-menu-item:focus,.el-menu-item.is-active{
						background-color: #212329;
						color: $color-white;
					}
					.el-menu-item.is-active{
						border-left:4px solid;
						border-color: $color-blue;
					}
					.el-badge{
						margin-top: -20px
					}
				}
				.collapsed{
					width:60px;
					.item{
						position: relative;
					}
					.submenu{
						position:absolute;
						top:0px;
						left:60px;
						z-index:99999;
						height:auto;
						display:none;
					}

				}
			}
			.menu-collapsed{
				flex:0 0 60px;
				width: 60px;
			}
			.menu-expanded{
				flex:0 0 180px;
				width: 180px;
				
			}
			.content-container {
				// background: #f1f2f7;
				flex:1;
				// position: absolute;
				// right: 0px;
				// top: 0px;
				// bottom: 0px;
				// left: 230px;
				overflow-y: auto;
				padding: 20px;
				.breadcrumb-container {
					//margin-bottom: 15px;
					.title {
						width: 200px;
						float: left;
						color: #475669;
					}
					.breadcrumb-inner {
						float: right;
					}
				}
				.content-wrapper {
					background-color: #fff;
					box-sizing: border-box;
				}
				
			}
		}
	}
</style>

