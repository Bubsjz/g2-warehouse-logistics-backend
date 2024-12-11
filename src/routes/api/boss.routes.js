const router = require('express').Router();
const upload = require('../../config/multer');

const { getAllUsers, getUsersById, createUser, updateUser, deleteUser, getAllWarehouse, createWarehouse, getWarehouseById, updateWarehouse, deleteWarehouse, getAvailableTrucks, getTruckById } = require('../../controllers/boss.controller');
const { validateImage, cleanImages } = require('../../utils/middlewares');


router.get('/users', getAllUsers)
router.get('/warehouse', getAllWarehouse)
router.get('/available-trucks', getAvailableTrucks)
router.get('/truck/:id', getTruckById)
router.get('/users/:id', getUsersById )
router.get('/warehouse/:id', getWarehouseById)

router.post('/register', upload.single('image'), validateImage, createUser, cleanImages)
router.post('/warehouse', upload.single('image'), validateImage, createWarehouse), cleanImages

router.put('/users/:id', upload.single('image'), updateUser, cleanImages)
router.put('/warehouse/:id', upload.single('image'), updateWarehouse, cleanImages)

router.delete('/users/:id', deleteUser)
router.delete('/warehouse/:id', deleteWarehouse)


module.exports = router;