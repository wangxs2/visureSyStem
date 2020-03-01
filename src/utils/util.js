/**
 *@method 格式时间戳
 *@param new Date().Format('yyyy-MM-dd hh:mm:ss')
 *@return {String}
 */
Date.prototype.Format = function(fmt) {
  var o = {
    'M+': this.getMonth() + 1, //月份
    'd+': this.getDate(), //日
    'h+': this.getHours(), //小时
    'm+': this.getMinutes(), //分
    's+': this.getSeconds(), //秒
    'q+': Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds() //毫秒
  }
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + '').substr(4 - RegExp.$1.length)
    )
  for (var k in o)
    if (new RegExp('(' + k + ')').test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
  return fmt
}
/**
 *@method 获取cookie
 */
export function getCookie(name) {
  var arr,
    reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
  if ((arr = document.cookie.match(reg))) {
    return unescape(arr[2])
  } else {
    return null
  }
}

/**
 * @method 数据类型判断
 * @param {any} 数据
 * @return {string}
 */
export function judgeType(n) {
  const typeStr = Object.prototype.toString.call(n)
  let typeName = ''
  switch (typeStr) {
    case '[object String]':
      typeName = 'string'
      break
    case '[object Number]':
      typeName = 'number'
      break
    case '[object Boolean]':
      typeName = 'boolean'
      break
    case '[object Undefined]':
      typeName = 'undefined'
      break
    case '[object Object]':
      typeName = 'object'
      break
    case '[object Array]':
      typeName = 'array'
      break
    case '[object Null]':
      typeName = 'null'
      break
    case '[object RegExp]':
      typeName = 'RegExp'
      break
    case '[object Symbol]':
      typeName = 'symbol'
      break
    case '[object JSON]':
      typeName = 'json'
      break
    case '[object Math]':
      typeName = 'math'
      break
    default:
      typeName = 'object'
  }

  return typeName
}

/**
 *@method 删除cookie
 */
export function delCookie(name) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(name)
  if (cval != null)
    document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
}
export function screenHeight(){
  var curHeight=document.body.clientHeight
  console.log(curHeight)
  return curHeight
}
export function FontSize(){
  var curFontSize=100/1920
  return curHeight
}
export function formatDate(datetime) {
  var date = new Date(datetime);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var year = date.getFullYear(),
      month = ("0" + (date.getMonth() + 1)).slice(-2),
      sdate = ("0" + date.getDate()).slice(-2),
      hour = ("0" + date.getHours()).slice(-2),
      minute = ("0" + date.getMinutes()).slice(-2),
      second = ("0" + date.getSeconds()).slice(-2);
  // 拼接
  var result = year + "-"+ month +"-"+ sdate +" "+ hour +":"+ minute +":" + second;
  // 返回
  return result;
}
