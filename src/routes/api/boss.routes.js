const router = require('express').Router();
const upload = require('../../config/multer');

const { getAllUsers, getUsersById, createUser, updateUser, deleteUser, getAllWarehouse, createWarehouse, getWarehouseById, updateWarehouse, deleteWarehouse } = require('../../controllers/boss.controller');
const { validateImage } = require('../../utils/middlewares');


router.get('/users', getAllUsers)
router.get('/warehouse', getAllWarehouse)
router.get('/users/:id', getUsersById )
router.get('/warehouse/:id', getWarehouseById)

router.post('/register', upload.single('image'), validateImage, createUser)
router.post('/warehouse', upload.single('image'), validateImage, createWarehouse)

router.put('/users/:id', upload.single('image'), validateImage, updateUser)
router.put('/warehouse/:id', upload.single('image'), validateImage, updateWarehouse)

router.delete('/users/:id', deleteUser)
router.delete('/warehouse/:id', deleteWarehouse)


module.exports = router;