'use strict'

const request = require('super-request')
const { expect } = require('chai')
const server = require('./server')

describe('GET /hello', () => {
  it('should response with `Hello Node.js!`', async () => {
    const { body } = await request(server.listen())
      .get('/hello')
      .expect(200)
      .end()

    expect(body).to.eql('Hello Node.js!')
  })
})
