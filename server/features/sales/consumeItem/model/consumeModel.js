const mongoose = require("mongoose");
const joi = require("joi");
const { Schema } = mongoose;

const consumeSchema = new Schema(
  {
    consumedItemName: {
      type: String,
      required: true,
      minlength: [2, "consumed item  Name is less than 2 character "],
      maxlength: [20, "consumed item Name is longer than 20 character "],
    },
    
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    consumedQuantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number || null,
      required: false || null ,
    },
    consumedPrice: {
      type: Number,
      required: true,
    },
    consumedPayment: {
      type: String,
      required: true,
      enum: ["pending", "paid"],
    },
    type: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Consume = mongoose.model("Consume", consumeSchema);
function creatconsumValidation(obj) {
  const schema = joi.object({
    consumedItemName: joi.string().required(),
    clientId: joi.string().required(),
    consumedQuantity: joi.number().required(),
    amount: joi.number().required(),
    consumedPrice: joi.string().required(),
    consumedPayment: joi.string().required().valid("pending", "paid"),
    type: joi.string().required(),
    date: joi.string().required(),
  });
  return schema.validate(obj);
}
module.exports = {
  Consume,
  creatconsumValidation,
};
