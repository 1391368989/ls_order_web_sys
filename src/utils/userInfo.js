export function getUserInfo() {
  return localStorage.getItem('userInfo');
}

export function setUserInfo(user) {
  if(typeof user === 'object'){
    user = JSON.stringify(user)
  }
  return localStorage.setItem('userInfo', user);
}
