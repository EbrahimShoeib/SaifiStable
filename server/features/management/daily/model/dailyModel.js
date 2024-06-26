const mongoose = require("mongoose");
const joi = require("joi");
const dailySchema = new mongoose.Schema({
  courseDate: {
    type: String,
    required: true,
  },
  clientId: {
    type : mongoose.Types.ObjectId,
    ref: "Client",
    required: true,
  },
  course: {
    type : mongoose.Types.ObjectId,
    require: true,
    ref:"Package"
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true,
  },
  instractorId: {
    type : mongoose.Types.ObjectId,
    ref: "instractor",
    required: true,
  },
  paid: {
    type: String,
    require: true,

    enum: ["paid", "pending"],
  },
  note: {
    type: String,
    require: true,

  },
  courseTime: {
    type: String,
    require: true,
  },
  hourseId : {
    type : mongoose.Types.ObjectId,
    ref: "Hourse",
    required: true,
       },
  price: {
    type: Number,
    require: true,
  },
  arena: {
    type:String,
    require:true,
  },
  membership: {
    type:String,
    enum :["individual","family"] ,
    require:true


  },
});

const Daily =  mongoose.model("Daily", dailySchema);

function createNewDaily(obj) {
  const schema = joi.object({

    courseDate:joi.string().required().min(2).max(20),
    clientId:joi.string().required().min(2).max(50),
    course:joi.string().required(),
    status:joi.string().required().valid("active", "inactive"),
    instractorId:joi.string().required().min(2).max(50),
    paid:joi.string().required().valid("pending","paid"),
    note:joi.string().required().min(2).max(20),
    courseTime:joi.string().required().min(2).max(20),
    hourseId:joi.string().required().min(2).max(50),
    price:joi.number().required().min(1),
    arena:joi.string().required().min(2).max(20),
    membership:joi.string().required().valid("individual","family"),
  });
  return schema.validate(obj);
}

function updateDaily(obj) {
  const schema = joi.object({
    courseDate:joi.string().required().min(2).max(20),
    clientId:joi.string().required().min(2).max(50),
    course:joi.string().required(),
    status:joi.string().required().valid("active", "inactive"),
    instractorId:joi.string().required().min(2).max(50),
    paid:joi.string().required().valid("pending","paid"),
    note:joi.string().required().min(2).max(20),
    courseTime:joi.string().required().min(2).max(20),
    hourseId:joi.string().required().min(2).max(50),
    price:joi.number().required().min(1),
    arena:joi.string().required().min(2).max(20),
    membership:joi.string().required().valid("individual","family"),

  });
  return schema.validate(obj);
}

module.exports = {
  Daily,
  createNewDaily,
  updateDaily
};
