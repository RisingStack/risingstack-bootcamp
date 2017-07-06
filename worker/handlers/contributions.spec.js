'use strict'

const _ = require('lodash')
const { expect } = require('chai')
const worker = require('../worker')
const redis = require('../../models/redis')
const GitHub = require('../../models/github')
const User = require('../../models/user')
const Contribution = require('../../models/contribution')
const handlers = require('./')

const { CHANNELS } = redis

describe('Worker "contributions" channel', () => {
  it(`should handle messages on the ${CHANNELS.collect.contributions.v1} channel`, async function () {
    const date = new Date().toISOString()
    const repository = {
      id: _.random(1000),
      full_name: 'project/name'
    }

    const done = new Promise((resolve, reject) => {
      this.sandbox.stub(handlers, 'contributions').callsFake(async (params) => {
        await worker.halt()

        try {
          expect(params).to.be.eql({
            date,
            repository
          })
        } catch (err) {
          reject(err)
          return
        }

        resolve()
      })
    })

    await worker.init()

    await redis.publishObject(CHANNELS.collect.contributions.v1, {
      date,
      repository
    })

    return done
  })

  it('should fetch the contributions from GitHub & save them to the database',
    async function () {
      const date = new Date().toISOString()
      const repository = {
        id: _.random(1000),
        full_name: 'project/name'
      }

      const author = {
        id: _.random(1000),
        login: 'user'
      }

      this.sandbox.stub(GitHub.api, 'getContributors').resolves([{
        author,
        weeks: [{
          a: 100,
          d: 10
        }, {
          a: 30,
          d: 50
        }]
      }])
      this.sandbox.stub(User, 'insert').resolves()
      this.sandbox.stub(Contribution, 'insertOrReplace').resolves()

      await handlers.contributions({
        date,
        repository
      })

      expect(GitHub.api.getContributors).to.have.been.calledWith(repository.full_name)
      expect(User.insert).to.have.been.calledWith(author)
      expect(Contribution.insertOrReplace).to.have.been.calledWith({
        line_count: 70,
        repository: repository.id,
        user: author.id
      })
    })
})
