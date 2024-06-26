const mongoose = require("mongoose");
const joi = require("joi");

const familyMembershipSchema = mongoose.Schema({
  famillyName: {
    type: String,
    required: true,
    minlength: [2,"family   Name is less than 2 character "],
    maxlength: [20,"family Name is longer than 20 character "]    },
  members: {
    type: String,
    require: true,
  },
  membershipType: {
    type: String,
    require: true,
    enum:["membership individual (1 month)","membership individual (2 months)","membership individual (3 months)","membership individual (4 months)","membership individual (5 months)","membership individual (6 months)","membership individual (7 months)","membership individual (8 months)","membership individual (9 months)","membership individual (10 months)","membership individual (11 months)","membership individual (12 months)"]
  },
  endDate: {
    type: String,
    require: true,
  },
  startDate: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    require: true,
  },
});

const familyMembership = mongoose.model(
  "familyMembership",
  familyMembershipSchema
);

function createNewfamilyMembership(obj) {
  const schema = joi.object({
    famillyName: joi.string().required(),
    members: joi.string().required(),
    membershipTtpe: joi.string().required().valid("membership individual (1 month)","membership individual (2 months)","membership individual (3 months)","membership individual (4 months)","membership individual (5 months)","membership individual (6 months)","membership individual (7 months)","membership individual (8 months)","membership individual (9 months)","membership individual (10 months)","membership individual (11 months)","membership individual (12 months)"),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    status: joi.string().required().valid("active", "inactive"),
  });
  return schema.validate(obj);
}

function updatefamilyMembership(obj) {
  const schema = joi.object({
    famillyName: joi.string().required(),
    members: joi.string().required(),
    membershipTtpe: joi.string().required().valid("membership individual (1 month)","membership individual (2 months)","membership individual (3 months)","membership individual (4 months)","membership individual (5 months)","membership individual (6 months)","membership individual (7 months)","membership individual (8 months)","membership individual (9 months)","membership individual (10 months)","membership individual (11 months)","membership individual (12 months)"),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    status: joi.string().required().valid("active", "inactive"),
  });
  return schema.validate(obj);
}

module.exports = {
  familyMembership,
  createNewfamilyMembership,
  updatefamilyMembership,
};
