const http = require('http')
const EventEmmiter = require('events')

module.exports = class Application {
  constructor() {
    this.emitter = new EventEmmiter()
    this.server = this._createServer()
    this.middlewares = []
  }

  use(middleware) {
    this.middlewares.push(middleware)
  }

  listen(port, callback) {
    this.server.listen(port, callback)
  }

  addRouter(router) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path]
      Object.keys(endpoint).forEach((method) => {
        const handler = endpoint[method]
        this.emitter.on(this._getRouteMask(path, method), (req, res) => {
          this.middlewares.forEach((middleware) => middleware(req, res))
          handler(req, res)
        })
      })
    })
  }

  _createServer() {
    return http.createServer((req, res) => {
      const emitted = this.emitter.emit(
        this._getRouteMask(req.url, req.method),
        req,
        res
      )
      if (!emitted) {
        res.end('no such endpoint')
      }
    })
  }

  _getRouteMask(path, method) {
    return `[${path}]:[${method}]`
  }
}
