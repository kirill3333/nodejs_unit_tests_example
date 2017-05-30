const proxyquire = require('proxyquire')
const sinon = require('sinon')
const faker = require('faker')
const assert = require('chai').assert

describe('todo/controller', () => {
  describe('controller', () => {

    let mdl
    let modelStub, serializerStub, populateMethodStub, fakeData
    let fakeSerializedData, fakeError
    let mongoResponse

    before(() => {
      fakeData = faker.helpers.createTransaction()
      fakeError = faker.lorem.word()
      populateMethodStub = {
        populate: sinon.stub().callsFake(() => mongoResponse)
      }
      modelStub = {
        find: sinon.stub().callsFake(() => {
          return populateMethodStub
        }),
        findOne: sinon.stub().callsFake(() => {
          return populateMethodStub
        })
      }

      fakeSerializedData = faker.helpers.createTransaction()
      serializerStub = {
        serialize: sinon.stub().callsFake(() => {
          return fakeSerializedData
        })
      }

      mdl = proxyquire('../todo/controller.js',
        {
          './model': modelStub,
          './serializer': serializerStub
        }
      )
    })

    beforeEach(() => {
      modelStub.find.resetHistory()
      modelStub.findOne.resetHistory()
      populateMethodStub.populate.resetHistory()
      serializerStub.serialize.resetHistory()
    })

    describe('getAll', () => {
      it('should return serialized search result from mongodb', (done) => {
        let resolveFn
        let fakeCallback = new Promise((res, rej) => {
          resolveFn = res
        })
        mongoResponse = Promise.resolve(fakeData)
        let fakeRes = {
          json: sinon.stub().callsFake(() => {
            resolveFn()
          })
        }
        mdl.getAll(null, fakeRes, null)

        fakeCallback.then(() => {
          sinon.assert.calledOnce(modelStub.find)
          sinon.assert.calledWith(modelStub.find, {})

          sinon.assert.calledOnce(populateMethodStub.populate)
          sinon.assert.calledWith(populateMethodStub.populate, '_user', '-password')

          sinon.assert.calledOnce(serializerStub.serialize)
          sinon.assert.calledWith(serializerStub.serialize, fakeData)

          sinon.assert.calledOnce(fakeRes.json)
          sinon.assert.calledWith(fakeRes.json, fakeSerializedData)
          done()
        }).catch(done)
      })

      it('should call next callback if mongo db return exception', (done) => {
        let fakeCallback = (err) => {
          assert.equal(fakeError, err)
          done()
        }
        mongoResponse = Promise.reject(fakeError)
        let fakeRes = sinon.mock()
        mdl.getAll(null, fakeRes, fakeCallback)
      })

    })

    describe('getOne', () => {

      it('should return serialized search result from mongodb', (done) => {
        let resolveFn
        let fakeCallback = new Promise((res, rej) => {
          resolveFn = res
        })
        mongoResponse = Promise.resolve(fakeData)
        let fakeRes = {
          json: sinon.stub().callsFake(() => {
            resolveFn()
          })
        }

        let fakeReq = {
          params: {
            id: faker.random.number()
          },
          user: {
            _id: faker.random.number()
          }
        }
        let findParams = {
          '_id': fakeReq.params.id,
          '_user': fakeReq.user._id
        }
        mdl.getOne(fakeReq, fakeRes, null)

        fakeCallback.then(() => {
          sinon.assert.calledOnce(modelStub.findOne)
          sinon.assert.calledWith(modelStub.findOne, findParams)

          sinon.assert.calledOnce(populateMethodStub.populate)
          sinon.assert.calledWith(populateMethodStub.populate, '_user', '-password')

          sinon.assert.calledOnce(serializerStub.serialize)
          sinon.assert.calledWith(serializerStub.serialize, fakeData)

          sinon.assert.calledOnce(fakeRes.json)
          sinon.assert.calledWith(fakeRes.json, fakeSerializedData)
          done()
        }).catch(done)
      })

      it('should call next callback if mongodb return exception', (done) => {
        let fakeReq = {
          params: {
            id: faker.random.number()
          },
          user: {
            _id: faker.random.number()
          }
        }
        let fakeCallback = (err) => {
          assert.equal(fakeError, err)
          done()
        }
        mongoResponse = Promise.reject(fakeError)
        let fakeRes = sinon.mock()
        mdl.getOne(fakeReq, fakeRes, fakeCallback)
      })

      it('should call next callback with error if mongodb return empty result', (done) => {
        let fakeReq = {
          params: {
            id: faker.random.number()
          },
          user: {
            _id: faker.random.number()
          }
        }
        let expectedError = new Error('No todo item found.')

        let fakeCallback = (err) => {
          assert.equal(expectedError.message, err.message)
          done()
        }

        mongoResponse = Promise.resolve(null)
        let fakeRes = sinon.mock()
        mdl.getOne(fakeReq, fakeRes, fakeCallback)
      })

    })
  })
})