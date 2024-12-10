const jwt = require('jsonwebtoken')
const fs = require('fs')
const path = require('path')

const createToken = (user) => {
    const data = {
        user_id: user.id_user,
        user_name: user.name,
        user_surname: user.surname,
        user_role: user.role,
        user_plate: user.plate,
        user_image: user.image
    }

    const token =  jwt.sign(data, process.env.PRIVATEKEY, { expiresIn: "1h" })
    return token
}

function getImageUrl(imageFilename) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000'
    if (!imageFilename){
        return null
    }
    return `${baseUrl}/uploads/${imageFilename}`
}

const handleImageFile = {
    getNewImageName: (entity, id, file) => {
        if (!file){
            throw new Error("File is required to generate a new image name.")
        }
        const extension = path.extname(file.originalname)
        return `${entity}-${id}${extension}`
    },
    renameImage: (oldPath, newPath) => {
        try {
            fs.renameSync(oldPath, newPath)
        } catch (error) {
            console.error(`Error renaming image from ${oldPath} to ${newPath}`, error.message)
        }
        
    },
    deleteImage: (imageName) => {
        if(!imageName) {
            console.warn("No image name provided for deletion.")
            return
        }
        const imagePath = path.join(__dirname, "../../uploads", imageName)
        try {
            if(fs.existsSync(imagePath)){
                fs.unlinkSync(imagePath)
            } else {
                console.warn(`Image not found at path: ${imagePath}`)
            }
        } catch (error) {
            console.error(`Error deleting image at ${imagePath}:`, error.message)
        }
    }
}

module.exports = {
    createToken, getImageUrl, handleImageFile
}
