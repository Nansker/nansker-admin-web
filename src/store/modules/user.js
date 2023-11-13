import {getToken, setToken, removeToken} from '@/utils/auth'
import {resetRouter} from '@/router'
import userApi from "@/api/user";
import message from "@/utils/message";
import da from "element-ui/src/locale/lang/da";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    permissions: '',
    userInfo: {},
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSIONS: (state, permissions) => {
    state.permissions = permissions
  },
  SET_USER: (state, user) => {
    state.userInfo = user
  }
}

const actions = {
  // user login
  login({commit}, userInfo) {
    const {username, password} = userInfo
    return new Promise((resolve, reject) => {
      userApi.login({username: username.trim(), password: password}).then(response => {
        const {data} = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({commit}) {
    return new Promise((resolve, reject) => {
      userApi.getInfo().then(response => {
        const {data} = response

        if (!data) {
          return reject('验证失败，请稍后再试')
        }

        commit('SET_NAME', data.name)
        commit('SET_AVATAR', data.avatar)
        commit('SET_USER', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getPermission({commit}) {
    return new Promise((resolve, reject) => {
      userApi.getPermission().then(response => {
        const {data} = response
        if (!data) {
          return reject('验证失败，请稍后再试')
        }
        commit('SET_PERMISSIONS', data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({commit, state}) {
    return new Promise((resolve, reject) => {
      userApi.logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

