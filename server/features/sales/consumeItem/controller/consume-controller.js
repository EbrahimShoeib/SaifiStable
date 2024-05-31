const { Consume, creatconsumValidation } = require("../model/consumeModel");
const ApiErrorCode = require("../../../../core/errors/apiError");
const {Client} = require('../../../client/models/client')


class consumeController {
  static async getAllConsume(req, res) {
    // Pagination parameters
    const pageSize = 10; // Number of documents per page

    // Calculate the number of documents to skip
    const skip = (req.query.page - 1) * pageSize;

    const regexQuery = new RegExp(req.query.query, "i"); // Case-insensitive regex query

    Consume.find({
      $or: [
        { type: { $regex: regexQuery } },
        { consumedItemName: { $regex: regexQuery } },
      ],
    }).populate("clientId")
    .select("-__v")
    .skip(skip) // Skip documents
    .sort( 
      { votes: 1, _id: -1 }).limit(pageSize) 
      .then(async (docs) => {
        if (docs) {
          const totalRecords = await Consume.countDocuments();

          const maxPages = Math.ceil(totalRecords / pageSize);

          res.status(200).json({
            status_code: 1,
            message: "Success To Get All Menu Item",
            caveteriaItems: {
              current_page: parseInt(req.query.page) || 1,
              max_pages: maxPages,
              data: docs,
            },
            error: null,
          });
        } else {
          res.status(404).json({
            status_code: ApiErrorCode.notFound,
            message: "Can`t Found Menu Item Name",
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
  static async getConsumeById(req, res) {

    await Consume.findById(req.params.id)
    .populate("clientId")
    .then((docs)=>{
      if(docs){
       
        res.status(200).json({
          status_code: 0,
          message: "Success to get consumed By Id",
          data: docs,
        });

      }else{
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "Can`t Found consumed Item Id",
          data: null,
        });
      }
    })
    .catch((error)=>{
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "internal server error",
        error: {
          error:error.message
        },
      });

    })
  }
  static async createNewConsume(req, res) {
    const { error } = creatconsumValidation(req.body);
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
        Consume.find()
        .then((docs) => {
          
            new Consume({
                consumedItemName: req.body.consumedItemName,
                clientId: req.body.clientId,
                consumedQuantity: req.body.consumedQuantity,
                consumedPrice: req.body.consumedPrice,
                consumedPayment: req.body.consumedPayment,
                type:req.body.type,


                date: req.body.date
            })
              .save()
              .then(async (docs) => {
                
                await Client.findByIdAndUpdate(
                  req.body.clientId,
                  { $inc: { activityCount: 1 } },
                )
    
                res.status(200).json({
                  status_code: 1,
                  message: "consumed item created successfuly",
                  data: docs,
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status_code: ApiErrorCode.internalError,
                  message: "consumed item Already Found",
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
  static async updateConsume(req, res) {
    Consume.find({ id: req.params.id })
      .then(async (docs) => {
        if (docs) {
          await Consume.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                consumedItemName: req.body.consumedItemName,
                clientId: req.body.clientId,
                consumedQuantity: req.body.consumedQuantity,
                consumedPrice: req.body.consumedPrice,
                consumedPayment: req.body.consumedPayment,

   date: req.body.date
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
          status_code: ApiErrorCode.internalError,
          message: "internal server Down",
          error: {
            error:error.message
          },
        });
      });
  }
  static async deleteConsume(req, res) {
    await Consume.findByIdAndDelete(req.params.id)
    .then((docs)=>{
      if(docs){
        res.status(200).json({
          status_code: 0,
          message: "Menu item is deleted",
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
module.exports ={ consumeController};
