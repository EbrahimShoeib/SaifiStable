const mongoose= require ('mongoose');
const joi = require("joi")
const { Schema } = mongoose;

const inventorySchema = new Schema({
  itemName: {
    type: String,
    required: [true, "Please provide unique item Name"],
    unique: [true, "item Name Exist"],
    minlength: [2,"item  Name is less than 2 character "],
    maxlength: [20,"item Name is longer than 20 character "]    },
  quantity: {
    type: Number,
    required: true,
  },
  itemDescription: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  measure: {
    type: String,
    enum:["liter (L)","milliliter (mL)","kilogram (kg)","gram (g)","meter (m)","centimeter (cm)","millimeter (mm)","kilometer (km)","square meter (m²)","cubic meter (m³)"],
    required: true
  },
  date:{
    type:String,
    required:true
  }
});

const Inventory = mongoose.model('Inventory', inventorySchema);


function createInventoryItemValidation(obj){
    const schema =joi.object({
      itemName:joi.string().required(),
        quantity:joi.string().required(),
        type : joi.string().required(),
        price :joi.number().required() ,
        itemDescription : joi.string().required(),
        measure : joi.string().required().valid("liter (L)","milliliter (mL)","kilogram (kg)","gram (g)","meter (m)","centimeter (cm)","millimeter (mm)","kilometer (km)","square meter (m²)","cubic meter (m³)"),
        date:joi.string().required()
    })
    return schema.validate(obj);
  }

module.exports ={
    Inventory
,
createInventoryItemValidation
}