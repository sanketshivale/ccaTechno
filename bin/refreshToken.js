const jwt = require('jsonwebtoken')

exports.generateRefreshToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECERT, {expiresIn: '3d'})
}