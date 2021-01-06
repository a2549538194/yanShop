import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './plugins/element.js'
// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

import 'element-ui/lib/theme-chalk/index.css'
// 引入ElementUI组件
import ElementUI from 'element-ui';
Vue.use(ElementUI);
//配置树形控件
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table',TreeTable)


//引入axios和配置请求根路径
import axios from 'axios' 
axios.defaults.baseURL = 'https://www.liulongbin.top:8888/api/private/v1'
// 添加请求拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  // 从sessionStorage获取token值，然后设置给请求头
   config.headers.Authorization = window.sessionStorage.getItem('token')
  // 在最后必须 return config
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false;

//过滤器
Vue.filter('dateFormat', function(originVal) {
 const dt = new Date(originVal)
 const  y = dt.getFullYear()  //年
 const  m = (dt.getMonth() + 1 + '').padStart(2,'0') //月
 const  d = (dt.getDate() +'').padStart(2,'0') //日

 const hh =(dt.getHours()+'').padStart(2,'0')
 const mm =(dt.getMinutes() +'').padStart(2,'0')
 const ss = (dt.getSeconds() +'').padStart(2,'0')

 return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' 
import 'quill/dist/quill.snow.css' 
import 'quill/dist/quill.bubble.css'

Vue.use(VueQuillEditor)


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
