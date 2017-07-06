'use strict'

const _ = require('lodash')
const request = require('super-request')
const { expect } = require('chai')
const Repository = require('../../../models/repository')
const server = require('../../server')

const url = '/api/v1/repository/:owner/:name'
describe(`GET ${url}`, () => {
  it('should response with 200 when the repository exists', async function () {
    const id = _.random(1000)
    const owner = 'RisingStack'
    const name = 'foo'
    const fullName = `${owner}/${name}`
    this.sandbox.stub(Repository, 'read').resolves({ id, full_name: fullName })

    const { body } = await request(server.listen())
      .get(url.replace(':owner', owner).replace(':name', name))
      .expect(200)
      .json(true)
      .end()

    expect(body).to.eql({ id, full_name: fullName })
    expect(Repository.read).to.have.been.calledWith({ full_name: fullName })
  })

  it('should response with 404 when the repository does not exist', async function () {
    const owner = 'RisingStack'
    const name = 'foo'
    const fullName = `${owner}/${name}`
    this.sandbox.stub(Repository, 'read').resolves(undefined)

    await request(server.listen())
      .get(url.replace(':owner', owner).replace(':name', name))
      .expect(404)
      .json(true)
      .end()

    expect(Repository.read).to.have.been.calledWith({ full_name: fullName })
  })
})
