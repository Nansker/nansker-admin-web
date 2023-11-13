import request from '@/utils/request'

const base_url = "/admin/system/permission"
const menuApi = {
  /** 获取所有角色 */
  list() {
    return request({
      url: `${base_url}/all`,
      method: 'get'
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
  }
}

export default menuApi
