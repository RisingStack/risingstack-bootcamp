'use strict'

const sinon = require('sinon')
const chai = require('chai')
const sinonChai = require('sinon-chai')
const winston = require('winston')

chai.use(sinonChai)

// logger
winston.setLevels({ test: 0, error: 1, warn: 2, info: 3, verbose: 4, debug: 5, silly: 6 })
winston.addColors({
  test: 'cyan', error: 'red', warn: 'yellow', info: 'cyan', verbose: 'cyan', debug: 'blue', silly: 'magenta'
})
winston.remove(winston.transports.Console)
winston.add(winston.transports.Console, {
  level: process.env.LOGGER_LEVEL || 'test', colorize: true, prettyPrint: true
})

beforeEach(function beforeEach() {
  this.sandbox = sinon.sandbox.create()
})

afterEach(function afterEach() {
  this.sandbox.restore()
})
