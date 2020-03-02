import Vue from 'vue'
import Router from 'vue-router'

import login from '@/views/login/index.vue'
import layout from '@/views/layout/index.vue'
import curTimeInfo from '@/views/curTimeInfo/index.vue'
import curTime from '@/views/curTimeInfo/curTime.vue'
import gongyingInfo from '@/views/curTimeInfo/gongyingInfo.vue'
import qiugouInfo from '@/views/curTimeInfo/qiugouInfo.vue'
import zizhuInfo from '@/views/curTimeInfo/zizhuInfo.vue'
import dataStatistic from '@/views/dataStatistic/index'
import luruInfo from '@/views/luruInfo/index.vue'
import gong from '@/views/luruInfo/gong.vue'
import xu from '@/views/luruInfo/xu.vue'
import minjianOrig from '@/views/luruInfo/minjianOrig.vue'
import hospitalInfo from '@/views/hospitalInfo/index.vue'
import gong1 from '@/views/hospitalInfo/gong.vue'
import xu1 from '@/views/hospitalInfo/xu.vue'
import minjianOrig1 from '@/views/hospitalInfo/minjianOrig.vue'
Vue.use(Router)
const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
    return routerPush.call(this, location).catch(error => error)
}
export default new Router({
    // mode: 'history',//router模式
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/login',
            name: 'login',
            component: login,

        },
        {
            path: '/',
            name: 'layout',
            component: layout,
            children: [
                {
                    path: '/hospitalInfo',
                    name: 'hospitalInfo',
                    component: hospitalInfo,
                    curMenuName:"发布信息维护",
                    children:[
                        {
                            path: '/hospitalInfo/xu',
                            name: 'xu1',
                            component: xu1,
                            curMenuName:"发布信息维护/需方"

                        },
                        {
                            path: '/hospitalInfo/gong',
                            name: 'gong1',
                            component: gong1,
                            curMenuName:"发布信息维护/供方"

                        },
                        {
                            path: '/hospitalInfo/minjianOrig',
                            name: 'minjianOrig1',
                            component: minjianOrig1,
                            curMenuName:"发布信息维护/民间组织"

                        },
                    ]
                },
                
                {
                    path: '/luruInfo',
                    name: 'luruInfo',
                    component: luruInfo,
                    curMenuName:"录入信息维护",
                    children:[
                        {
                            path: '/luruInfo/xu',
                            name: 'xu',
                            component: xu,
                            curMenuName:"录入信息维护/需方"

                        },
                        {
                            path: '/luruInfo/gong',
                            name: 'gong',
                            component: gong,
                            curMenuName:"录入信息维护/供方"

                        },
                        {
                            path: '/luruInfo/minjianOrig',
                            name: 'minjianOrig',
                            component: minjianOrig,
                            curMenuName:"录入信息维护/民间组织"

                        },
                    ]
                },
                {
                    path: '/curTimeInfo',
                    name: 'curTimeInfo',
                    component: curTimeInfo,
                    curMenuName:"实时播报信息",
                    children:[
                        {
                            path: '/curTimeInfo/curTime',
                            name: 'curTime',
                            component: curTime,
                            curMenuName:"实时播报信息/实时播报"

                        },
                        {
                            path: '/curTimeInfo/gongyingInfo',
                            name: 'gongyingInfo',
                            component: gongyingInfo,
                            curMenuName:"实时播报信息/供应信息"

                        },
                        {
                            path: '/curTimeInfo/qiugouInfo',
                            name: 'qiugouInfo',
                            component: qiugouInfo,
                            curMenuName:"实时播报信息/求购信息"

                        },
                        {
                            path: '/curTimeInfo/zizhuInfo',
                            name: 'zizhuInfo',
                            component: zizhuInfo,
                            curMenuName:"实时播报信息/资助信息"
                        },
                    ]
                }, 
                {
                    path: '/dataStatistic',
                    name: 'dataStatistic',
                    component: dataStatistic,
                    curMenuName:"统计",
                    children:[]
                }, 
            ]
        }
    ]
        
        
})
