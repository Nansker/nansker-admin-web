import request from '@/utils/request'

const base_url = "/admin/system/user"
const userApi = {
  login(data) {
    return request({
      url: `${base_url}/login`,
      method: 'post',
      data
    })
  },
  getInfo() {
    return request({
      url: `${base_url}/info`,
      method: 'get'
    })
  },
  logout() {
    return request({
      url: `${base_url}/logout`,
      method: 'post'
    })
  },

  /** 获取分页数据 */
  list(data) {
    return request({
      url: `${base_url}/page`,
      method: 'get',
      params: data
    })
  },

  /** 根据id获取信息 */
  getById(id) {
    return request({
      url: `${base_url}/${id}`,
      method: 'get'
    })
  },

  /** 根据用户id获取分配的信息 */
  getRoleByUserId(id) {
    return request({
      url: `${base_url}/role/${id}`,
      method: 'get'
    })
  },

  /** 获取用户权限路由 */
  getPermission(){
    return request({
      url: `${base_url}/permission`,
      method: 'get'
    })
  },

  /** 根据用户id分配角色 */
  roleAssign(data) {
    return request({
      url: `${base_url}/role/assign`,
      method: 'post',
      data
    })
  },

  /** *保存信息 */
  save(data) {
    return request({
      url: `${base_url}/save`,
      method: 'post',
      data
    })
  },

  /** 修改信息 */
  update(data) {
    return request({
      url: `${base_url}/update`,
      method: 'put',
      data
    })
  },

  /** 修改信息 */
  updatePassword(data) {
    return request({
      url: `${base_url}/password`,
      method: 'put',
      data
    })
  },

  /** 删除信息 */
  remove(id) {
    return request({
      url: `${base_url}/remove/${id}`,
      method: 'delete'
    })
  },

  /** 批量删除信息 */
  batchRemove(ids) {
    return request({
      url: `${base_url}/remove/batch`,
      method: 'delete',
      ids
    })
  }
}
export default userApi
