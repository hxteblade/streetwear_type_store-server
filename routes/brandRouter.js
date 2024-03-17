const Router = require('express')
const router = new Router()
const brandController = require('../controllers/brandController')
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')

router.post('/',checkRoleMiddleware('ADMIN'), brandController.create)
router.get('/', brandController.getAll)
router.delete('/',checkRoleMiddleware('ADMIN'), brandController.delete)

module.exports = router