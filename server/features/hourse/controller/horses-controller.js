const { Error } = require("mongoose");
const {
  Hourse,
  createHourseValidation,
  updateHourseValidation,
} = require("../models/hourse");
const ApiErrorCode = require("../../../core/errors/apiError");
const path = require("path");

class HourseController {
  static async createNewHourse(req, res) {
    let hourse = await Hourse.findOne({ hourseName: req.body.hourseName });

    if (!hourse) {
      const { error } = createHourseValidation(req.body);

      if (error) {
        res.status(400).json({
          status_code: ApiErrorCode.validation,
          message: error.message,
          error: {
            message: error.message,
          },
        });
      } else {
        const hourse = new Hourse({
          id: req.body.id,
          hourseName: req.body.hourseName,
          age: req.body.age,
          catigoryId: req.body.catigoryId,
          clientId: req.body.clientId,
          groom: req.body.groom,
          gender: req.body.gender,
          note: req.body.note,
          documents: req.body.documents,
        })
          .save()
          .then((docs) => {
            const { __v, ...other } = docs._doc;

            res.status(200).json({
              status_code: 1,
              message: "The Hourse is created successfuly",
              data: {
                ...other,
              },
            });
          })
          .catch((error) => {
            res.status(500).json({
              status_code: ApiErrorCode.internalError,
              message:
                "There was an error when creating the Hourse, please try again",
              data: null,
              error: {
                message: error.message,
              },
            });
          });
      }
    } else {
      let error = new Error();
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "There hourse is already found",
        data: null,
        error: {
          message: error.message,
        },
      });
    }
  }

  static async getAllHourses(req, res) {
    try {
      // Pagination parameters
      const pageSize = 10; // Number of documents per page

      // Calculate the number of documents to skip
      const skip = (req.query.page - 1) * pageSize;

      const regexQuery = new RegExp(req.query.query, "i"); // Case-insensitive regex query

      Hourse.find({
        $or: [
          { hourseName: { $regex: regexQuery } },
          { gender: { $regex: regexQuery } },
          { note: { $regex: regexQuery } },
          { age: parseInt(req.query.query) || 0 },
        ],
      })
      .select("-__v")
          .skip(skip) // Skip documents
          .sort( 
            { votes: 1, _id: -1 }).limit(pageSize)    
              .then(async (docs) => {
          const totalRecords = await Hourse.countDocuments();

          const maxPages = Math.ceil(totalRecords / pageSize);

          res.status(200).json({
            status_code: 1,
            message: "Got the hourse successfuly",
            data: {
              current_page: parseInt(req.query.page) || 1,
              max_pages: maxPages,
              hourse: docs,
            },
          });
        })
        .catch((error) => {
          res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message:
              "There was an error when getting the hourse, please try again",
            data: null,
            error: {
              message: error.message,
            },
          });
        });
    } catch (error) {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "There was a server internal error, please try again",
        data: null,
        error: {
          message: error.message,
        },
      });
    }
  }

  static async getHourseById(req, res) {
    try {
      Hourse.findById(req.params.id)
        .then((docs) => {
          if (docs) {
            const { __v, ...other } = docs._doc;

            res.status(200).json({
              status_code: 1,
              message: "Got the Hourse successfuly",
              data: {
                ...other,
              },
            });
          } else {
            res.status(404).json({
              status_code: ApiErrorCode.notFound,
              message: "Didnt found the Hourse in our records",
              data: null,
              error: {
                message: "Didnt found the Hourse in our records",
              },
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message:
              "There was an error when getting the Hourse, please try again",
            data: null,
            error: {
              message: error.message,
            },
          });
        });
    } catch (error) {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "There was a server internal error, please try again",
        data: null,
        error: {
          message: error.message,
        },
      });
    }
  }

  static async updateHourse(req, res) {
    const { error } = updateHourseValidation(req.body);

    if (error) {
      res.status(500).json({
        status_code: ApiErrorCode.validation,
        message: error.message,
        error: {
          error: error.message,
        },
      });
    } else {
      let hourse = await Hourse.findById(req.params.id);

      if (hourse) {
        try {
          const newHourse = await Hourse.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                id: req.body.id,
                hourseName: req.body.hourseName,
                age: req.body.age,
                catigoryId: req.body.catigoryId,
                clientId: req.body.clientId,
                groom: req.body.groom,
                gender: req.body.gender,
                note: req.body.note,
                documents: req.body.documents,
              },
            },
            { new: true }
          );

          return res.status(200).json({
            status_code: 1,
            message: "Success process",
            data: newHourse,
            error: {
              message: null,
            },
          });
        } catch (error) {
          res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message: "Validation Error",
            data: null,
            error: {
              message: error.message,
            },
          });
        }
      } else {
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "didn't found the hourse you want to update",
          data: null,
          error: {
            message: "didn't found the hourse you want to update",
          },
        });
      }
    }
  }

  static async deleteHourse(req, res) {
    let hourse = await Hourse.findById(req.params.id);

    try {
      if (hourse) {
        await Hourse.findByIdAndDelete(req.params.id);

        res.status(200).json({
          status_code: 1,
          message: "Horse is deleted",
          data: [],
          error: null,
        });
      } else {
        const error = new Error();
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "Horse Id Not Found ",
          data: null,
          error: {
            message: error.message,
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "There was a server internal error, please try again ",
        data: null,
        error: {
          message: error.message,
        },
      });
    }
  }

  static async uploadHourseImage(req, res) {
    try {
      const hourse = await Hourse.findById(req.params.id )

      hourse.imageBuffer = req.file.buffer
      hourse.imageType = req.file.mimetype

      hourse.save()
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
        .catch((error) => {
          res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message: error.message,
            data: null,
            error: {
              message: error.message,
            },
          });
        });
    } catch (error) {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: error.message,
        data: null,
        error: {
          message: error.message,
        },
      });
    }
  }

  static async getHourseImage(req,res){
    try {

      const hourse = await Hourse.findById(req.params.id);
  
      if (!hourse) {
        return res.status(404).send('Image not found.');
      }
  
      res.set('Content-Type', hourse.imageType);
      res.send(hourse.imageBuffer);
  
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
  }


}

module.exports = HourseController;
