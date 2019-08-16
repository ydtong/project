'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'pred'

let { bulidConfig } = require("./bulid-config")
bulidConfig()