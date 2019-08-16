import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    name: "Index",
    component: () => import('@/views/Index'),
    meta: {
      keepAlive: true // 需要被缓存
    },
    children: [
      {
        path: "SwitchBoard",//总机号码统计页
        name: "SwitchBoard",
        component: () => import("@/views/SwitchBoard"),
        meta: {
          keppAlive: true //需要被缓存
        }
      }, {
        path: "DepartMent",//部门隐号管理页
        name: "DepartMent",
        component: () => import("@/views/DepartMent"),
        meta: {
          keppAlive: true //需要被缓存
        }
      }, {
        path: "VirtualNumber",//虚拟号管理页
        name: "VirtualNumber",
        component: () => import("@/views/VirtualNumber"),
        meta: {
          keppAlive: true //需要被缓存 
        }
      }, {
        path: "Detail",//人员隐号明细页
        name: "Detail",
        component: () => import("@/views/Detail"),
        meta: {
          keppAlive: true //需要被缓存
        }
      },
      {
        path: "Tanhe",//Tanhe
        name: "Tanhe",
        component: () => import("@/views/Tanhe"),
        meta: {
          keppAlive: true //需要被缓存
        }
      },
      {
        path: "TanheVirtualNumber",//联通虚拟号
        name: "TanheVirtualNumber",
        component: () => import("@/views/TanheVirtualNumber"),
        meta: {
          keppAlive: true //需要被缓存
        }
      }
    ]
  }]
})
