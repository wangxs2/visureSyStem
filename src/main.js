import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './permission' //路由判断
import './utils/rem'
import common from './utils/common.js' //axios请求封装
// import echarts from 'echarts' //引入echarts
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(common)
Vue.use(ElementUI)
/* *
 *@method echarts
 */
// Vue.prototype.$echarts = echarts;
// Vue.prototype.Ip = 'http://10.1.4.42';
// Vue.prototype.IpT = 'http://10.1.4.42:8090';
Vue.prototype.Ip = 'http://10.1.30.202:18088'
Vue.prototype.IpT = 'http://10.1.30.202:18181'
// Vue.prototype.Ip = 'http://106.14.198.128:18088'
// Vue.prototype.IpT = 'http://106.14.198.128:18181'
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
