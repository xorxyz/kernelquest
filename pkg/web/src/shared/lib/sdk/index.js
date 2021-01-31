import request from 'request-promise'

const BASE_URL = process.env.VUE_APP_API_URL

export default {
  signup,
  activate,
  login,
  logout
}

function signup ({ email, code, username, passphrase }) {
  return request({
    method: 'POST',
    json: true,
    url: BASE_URL + '/v1/users',
    body: {
      email,
      code,
      username,
      passphrase
    }
  })
}

function activate (code) {
  return request({
    method: 'POST',
    json: true,
    url: BASE_URL + '/api/v1/activations/' + code
  })
}

function login ({ username, passphrase }) {
  return request({
    method: 'POST',
    json: true,
    url: BASE_URL + '/v1/login',
    body: {
      username,
      passphrase
    }
  })
}

function logout () {
  return request({
    method: 'POST',
    json: true,
    url: BASE_URL + '/v1/logout'
  })
}
