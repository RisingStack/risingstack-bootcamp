'use strict'

const { expect } = require('chai')
const _ = require('lodash')
const redis = require('../../models/redis')
const worker = require('../worker')
const handlers = require('./')

const { CHANNELS } = redis

describe('Worker "trigger" channel', () => {
  it(`should handle messages on the ${CHANNELS.collect.trigger.v1} channel`, async function () {
    const date = new Date().toISOString()
    const query = 'language:javascript'

    const done = new Promise((resolve, reject) => {
      this.sandbox.stub(handlers, 'trigger').callsFake(async (params) => {
        await worker.halt()

        try {
          expect(params).to.be.eql({
            date,
            query
          })
        } catch (err) {
          reject(err)
          return
        }

        resolve()
      })
    })

    await worker.init()

    await redis.publishObject(CHANNELS.collect.trigger.v1, {
      date,
      query
    })

    return done
  })

  it(`should send the messages to the ${CHANNELS.collect.repository.v1} channel`, async function () {
    this.sandbox.stub(redis, 'publishObject').resolves()

    const date = new Date().toISOString()
    const query = 'language:javascript'
    await handlers.trigger({
      date,
      query
    })

    expect(redis.publishObject).to.have.callCount(10)
    _.range(10).forEach((page) => {
      expect(redis.publishObject).to.have.been.calledWith(CHANNELS.collect.repository.v1, {
        date,
        query,
        page
      })
    })
  })
})
