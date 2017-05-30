const proxyquire = require('proxyquire')
const sinon = require('sinon')
const faker = require('faker')

describe('todo/routes', () => {
  describe('router', () => {
    let expressStub, controllerStub, RouterStub, rootRouteStub, idRouterStub

    before(() => {
      rootRouteStub = {
        "get": sinon.stub().callsFake(() => rootRouteStub),
        "post": sinon.stub().callsFake(() => rootRouteStub)
      }
      idRouterStub = {
        "get": sinon.stub().callsFake(() => idRouterStub),
        "put": sinon.stub().callsFake(() => idRouterStub),
        "delete": sinon.stub().callsFake(() => idRouterStub)
      }
      RouterStub = {
        route: sinon.stub().callsFake((route) => {
          if (route === '/:id') {
            return idRouterStub
          }
          return rootRouteStub
        })
      }

      expressStub = {
        Router: sinon.stub().returns(RouterStub)
      }

      controllerStub = {
        getAll: sinon.mock(),
        create: sinon.mock(),
        getOne: sinon.mock(),
        update: sinon.mock(),
        delete: sinon.mock()
      }

      proxyquire('../todo/routes.js',
        {
          'express': expressStub,
          './controller': controllerStub
        }
      )
    })

    it('should map root get router with getAll controller', () => {
      sinon.assert.calledWith(RouterStub.route, '/')
      sinon.assert.calledWith(rootRouteStub.get, controllerStub.getAll)
    })

    it('should map root post router with create controller', () => {
      sinon.assert.calledWith(RouterStub.route, '/')
      sinon.assert.calledWith(rootRouteStub.post, controllerStub.create)
    })

    it('should map /:id get router with getOne controller', () => {
      sinon.assert.calledWith(RouterStub.route, '/:id')
      sinon.assert.calledWith(idRouterStub.get, controllerStub.getOne)
    })

    it('should map /:id put router with update controller', () => {
      sinon.assert.calledWith(RouterStub.route, '/:id')
      sinon.assert.calledWith(idRouterStub.put, controllerStub.update)
    })

    it('should map /:id delete router with delete controller', () => {
      sinon.assert.calledWith(RouterStub.route, '/:id')
      sinon.assert.calledWith(idRouterStub.delete, controllerStub.delete)
    })
  })
})