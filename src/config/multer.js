const multer = require('multer')
const path = require('path')

//Configuración de almacenamiento

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'))
    },
    filename: (req, file, cb) => {
        const warehouseId = req.params.id
        const extension = path.extname(file.originalname)
        const uniqueName = `warehouse-${warehouseId}${extension}`
        cb(null, uniqueName)
    }
})

//Inicialización multer
const upload = multer({
    storage, limits: { fileSize: 5 * 1024 * 1024 }
})

module.exports = upload