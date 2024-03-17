const Router = require('express')
const router = new Router()
const itemController = require('../controllers/itemController')
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')

router.post('/',checkRoleMiddleware('ADMIN'), itemController.create)
router.get('/', itemController.getAll)
router.get('/:id', itemController.getById)
router.delete('/',checkRoleMiddleware('ADMIN'), itemController.delete)

module.exports = router