'use strict'

const request = require('super-request')
const { expect } = require('chai')
const redis = require('../../../models/redis')
const server = require('../../server')

const { CHANNELS } = redis

const url = '/api/v1/trigger'
describe(`POST ${url}`, () => {
  let now

  beforeEach(function () {
    now = Date.now()
    this.sandbox.useFakeTimers(now)
  })

  it('should validate the body', async () => {
    const { body } = await request(server.listen())
      .post(url)
      .expect(400)
      .json(true)
      .end()

    expect(body).to.eql({ errors: { query: ['"query" is required'] } })
  })

  it('should response with 201 and send to the trigger queue', async function () {
    this.sandbox.stub(redis, 'publishObject').resolves()

    const query = 'language:javascript'
    await request(server.listen())
      .post(url)
      .body({
        query
      })
      .expect(201)
      .json(true)
      .end()

    expect(redis.publishObject).to.have.been.calledWith(CHANNELS.collect.trigger.v1, {
      query,
      date: new Date(now).toISOString()
    })
  })
})
