const { invConsume ,createInvConsumeValidation } = require("../model/invConsum");
const ApiErrorCode = require("../../../../core/errors/apiError");
class InvConsumeController {
  static async getAllinvConsumeItem(req, res) {
    // Pagination parameters
    const pageSize = 10; // Number of documents per page

    // Calculate the number of documents to skip
    const skip = (req.query.page - 1) * pageSize;

    const regexQuery = new RegExp(req.query.query, "i"); // Case-insensitive regex query

    invConsume.find({
      $or: [
        { type: { $regex: regexQuery } },
        { invConsumedItemName: { $regex: regexQuery } },
      ],
    })
    .populate("hourseId")
    .select("-__v")
    .skip(skip) // Skip documents
    .sort( 
      { votes: 1, _id: -1 }).limit(pageSize) 
      .then(async (docs) => {
        if (docs) {
          const totalRecords = await invConsume.countDocuments();

          const maxPages = Math.ceil(totalRecords / pageSize);

          res.status(200).json({
            status_code: 1,
            message: "Success To Get All invConsume Item",
            invConsumeItems: {
              current_page: parseInt(req.query.page) || 1,
              max_pages: maxPages,
              data: docs,
            },
            error: null,
          });
        } else {
          res.status(404).json({
            status_code: ApiErrorCode.notFound,
            message: "Can`t Found Menu invConsume Item",
            data: null,
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status_code: ApiErrorCode.internalError,
          message: "There was a server internal error, please try again",
          data: null,
          error: {
            message: error.message,
          },
        });
      });
  }
  static async getinvConsumetemById(req, res) {

    await invConsume.findById(req.params.id)
    .populate("hourseId")
    .then((docs)=>{
      if(docs){
        res.status(200).json({
          status_code: 0,
          message: "Success to get invConsume Item By Id",
          data: docs,
        });

      }else{
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "Can`t Found invConsume Item Name",
          data: null,
        });
      }
    })
    .catch((error)=>{
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "internal server error",
        error: {
          error:message.error
        },
      });

    })
  }
  static async createNewinvConsumeItem(req, res) {
    const { error } = createInvConsumeValidation(req.body);
    if (error) {
      res.status(400).json({
        status_code: ApiErrorCode.validation,
        message: error.message,
        data: null,
        error: {
          message: error.message,
        },
      });
    } else {
        invConsume.find()
        .then((docs) => {
         
            new invConsume({
                invConsumedItemName: req.body.invConsumedItemName,
                invConsumedQuantity: req.body.invConsumedQuantity,
                invConsumedPrice: req.body.invConsumedPrice,
                invConsumedMeasure: req.body.invConsumedMeasure,
                date: req.body.date,
                hourseId: req.body.hourseId,
              })
              .save()
              .then((docs) => {
                res.status(200).json({
                  status_code: 1,
                  message: "invConsume item created successfuly",
                  data: docs,
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status_code: ApiErrorCode.internalError,
                  message: "invConsume item Already Found",
                  error: {
                    error: error.message,
                  },
                });
              });
          
        })
        .catch((error) => {
          res.status(500).json({
            status_code: 1,
            message: "internal server error",
            error: {
              error: error.message,
            },
          });
        });
    }
  }
  static async updateinvConsumeItem(req, res) {
    invConsume.find({ id: req.params.id })
      .then(async (docs) => {
        if (docs) {
          await invConsume.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                invConsumedItemName: req.body.invConsumedItemName,
                invConsumedQuantity: req.body.invConsumedQuantity,
                invConsumedPrice: req.body.invConsumedPrice,
                invConsumedMeasure: req.body.invConsumedMeasure,
                date: req.body.date,
                hourseId: req.body.hourseId,
              },
            },
            { new: true }
          )
            .then((docs) => {
              if (docs) {
                res.status(200).json({
                  status_code:0,
                  message: "success",
                  data: docs,
                });
              } else {
                res.status(400).json({
                  status_code: ApiErrorCode.validation,
                  message: "Cand update ",
                  data: null,
                });
              }
            })
            .catch((error) => {
              res.status(404).json({
                status_code: ApiErrorCode.validation,
                message: "id is not found",
                error: {
                  error:error.message
                },
              });
            });
        }
      })
      .catch((error) => {
        res.status(400).json({
          status_code: ApiErrorCode.validation,
          message: "internal server Down",
          error: {
            error:error.message
          },
        });
      });
  }
  static async deleteinvConsumeItem(req, res) {
    await invConsume.findByIdAndDelete(req.params.id)
    .then((docs)=>{
      if(docs){
        res.status(200).json({
          status_code: 0,
          message: "invConsume item is deleted",
          data: [],
        });
      }else{
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "Can`t Found Menu Item Id",
          data: null,
        });
      }

    })
    .catch((error)=>{
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "Internal server Error",
        error:{
          error:error.message
        }
      });
    })
  }
}
module.exports = {
    InvConsumeController
};
