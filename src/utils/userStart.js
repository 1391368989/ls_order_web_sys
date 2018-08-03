export function getUserStart() {
  return localStorage.getItem('userStart');
}

export function setUserStart(authority) {
  return localStorage.setItem('userStart', authority);
}
