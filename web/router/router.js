'use strict'

const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const middleware = require('../middleware')

const router = new Router()

router
  .use(bodyParser())
  .use(middleware.queryParser({ allowDots: true }))

router.get('/hello', (ctx) => {
  ctx.body = 'Hello Node.js!'
})

module.exports = router
