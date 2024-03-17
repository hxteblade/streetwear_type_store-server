const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')

router.post('/',checkRoleMiddleware('ADMIN'), typeController.create)
router.get('/', typeController.getAll)
router.delete('/',checkRoleMiddleware('ADMIN'), typeController.delete)

module.exports = router