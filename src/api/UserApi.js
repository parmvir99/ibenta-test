import BaseApi from './BaseApi'

class UserApi extends BaseApi {

  getUsers () {
    return super.execGET(`/users`)
  }

  createUser (payload) {
    return super.execPOST(`/users`, payload)
  }

  editUser (id) {
    return super.execEDT(`/users/${id}`)
  }

  deleteUser (id) {
    return super.execDELETE(`/users/${id}`)
  }
}

export default new UserApi()
