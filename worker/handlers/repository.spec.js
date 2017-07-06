'use strict'

const _ = require('lodash')
const { expect } = require('chai')
const worker = require('../worker')
const redis = require('../../models/redis')
const GitHub = require('../../models/github')
const User = require('../../models/user')
const Repository = require('../../models/repository')
const handlers = require('./')

const { CHANNELS } = redis

describe('Worker "repository" channel', () => {
  it(`should handle messages on the ${CHANNELS.collect.repository.v1} channel`, async function () {
    const date = new Date().toISOString()
    const query = 'language:javascript'
    const page = _.random(10)

    const done = new Promise((resolve, reject) => {
      this.sandbox.stub(handlers, 'repository').callsFake(async (params) => {
        await worker.halt()

        try {
          expect(params).to.be.eql({
            date,
            query,
            page
          })
        } catch (err) {
          reject(err)
          return
        }

        resolve()
      })
    })

    await worker.init()

    await redis.publishObject(CHANNELS.collect.repository.v1, {
      date,
      query,
      page
    })

    return done
  })

  it(`should fetch repositories from GitHub & send the messages to the ${CHANNELS.collect.contributions.v1} channel`,
    async function () {
      const owner = {
        id: _.random(1000),
        login: 'project-owner',
        avatar_url: 'https://github.com/project-owner.png',
        html_url: 'https://github.com/project-owner.png',
        type: 'User'
      }

      const repository = {
        id: _.random(1000),
        full_name: 'project/name',
        description: 'Very project',
        html_url: 'https://github.com/project/name',
        language: 'JavaScript',
        stargazers_count: _.random(1000)
      }

      this.sandbox.stub(GitHub.api, 'searchRepositories').resolves({ items: [Object.assign({ owner }, repository)] })
      this.sandbox.stub(User, 'insert').resolves()
      this.sandbox.stub(Repository, 'insert').resolves()
      this.sandbox.stub(redis, 'publishObject').resolves()

      const date = new Date().toISOString()
      const query = 'language:javascript'
      const page = 0

      await handlers.repository({
        date,
        query,
        page
      })

      expect(GitHub.api.searchRepositories).to.have.been.calledWith({ q: query, page, per_page: 100 })
      expect(User.insert).to.have.been.calledWith(owner)
      expect(Repository.insert).to.have.been.calledWith(Object.assign({ owner: owner.id }, repository))
      expect(redis.publishObject).to.have.been.calledWith(CHANNELS.collect.contributions.v1, {
        date,
        repository: Object.assign({ owner: owner.id }, repository)
      })
    })
})
