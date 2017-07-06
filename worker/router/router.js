'use strict'

const Router = require('koa-router')
const healthz = require('./healthz')

const router = new Router()

router.get('/healthz', healthz.get)

module.exports = router
