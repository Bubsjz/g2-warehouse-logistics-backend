// en esta carpeta iran todos los middlewares que creemos

function validateImage(req, res, next) {
    if (!req.file){
        return res.status(400).json({ error: 'No image was provided'})
    }
    const allowedTypes = ['image/jpeg', 'image/png']
    
    if (!allowedTypes.includes(req.file.mimetype)){
        return res.status(400).json({ error: 'File type not allowed'})
    }
    next()
}

module.exports = { validateImage }