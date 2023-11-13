import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: {title: '数据看板', icon: 'dashboard'}
    }]
  },

  // {
  //   path: '/system',
  //   component: Layout,
  //   redirect: '/system/user',
  //   name: 'System',
  //   meta: {title: '系统管理'},
  //   children: [
  //     {
  //       path: 'user',
  //       name: 'user',
  //       component: () => import('@/views/system/user/index'),
  //       meta: {title: '用户管理'},
  //     },
  //     {
  //       path: 'user/role/:userId',
  //       name: 'userRole',
  //       component: () => import('@/views/system/user/role'),
  //       meta: {title: '分配角色'},
  //       hidden: true
  //     },
  //     {
  //       path: 'role',
  //       name: 'role',
  //       component: () => import('@/views/system/role/index'),
  //       meta: {title: '角色管理'},
  //     },
  //     {
  //       path: 'role/menu/:roleId',
  //       name: 'roleMenu',
  //       component: () => import('@/views/system/role/menu'),
  //       meta: {title: '角色权限'},
  //       hidden: true
  //     },
  //     {
  //       path: 'menu',
  //       name: 'menu',
  //       component: () => import('@/views/system/menu/index'),
  //       meta: {title: '菜单管理'}
  //     },
  //
  //   ]
  // },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 404 page must be placed at the end !!!
  // {path: '*', redirect: '/404', hidden: true}
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  mode: 'history',
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
