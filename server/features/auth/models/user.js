const mongoose=require("mongoose")
const joi = require("joi")
const jwt = require("jsonwebtoken")

const userSchema =new mongoose.Schema({
    fullName:{
    type:String,
    required:false
   },
   email:{
    type:String,
    required:true
   },
   password:{
    type:String,
    required:true,
    minlength: [6,"Password is less than 6 character "]
   },
   isAdmin:{
    type:Boolean,
    default:true
   },
   token :  {
    type: [String],
     default: []
    },
      mobile:{
        type:String,
      required:false
    },
    address:{
        type:String,
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

})


userSchema.methods.generateToken = function(){
    return jwt.sign({id : this._id , isAdmin: this.isAdmin,randomNumber : Math.random()},process.env.JWT_SECRET_KEY ,{expiresIn:"100d"})
 }

function validationLoginUser(obj){
    const schema= joi.object({
       email:joi.string().trim().min(6).max(100).required(),
       password:joi.string().min(6).max(100).required(),
    })
    return schema.validate(obj);
}

userSchema.methods.generateToken = function(){
    return jwt.sign({
        id : this._id ,
        isAdmin: this.isAdmin,
        randomNumber : Math.random()},
        process.env.JWT_SECRET_KEY 
    )
}

const User = mongoose.model("user",userSchema)


module.exports = {
    User,
    validationLoginUser
}
