const { User, validationLoginUser } = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ApiErrorCode = require("../../../core/errors/apiError") 
const upload = require("../../../core/utils/upload");
const path = require('path')
const {
  verifyTokenAndAdmin,
} = require("../../../core/middleware/verify-token");

const express = require("express");
router = express.Router();

router.post("/login", async (req, res ,next) => {

  console.log("user is : "+req.body.email)

  const { error } = validationLoginUser(req.body);
  if (error) {
    res.status(400).json({
      status_code: ApiErrorCode.validation,
      message: error.message,
      error: {
        message: error.message,
      },
    });
  }else {
    User.findOne({ email: req.body.email })
    .then( async(user) => {

      if (user) {
        const { password, __v, ...other } = user._doc;
        const validPassword = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (validPassword) {
          const token = jwt.sign(
            {
              id: user._id,
              isAdmin: user.isAdmin,
            },
            process.env.JWT_SECRET_KEY
          );

          user.token.push(token);
          user
            .save()
            .then((result) => {
              res.status(200).json({
                status_code: 1,
                message: "Welcome back Mr." + user.fullName,
                data: {
                  user: {
                    ...other,
                    token: token,
                  },
                },
              });
            })
            .catch((error) => {
              res.status(500).json({
                status_code: ApiErrorCode.internalError,
                message: "The server is down, please try again later",
                error: {
                  message: error.message,
                },
              });
            });
        } else {
          res.status(400).json({
            status_code: ApiErrorCode.validation,
            message: "Please enter a valid email and password",
            data: null,
          });
        }
      } else {
        res.status(400).json({
          status_code: -1,
          message: "There are no accounts connected to this email",
          data: null,
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "The server is down, please try again later",
        error: {
          message: error.message,
        },
      });
    });
  }
});

router.patch("/update-admin", verifyTokenAndAdmin, async (req, res) => {
  
  User.findByIdAndUpdate(
    req.user.id,
    {
      $set: {
        fullName: req.body.fullName,
        email: req.body.email,
        mobile: req.body.mobile,
        address: req.body.address,
        password: req.body.password,
      },
    },
    { new: true }
  )
  .select("-__v -imageBuffer -imageType -token -password ")
  .then((docs) => {
      if (docs) {
        res.status(200).json({
          status_code: 1,
          message: "Updated Successfully",
          data: docs,
        });
      } else {
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "Didn't find the user",
          data: null,
          error: {
            message: error.message,
          },
        });
      }
    })
    .catch((error) => {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "Can`t update admin details",
        data: null,
        error: {
          message: error.message,
        },
      });
    });
});

router.get("/get-admin", verifyTokenAndAdmin, async (req, res) => {
  User.findById(req.user.id)
    .select("-__v -imageBuffer -imageType  -password ")

    .then((docs) => {
      if (docs) {
        res.status(200).json({
          status_code: 1,
          message: "Success Process",
          data: docs,
        })
      } else {
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "Can`t get admin details",
          data: null,
          error: "didn't find the admin in the database",
        });
      }
    })
    .catch((error) => {
     res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "internal server error",
        error: error.message,
      }); 
    });
});

router.get("/get-password", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  res.status(200).json({
    status_code: 1,
    message: "This is a hashed password",
    data: {
      password: req.body.password,
    },
  });
});

router.post("/add-user",(req,res)=>{
  try {
   let user = new User ({
      email: req.body.email,
      password:req.body.password
    })
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET_KEY)
      user.token.push(token);
          user.save() 
 
    res.status(200).json({
      status_code:0,
      message : "added success",
      data :{user
      }
    })
  } catch (error) {
    res.status(200).json({
      status_code:ApiErrorCode.validation,
      message : "added success",
      data :null,
      error:{
        error:error.message
      }
    })
  }
})

router.get("/get-user",verifyTokenAndAdmin,async(req,res)=>{
   User.findById(req.user.id)
  .then( (docs)=>{
    res.status(200).json({
      status_code: ApiErrorCode.internalError,
      message: "success to get user",
      data: docs,
    })
  }
   
  )
  .catch((error)=>{
    res.status(404).json({
      status_code: ApiErrorCode.internalError,
      message: "id is not found",
      error: error.message,
    });
  })
})
router.delete("/delete-user/:id",(req,res)=>{
  User.findByIdAndDelete(req.params.id)
  .then(
    res.json({ message:"user is deleted"})
  )
  .catch((error)=>{
    res.jsom({message : error.message}) })
})


router.post("/uploads",verifyTokenAndAdmin,upload.single('image'),async (req,res) => {

  console.log(req.file.buffer)

  try {
    const user = await User.findById(req.user.id )

    user.imageBuffer = req.file.buffer
    user.imageType = req.file.mimetype

    user.save()
    .then((docs)=> {
      if(docs){

        const {password,__v,token,...other} = docs._doc

        res.status(200).json({
          status_code: 1,
          message: "This is a hashed password",
          data: {
            ...other,
          },
        });
      }else {
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "User not found",
          data: null,
          error : {
            message : "didn't find the user you are looking for"
          }
        });
      }
    })
    .catch((error)=> {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: error.message,
        data: null,
        error : {
          message : error.message
        }
      });
    })
  } catch(error){
    res.status(500).json({
      status_code: ApiErrorCode.internalError,
      message: error.message,
      data: null,
      error : {
        message : error.message
      }
    });
  }
})

router.get("/uploads/:id",async (req,res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).send('Image not found.');
    }

    res.set('Content-Type', user.imageType);
    res.send(user.imageBuffer);

  } catch (error) {
    res.status(500).json({
      status_code: ApiErrorCode.internalError,
      message: error.message,
      data: null,
      error : {
        message : error.message
      }
    });
  }



})



module.exports = router;