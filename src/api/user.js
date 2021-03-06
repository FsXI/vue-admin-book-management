import request from '@/utils/request'


export function login1(params) {
  return request({
    url: 'http://localhost:8888/bookManagement/reader/login',
    method: 'post',
    params,
  })
}

/* export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token },
  })
} */
export function getInfo(token) {
  return request({
    url: 'http://localhost:8888/bookManagement/reader/getReaderInfo',
    method: 'post',
    params: { token },
  })
}

export function logout() {
  return request({
    url: '/dev-api/vue-admin-template/user/logout',
    method: 'post',
  })
}
