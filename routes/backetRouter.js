const Router = require('express')
const router = new Router()
const backetController = require('../controllers/backetCoutroller')
const authMiddleware = require('../middleware/AuthMiddleware')
const checkRoleMiddleware = require('../middleware/CheckRoleMiddleware')


router.post('/',authMiddleware, backetController.addItem)
router.get('/user',authMiddleware, backetController.getById)
router.get('/',checkRoleMiddleware('ADMIN'), backetController.getAll)
router.delete('/',authMiddleware, backetController.deleteOneItem)
router.delete('/all', authMiddleware, backetController.deleteAllItemById)

module.exports = router