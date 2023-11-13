import request from '@/utils/request'

const base_url = "/admin/system/role"
const roleApi = {
  /** 获取所有角色 */
  getAll() {
    return request({
      url: `${base_url}/all`,
      method: 'get'
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

  /** 保存信息 */
  save(data) {
    return request({
      url: `${base_url}/save`,
      method: 'post',
      data
    })
  },

  /** 保存信息 */
  update(data) {
    return request({
      url: `${base_url}/update`,
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

  /** 删除信息 */
  batchRemove(ids) {
    return request({
      url: `${base_url}/remove/batch`,
      method: 'delete',
      ids
    })
  },

  /** 根据id获取菜单信息 */
  getMenuById(id) {
    return request({
      url: `${base_url}/permission/${id}`,
      method: 'get'
    })
  },

  /** 分配角色菜单权限 */
  doRoleMenuAssign(data) {
    return request({
      url: `${base_url}/permission/assign`,
      method: 'post',
      data
    })
  },

}
export default roleApi
