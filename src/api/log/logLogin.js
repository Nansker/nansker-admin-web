import request from '@/utils/request'

const base_url = "/admin/system/log/login"
const logLoginApi = {
  /** 获取分页数据 */
  listPage(data) {
    return request({
      url: `${base_url}/page`,
      method: 'get',
      params: data
    })
  },

  /** 获取用户登录日志 */
  getLogByUser(){
    return request({
      url: `${base_url}/log`,
      method: 'get'
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

export default logLoginApi
