import Vue from "vue";
import Router from "vue-router";

import Login from './views/Login.vue'
// import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import order from './views/order.vue'
import setting from './views/setting.vue'
import stock from './views/stock.vue'
import chufang from './views/chufang.vue'
Vue.use(Router);
export default new Router({
    routes: [
        {
            path: '/',
            component: Login,
            name: '',
            hidden: true
        },
        {
            path: '/login',
            component: Login,
            name: '',
            hidden: true
        },
        // {
        //     path: '/404',
        //     component: NotFound,
        //     name: '',
        //     hidden: true
        // },
        
        {
            path: '/home',
            component: Home,
            name: '',
            iconCls: 'el-icon-date',//图标样式class
            meta:{index:'/order',badge:true},
            leaf: true,//只有一个节点
            children: [
                { path: '/order', component: order, name: '实时订单',meta:{index:'/order'} }
            ]
        },
        {
            path: '/home',
            component: Home,
            name: '',
            iconCls: 'el-icon-printer',//图标样式class
            meta:{index:'/chufang'},
            leaf: true,//只有一个节点
            children: [
                { path: '/chufang', component: chufang, name: '查询处方',meta:{index:'/chufang'} }
            ]
        },
        {
            path: '/home',
            component: Home,
            name: '',
            iconCls: 'el-icon-edit-outline',//图标样式class
            meta:{index:'/stock'},
            leaf: true,//只有一个节点
            children: [
                { path: '/stock', component: stock, name: '库存设置',meta:{index:'/stock'} }
            ]
        },
        {
            path: '/home',
            component: Home,
            name: '',
            iconCls: 'el-icon-printer',//图标样式class
            meta:{index:'/setting'},
            leaf: true,//只有一个节点
            children: [
                { path: '/setting', component: setting, name: '门店信息',meta:{index:'/setting'} }
            ]
        }
        // {
        //     path: '*',
        //     hidden: true,
        //     redirect: { path: '/404' }
        // }
    ]
  });
