const mongoose=require("mongoose")
const joi = require("joi")

const MedicineSchema = mongoose.Schema({
    name: {
        type : String,
        required: true,
        minlength: [2,"medicine  Name is less than 2 character "],
        maxlength: [20,"medicine Name is longer than 20 character "]  
    },
    quantity: {
        type : Number,
        required:true,
    },
    discription:{
        type : String || null,
        required: false,
        default : null
    },
    type: {
        type: String,
        required: true,
        enum: ['bottle', 'pills',"gel","box","other"], // Define your enum values here
      },
    price: {
        type : Number,
        required: true,
    },
    dosage : {
        type : Number,
        required: true,
    },
})

const Medicine = mongoose.model("Medicine",MedicineSchema)

function medicineValidation(obj){
    const schema = joi.object({
        name : joi.string().required().min(3).max(20),
        quantity : joi.number().required().min(1),
        discription : joi.string().required().min(2),
        type : joi.string().valid('bottle', 'pills',"gel","box","other").required(),
        price : joi.number().required(),
        dosage : joi.number().required(),
    })
    return schema.validate(obj);
}

function updateMedicineValidation(obj){
    const schema = joi.object({
        name : joi.string().min(3).max(20),
        quantity : joi.number().min(1),
        discription : joi.string().min(2),
        type : joi.string().valid('bottle', 'pills',"gel","box","other"),
        price : joi.number(),
        dosage : joi.number(),
    })
    return schema.validate(obj);
}




module.exports = {
    Medicine,
    medicineValidation,
    updateMedicineValidation
}