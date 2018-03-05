var merge = require('webpack-merge')
var devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  HOST_URL: "http://10.8.230.114:8080/v1",
  PAGE_SHOW_COUNT: 2,
  UPLOAD_HOST_URL: "http://10.8.230.114:8080/v1",
})
