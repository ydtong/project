'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'lan'

let { bulidConfig } = require("./bulid-config")
bulidConfig()