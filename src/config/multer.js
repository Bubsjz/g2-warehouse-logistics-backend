const multer = require('multer')
const path = require('path')

//Configuración de almacenamiento

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'))
    },
    filename: (req, file, cb) => {
        const entity = req.baseUrl.includes('/warehouse') ? 'warehouse' : 'user'
        const id = req.params.id || 'temp'
        const extension = path.extname(file.originalname)
        const uniqueName = `${entity}-${id}${extension}`
        cb(null, uniqueName)
    }
})

//Inicialización multer
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png']
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('File type not allowed'), false)
        }
        cb(null, true)
    }
})

module.exports = upload