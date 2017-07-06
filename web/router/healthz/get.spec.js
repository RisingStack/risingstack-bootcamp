/* eslint-disable no-unused-expressions */

'use strict'

const { expect } = require('chai')
const request = require('super-request')
const db = require('../../../models/db')
const redis = require('../../../models/redis')
const server = require('../../server')

const url = '/healthz'
describe(`GET ${url}`, () => {
  it('should be healthy', async function () {
    this.sandbox.stub(db, 'healthCheck').resolves()
    this.sandbox.stub(redis, 'healthCheck').resolves()

    const { body } = await request(server.listen())
      .get(url)
      .json(true)
      .expect(200)
      .end()

    expect(body).to.be.eql({
      status: 'ok'
    })

    expect(db.healthCheck).to.have.been.called
    expect(redis.healthCheck).to.have.been.called
  })

  it('should return 500 if the db is not healthy', async function () {
    this.sandbox.stub(db, 'healthCheck').rejects(new Error())
    this.sandbox.stub(redis, 'healthCheck').resolves()

    await request(server.listen())
      .get(url)
      .expect(500)
      .end()

    expect(db.healthCheck).to.have.been.called
  })

  it('should return 500 if the redis is not healthy', async function () {
    this.sandbox.stub(db, 'healthCheck').resolves()
    this.sandbox.stub(redis, 'healthCheck').rejects(new Error())

    await request(server.listen())
      .get(url)
      .expect(500)
      .end()

    expect(redis.healthCheck).to.have.been.called
  })

  it('should return 503 if the process got SIGTERM', async function () {
    this.sandbox.stub(db, 'healthCheck').resolves()
    this.sandbox.stub(redis, 'healthCheck').resolves()

    process.emit('SIGTERM')

    await request(server.listen())
      .get(url)
      .expect(503)
      .end()

    expect(db.healthCheck).not.to.have.been.called
    expect(redis.healthCheck).not.to.have.been.called
  })
})
