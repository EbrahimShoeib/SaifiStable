const { Inventory ,createInventoryItemValidation } = require("../model/inventory");
const ApiErrorCode = require("../../../../core/errors/apiError");
class InventoryController {
  static async getAllInventoryItem(req, res) {
    // Pagination parameters
    const pageSize = 10; // Number of documents per page

    // Calculate the number of documents to skip
    const skip = (req.query.page - 1) * pageSize;

    const regexQuery = new RegExp(req.query.query, "i"); // Case-insensitive regex query

    Inventory.find({
      $or: [
        { type: { $regex: regexQuery } },
        { menuItemName: { $regex: regexQuery } },
      ],
    })
    .select("-__v")
    .skip(skip) // Skip documents
    .sort( 
      { votes: 1, _id: -1 }).limit(pageSize) 
      .then(async (docs) => {
        if (docs) {
          const totalRecords = await Inventory.countDocuments();

          const maxPages = Math.ceil(totalRecords / pageSize);

          res.status(200).json({
            status_code: 1,
            message: "Success To Get All Inventory Item",
            inventoryItems: {
              current_page: parseInt(req.query.page) || 1,
              max_pages: maxPages,
              data: docs,
            },
            error: null,
          });
        } else {
          res.status(404).json({
            status_code: ApiErrorCode.notFound,
            message: "Can`t Found Menu Inventory Item",
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
  static async getInventoryItemById(req, res) {

    await Inventory.findById(req.params.id)
    .then((docs)=>{
      if(docs){
        res.status(200).json({
          status_code: 0,
          message: "Success to get Inventory Item By Id",
          data: docs,
        });

      }else{
        res.status(404).json({
          status_code: ApiErrorCode.notFound,
          message: "Can`t Found Inventory Item Name",
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
  static async createNewInventoryItem(req, res) {
    const { error } = createInventoryItemValidation(req.body);
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
        Inventory.find()
        .then((docs) => {
         
            new Inventory({
            itemName: req.body.itemName,
              quantity: req.body.quantity,
              itemDescription: req.body.itemDescription,
              type: req.body.type,
              price: req.body.price,
              measure: req.body.measure,
              date:req.body.date
            })

              .save()
              .then((docs) => {
                res.status(200).json({
                  status_code: 1,
                  message: "Inventory item created successfuly",
                  data: docs,
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status_code: ApiErrorCode.internalError,
                  message: "Inventory item Already Found",
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
  static async updateInventoryItem(req, res) {
    Inventory.find({ id: req.params.id })
      .then(async (docs) => {
        if (docs) {
          await Inventory.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                itemName: req.body.itemName,
                quantity: req.body.quantity,
                type: req.body.type,
                price: req.body.price,
                measure: req.body.measure,
                itemDescription: req.body.itemDescription,
                date:req.body.date
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
  static async deleteInventoryItem(req, res) {
    await Inventory.findByIdAndDelete(req.params.id)
    .then((docs)=>{
      if(docs){
        res.status(200).json({
          status_code: 0,
          message: "itemDescription item is deleted",
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

module.exports = {InventoryController};