'use strict'

const Router = require('koa-router')

const router = new Router()

router.get('/hello', (ctx) => {
  ctx.body = 'Hello Node.js!'
})

module.exports = router
