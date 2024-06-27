const mongoose = require("mongoose");
const joi = require("joi");


const packageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["basic","novice","advance","junior team"],
    required: true,
  },
  lessons: {
    type: String,
    enum:["1","2","3","4","5","6","7","8","9","10"],
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum:["expired","active"],
    required: true,
  }
});

const Package = mongoose.model("Package", packageSchema);

function createNewPackage(obj) {
  const schema = joi.object({
    category:joi.string().required().min(1).max(20).valid("basic","novice","advance","junior team"),
    lessons:joi.string().required().min(1).max(20).valid("1","2","3","4","5","6","7","8","9","10"),
    startDate:joi.string().required().min(1).max(20),
    endDate:joi.string().required().min(1).max(20),
    status:joi.string().required().valid("expired","active").min(1).max(20),
    name:joi.string().required(),
  })
  return schema.validate(obj);
}

function updatePackage(obj) {
  const schema = joi.object({
    category:joi.string().required().min(1).max(20).valid("basic","novice","advance","junior team"),
    lessons:joi.string().required().min(1).max(20).valid("1","2","3","4","5","6","7","8","9","10"),
    startDate:joi.string().required().min(1).max(20),
    endDate:joi.string().required().min(1).max(20),
    status:joi.string().required().valid("expired","active").min(1).max(20),
    name:joi.string().required(),
  });
  return schema.validate(obj);
}

module.exports = {
    Package,
  createNewPackage,
  updatePackage,
};
