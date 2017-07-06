/* eslint-disable global-require */

'use strict'

const logger = require('winston')
const semver = require('semver')
const pkg = require('./package.json')

// validate Node version requirement
const runtime = {
  expected: semver.validRange(pkg.engines.node),
  actual: semver.valid(process.version)
}
const valid = semver.satisfies(runtime.actual, runtime.expected)
if (!valid) {
  throw new Error(
    `Expected Node.js version ${runtime.expected}, but found v${runtime.actual}. Please update or change your runtime!`
  )
}

// configure logger
logger.default.transports.console.colorize = true
logger.default.transports.console.timestamp = true
logger.default.transports.console.prettyPrint = true

// start process
logger.info('Starting web process', { pid: process.pid })

require('./web')
