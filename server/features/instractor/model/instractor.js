const joi = require("joi")
const mongoose = require("mongoose")

const instractorSchema = mongoose.Schema({

    instractorName:{
        type:String,
        required:true,
          },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true,
        enum:["male","female"]
    },
    imageBuffer :{
        type: Buffer || null,
        required:false
    },
    imageType : {
        type: String || null,
        required:false
    },
})

const instractor = mongoose.model("instractor",instractorSchema)

function createInstractorValidation(obj){
    const schema = joi.object({
        instractorName : joi.string().required(),
        email : joi.string().required(),
        phoneNumber : joi.string().required().min(1).max(100),
        age: joi.number().required().min(1).max(100),
        gender : joi.string().valid('male', 'female').required(),
        avatar: joi.string(),
    })
    return schema.validate(obj);
}
function updateInstractorValidation(obj){
    const schema = joi.object({
        instractorName : joi.string(),
        email : joi.string(),
        phoneNumber : joi.string().min(1).max(200),
        age: joi.number().min(1).max(20),
        gender : joi.string().valid('male', 'female'),
        avatar: joi.string(),
    })
    return schema.validate(obj);
}

module.exports ={
    instractor,
    createInstractorValidation,
    updateInstractorValidation
}