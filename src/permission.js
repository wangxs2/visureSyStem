import router from './router'
import store from './store'
import { getCookie, delCookie } from './utils/util'
// console.log(store)
// NProgress.configure({
//     showSpinner: false
// })
// function selectMenu(menu){
//     var name = sessionStorage.getItem('userName');
//     var pass = sessionStorage.getItem('pass');
//     console.log(`http://106.14.198.128:18181/websharebikeInner/#/${menu}?name=${name}&pass=${pass}`)
//     document.getElementById("welcomeSrc").src=`http://106.14.198.128:18181/websharebikeInner/#/${menu}?name=${name}&pass=${pass}`;
// }

router.beforeEach((to, from, next) => {
    next()
})

router.afterEach((to, from) => {
})
