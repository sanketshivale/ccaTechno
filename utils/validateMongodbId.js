const mongoose = require('mongoose')

exports.validateMongodbId = (id)=>{
    const isValid = mongoose.Types.ObjectId.isValid(id)
    if(!isValid) {
        return false
    }else{
        return id
    }
}