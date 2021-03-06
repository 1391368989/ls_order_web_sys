import moment from 'moment';
import { parse, stringify } from 'qs';
import { message } from 'antd';

export const host = 'http://192.168.1.84:8080';
/*export const localhost = 'http://192.168.1.83:85';*/

/*export const host = 'http://172.16.0.201:8080';*/
export const localhost = 'http://localhost:8000';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul(arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}
export function getQuery(search) {
  if(!search) return false;
  let str = search.replace('?','');
  let arr = str.split('&');
  let obj = {};
  for(let i=0; i<arr.length;i++ ){
    let new_arr = arr[i].split('=');
    if(new_arr.length>1&&new_arr[1] !== ''){
      const newStr = decodeURI(new_arr[1]);
      obj[new_arr[0]] = newStr
    }
  }
  return obj
}
export function validatePhone(phone) {
  let reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则
  if(phone === ''||phone === undefined){
    message.error('手机号不能为空。');
    return true;
  }
  if(!reg.test(phone)){
    message.error('手机号格式不对。');
    return true;
  }
  return false;
}
export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function isRepeat(obj,vlaue) {
  for(let j in obj ){
    if( parseInt(j) === vlaue){
      return true
    }
  }
  return false
}
function getMenuData(menu) {
  for(let i in menu){
    if(menu[i].image){
      menu[i].icon = menu[i].image;
    }
    menu[i].pathName = menu[i].path;
    if(menu[i].type<2&&menu[i].menuVOS){
      menu[i].children = getMenuData(menu[i].menuVOS)
    }
  }
  return menu;
}

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export function filterMenu(menu) {
  let list = filterAuthority([],menu);
  localStorage.setItem('authority', JSON.stringify(list));
  let newMenu = getMenuData(menu);
  return formatter(newMenu)
}
function filterAuthority(list,data) {
  data.map(item=>{
    if(item.type ===3){
      list.push(item);
    }
    if (item.menuVOS) {
      filterAuthority(list,item.menuVOS)
    }
    });
  return list;
}
/*export function getAuthority(pathname) {
  const arr = pathname.split('/');
  const authority =  localStorage.getItem('authority');
  const obj = JSON.parse(authority);
  for(let i in obj){
    let newObj = obj[i].children;

    for(let j in newObj){
      if(newObj[j].path === pathname){
        return newObj[j].menuVOS
      }
    }
  }

  return [];
}*/
export function getAuthority(value) {
  const authority =  localStorage.getItem('authority');
  const data = JSON.parse(authority);
  for(let i in data ){
    if(data[i].path === value){
      return true;
    }
  }
  return false;
}
//手机号验证规则
export const mobilePattern    =/^(((13[0-9])|(14[5-7])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8})$/;
//密码验证规则
/*export const passwordPattern  =/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z\d]{6,16}$/;*/
export const passwordPattern  =/ ^[a-zA-Z0-9]{6,12}$/;
//身份证验证规则
export const idPattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
//银行卡号验证规则
export const bankCodePattern =/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
/*
返回true 验证通过
* */
export function validate_mobile (mobile){
  const mobilePattern={mobile: /^(((13[0-9])|(14[5-7])|(15[0-9])|(17[0-9])|(18[0-9]))+\d{8})$/ };
  if(!mobilePattern.mobile.test(mobile)){
    return false;
  }
  return true;
}
//密码验证规则
/*
 返回true 验证通过
 * */
export function validate_password(password){
  const passwordPattern=/^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z\d]{6,16}$/;
  if(!passwordPattern.test(password)){
    return false;
  }
  return true;
}

//身份证证号码验证
/*
 返回true 验证通过
 * */
export function validate_passwords(card){
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if(reg.test(card) === false) {
    return  false;
  }
  return true;
}

//银行号码验证
/*
 返回true 验证通过
 * */
export function validate_BankCard(cardId){
  const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if(reg.test(cardId) === false) {
    return  false;
  }
  return true;
}


export function formatBankNo (BankNo){
  if (BankNo.value === "") return;
  let account = (BankNo.value).toString();
  account = account.substring(0,22); /*帐号的总数, 包括空格在内 */
  if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") === null){
    /* 对照格式 */
    if (account.match (".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" +
        ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}|" + ".[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{7}") === null){
      let accountChar,accountNumeric = accountChar = "", i;
      for (i=0;i<account.length;i++){
        accountChar = account.substr (i,1);
        if (!isNaN (accountChar) && (accountChar !== " ")) accountNumeric = accountNumeric + accountChar;
      }
      account = "";
      for (i=0;i<accountNumeric.length;i++){  /* 可将以下空格改为-,效果也不错 */
        if (i === 4) account = account + " "; /* 帐号第四位数后加空格 */
        if (i === 8) account = account + " "; /* 帐号第八位数后加空格 */
        if (i === 12) account = account + " ";/* 帐号第十二位后数后加空格 */
        account = account + accountNumeric.substr (i,1)
      }
    }
  }
  else
  {
    account = " " + account.substring (1,5) + " " + account.substring (6,10) + " " + account.substring (14,18) + "-" + account.substring(18,25);
  }
  if (account !== BankNo.value) BankNo.value = account;
}

//重置
export function formReset (this_){
  this_.props.form.resetFields();
  this_.state.query ={
    page_rows:10,
    page_page:1,
  };
}
