import Vue from 'vue'
import Router from 'vue-router'

const Login = () => import('../components/login.vue')

const Home = () => import('../components/home.vue')

const Welcome = () => import('../components/welcome.vue')


const Users = () => import('../components/user/Users.vue')

const Rights= () => import('../components/prower/rights.vue')

const Roles= () => import('../components/prower/roles.vue')

const Categories= () => import('../components/goods/categories.vue')

const Params= () => import('../components/goods/params.vue')
const Goods= () => import('../components/goods/goods.vue')
const Add= () => import('../components/goods/add.vue')
const Orders= () => import('../components/order/orders.vue')
const Reports= () => import('../components/reports/reports.vue')
Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: 'welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component:Categories},
        { path: '/params', component: Params },
        { path: '/goods', component: Goods },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Orders },
        { path: '/reports', component: Reports }
      ]
    }
  ]
})

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 获取token
const tokenStr = window.sessionStorage.getItem('token')
  //1.没有tokenStr
  //2.要去的不是登录页
  if (!tokenStr && to.path != '/login')next('/login') 
  //1.有tokenStr
  //2.要去的是登录页
  if (tokenStr && to.path == '/login')next('/home')
  
  next();
})

export default router



