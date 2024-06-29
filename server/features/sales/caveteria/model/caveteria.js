
const mongoose = require("mongoose")
const joi = require("joi")
const caveteriaSchema = mongoose.Schema({
    menuItemName:{
        type:String,
        required:false,
        minlength: [2,"menu item  Name is less than 2 character "],
        maxlength: [20,"c menu item is longer than 20 character "]  
    },
    quantity:{
        type:String,
        required:false
    },
    type:{
        type:String,
        enum:["beverage","treat","food","icecream"]  ,
        required:false
    },
    price:{
        type:Number,
        required:false
    },
    date:{
        type:Date,
        required:false
    },
    imageBuffer :{
        type: Buffer || null,
        required:false
    },
    imageType : {
        type: String || null,
        required:false
    },

},{ timestamps: true })

const Caveteria = mongoose.model("Caveteria",caveteriaSchema)

function createMenueItemValidation(obj){
    const schema =joi.object({
        menuItemName:joi.string().required(),
        quantity:joi.string().required(),
        type : joi.string().required().valid("beverage","treat","food","icecream"),
        price :joi.number().required() ,
        date : joi.date().required(),
    })
    return schema.validate(obj)
}
module.exports ={
    Caveteria,
    createMenueItemValidation
}