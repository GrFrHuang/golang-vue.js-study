// content
import {
  SET_BASEINFO,
  SET_SHAREDATA,
  SET_PERMISSION,
  SET_HEADER_PIC,
} from '../mutation_types'

const state = {
  id: 0,
  accessToken: '',
  loginName: '',
  departmentName: '',
  nickName: '',
  picFileId: 0,
  isAdmin: '',
  menu: [{
    "url": ""
  }],
  shareData: {},
  permission: {
    viewusers: false,
    viewgames: false,
  },
}
const mutations = {
  // 设置 token 登录名 头像
  [SET_BASEINFO] (state, data) {
    console.log(data)
    try {
      state.id = data.info.id
      state.accessToken = data.info.access_token
      state.loginName = data.info.email
      state.nickName = data.info.nickname
      state.picFileId = data.info.pic_file_id
      state.departmentName = data.info.department_name
      state.isAdmin = data.isAdmin
      state.menu = data.menu
    } catch (err) {
      console.log(err)
    }
  },
  [SET_SHAREDATA](state, data) {
    try {
      state.shareData = data
    } catch (err) {
      console.log(err)
    }
  },
  [SET_HEADER_PIC](state, data) {
    state.picFileId = data
  },
  [SET_PERMISSION](state, data) {
    try {
      state.permission.viewusers = data.viewusers
      state.permission.viewgames = data.viewgames
    } catch (err) {
      console.log(err)
    }
  },

}

export default {
  state,
  mutations
}
