const Router = require('../framework/Router')
const router = new Router()
const controller = require('./user-controller')

router.get('/users', controller.getUsers)

router.post('/users', controller.createUser)

module.exports = router
