'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

let { bulidConfig } = require("./bulid-config")
bulidConfig()