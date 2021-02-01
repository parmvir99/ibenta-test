/* eslint-disable */
import Vue from 'vue'
import store from '@/store'

import BaseApi from './BaseApi'

class Auth extends BaseApi {

  authenticate (githubAuth) {
    return new Promise((resolve, reject) => {
      githubAuth.credentials.getToken([ githubAuth.options ]).then((res) => {
        if (res && res.data) {
          const token = res.data.access_token
          store.dispatch('_setCredentials_', { token })
        }
      })
    })
  }
}

export default new Auth()
