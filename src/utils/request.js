import axios from 'axios'
import Vue from 'vue'
import router from '../router/index'
import { Message,Loading } from 'element-ui';
import _ from 'lodash';
import qs from 'qs'
Vue.prototype.$axios = axios
// 创建axios实例
// debugger
export const Axios = axios.create({
  // baseURL: process.env.API_HOST,
  baseURL: "/auditkindness/",
  timeout: 50000,
  withCredentials: true // 是否允许带cookie这些
})
console.log(process.env.API_HOST)


//loading对象
let loading;
  
//当前正在请求的数量
let needLoadingRequestCount = 0;

  
//显示loading
function showLoading(target) {
  // 后面这个判断很重要，因为关闭时加了抖动，此时loading对象可能还存在，
  // 但needLoadingRequestCount已经变成0.避免这种情况下会重新创建个loading
  if (needLoadingRequestCount === 0 && !loading) {
    loading = Loading.service({
      lock: true,
      text: "Loading...",
      background: 'rgba(255, 255, 255, 0.5)',
      target: target || "body"
    });
  }
  needLoadingRequestCount++;
}
  
//隐藏loading
function hideLoading() {
  needLoadingRequestCount--;
  needLoadingRequestCount = Math.max(needLoadingRequestCount, 0); //做个保护
  if (needLoadingRequestCount === 0) {
    //关闭loading
    toHideLoading();
  }
}
  
//防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
var toHideLoading = _.debounce(()=>{
  loading.close();
  loading = null;
}, 300);
  

// request拦截器
Axios.interceptors.request.use(
  config => {
    //判断当前请求是否设置了不显示Loading
    if(config.headers.showLoading !== false){
      showLoading(config.headers.loadingTarget);
    }
    return config
  },
  error => {
    //判断当前请求是否设置了不显示Loading
    if(config.headers.showLoading !== false){
      hideLoading();
    }
    Message.error({
      message: '请求参数错误'
    })
    return Promise.reject(error)
  }
)

// response过滤器
Axios.interceptors.response.use(
  // 正确处理
  res => {
    //判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if(res.config.headers.showLoading !== false){
      hideLoading();
    }
    let data = res.data
    return data
  },
  // 错误处理
  error => {
    //判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if(error.config.headers.showLoading !== false){
      hideLoading();
    }
    let res = error.response
    console.log(res)

    if (res) {
      switch (res.status) {
        //401 登录过期 返回登录
        case 401:
          router.replace({
            path: '/login'
          })
          Message.error({
            message: '登录过期，请重新登录'
          })
          break
      }
    } else {
      Message.error({
        message: '请求超时，请刷新重试'
      })
    }
    return Promise.reject(error)
  }
)

// get请求方法
export function fetchGet (url, params) {
  return new Promise((resolve, reject) => {
    // get请求处理
    params = params ? params : ''

    Axios.get(url, {
      params: params
    })
      .then(
        res => {
          resolve(res)
        },
        error => {
          reject(error)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}

// post请求方法
export function fetchPost (url, params, contentType) {
  return new Promise((resolve, reject) => {
    // let _csrf = store.getters['_csrf'];
    let contentTypeUse =
      contentType == 'json'
        ? 'application/json;charset=UTF-8'
        : 'application/x-www-form-urlencoded;charset=UTF-8'
    let paramsUse = contentType == 'json' ? params : qs.stringify(params)

    // post请求处理
    // params = !params ? '' : qs.stringify(params);
    Axios.post(url, paramsUse, {
      headers: {
        'Content-Type': contentTypeUse
      }
    })
      .then(
        res => {
          resolve(res)
        },
        error => {
          reject(error)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}

// put请求方法
export function fetchPut (url, params, contentType) {
  return new Promise((resolve, reject) => {
    let contentTypeUse =
      contentType == 'json'
        ? 'application/json;charset=UTF-8'
        : 'application/x-www-form-urlencoded;charset=UTF-8'
    let paramsUse = contentType == 'json' ? params : qs.stringify(params)

    Axios.put(url, paramsUse, {
      headers: {
        'Content-Type': contentTypeUse
      }
    })
      .then(
        res => {
          resolve(res)
        },
        error => {
          reject(error)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}

// delete请求方法
export function fetchDelete (url, params) {
  return new Promise((resolve, reject) => {
    // get请求处理
    params = params ? params : ''
    Axios.delete(url, {
      params: params
    })
      .then(
        res => {
          resolve(res)
        },
        error => {
          reject(error)
        }
      )
      .catch(error => {
        reject(error)
      })
  })
}

// post请求方法上传文件
export function fetchPostFile(url, params, contentType) {
  return new Promise((resolve, reject) => {
    Axios.post(url, params, {
      headers: {
        'Content-Type':'multipart/form-data'
      },
    }).then(
      res => {
        resolve(res);
      },
      error => {
        reject(error)
      }
    ).catch((error) => {
      reject(error);
    })
  })
}
