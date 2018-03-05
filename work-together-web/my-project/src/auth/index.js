export default {
  user: {
    authenticated: false
  },
  signup (context, creds, redirect) {
    var url = '/session/'
    var data = JSON.stringify(creds)

    context.$http.post(url, data)
      .then((res) => {
        sessionStorage.setItem('token', res.data.token)
        this.user.authenticated = true
        if (redirect) {
          context.$router.push({path: '/home/welcome'})
        }
      })
      .catch((err) => {
        console.log(err)
        context.error = err.data
      })
  },
  logout (context) {
    sessionStorage.removeItem('token')
    window.localStorage.removeItem('cnodeBaseInfo')
    this.user.authenticated = false
    context.$router.push({path: '/login'})
  },
  check () {
    var jwt = sessionStorage.getItem('token')
    if (jwt) {
      this.user.authenticated = true
      return true
    } else {
      if (ENV.NODE_ENV=='"development"') {
        return true
      }
      this.user.authenticated = false
      return false
    }
  },
  getAuthHeader () {
    return {
      'Authorization': 'Bearer ' + sessionStorage.getItem('token')
    }
  },
}
