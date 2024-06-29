const { Caveteria, createMenueItemValidation } = require("../model/caveteria");
const ApiErrorCode = require("../../../../core/errors/apiError");
class caveteriaController {
  static async getAllMenueItem(req, res) {
    // Pagination parameters
    const pageSize = 10; // Number of documents per page

    // Calculate the number of documents to skip
    const skip = (req.query.page - 1) * pageSize;

    const regexQuery = new RegExp(req.query.query, "i"); // Case-insensitive regex query

    Caveteria.find({
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
          const totalRecords = await Caveteria.countDocuments();

          const maxPages = Math.ceil(totalRecords / pageSize);

          res.status(200).json({
            status_code: 1,
            message: "Success To Get All Menu Iten",
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
            message: "Can1t Found Menu Item Name",
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
  static async getMenuItemById(req, res) {
    await Caveteria.findById(req.params.id)
      .then((docs) => {
        if (docs) {
          res.status(200).json({
            status_code: 0,
            message: "Success to get MenuItem By Id",
            data: docs,
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
          message: "internal server error",
          error: {
            error: message.error,
          },
        });
      });
  }
  static async createNewMenueItem(req, res) {
    const { error } = createMenueItemValidation(req.body);
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
        Caveteria.find()
        .then((docs) => {
         
            new Caveteria({
              menuItemName: req.body.menuItemName,
              quantity: req.body.quantity,
              type: req.body.type,
              price: req.body.price,
              date: req.body.date,
            })
              .save()
              .then((docs) => {
                res.status(200).json({
                  status_code: 1,
                  message: "menue item created successfuly",
                  data: docs,
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status_code: ApiErrorCode.internalError,
                  message: "menue item Already Found",
                  error: {
                    error: error.message,
                  },
                });
              });
          
        })
        .catch((error) => {
          res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message: "internal server error",
            error: {
              error: error.message,
            },
          });
        });
    }
  }
  static async updateMenuItem(req, res) {
    Caveteria.find({ id: req.params.id })
      .then(async (docs) => {
        if (docs) {
          await Caveteria.findByIdAndUpdate(
            req.params.id,
            {
              $set: {
                menuItemName: req.body.menuItemName,
                quantity: req.body.quantity,
                type: req.body.type,
                price: req.body.price,
                date: req.body.date,
              },
            },
            { new: true }
          )
            .then((docs) => {
              if (docs) {
                res.status(200).json({
                  status_code: 0,
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
                  error: error.message,
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
            error: error.message,
          },
        });
      });
  }
  static async deleteMenuItem(req, res) {
    await Caveteria.findByIdAndDelete(req.params.id)
      .then((docs) => {
        if (docs) {
          res.status(200).json({
            status_code: 0,
            message: "Menu item is deleted",
            data: [],
          });
        } else {
          res.status(404).json({
            status_code: ApiErrorCode.notFound,
            message: "Can`t Found Menu Item Id",
            data: null,
          });
        }
      })
      .catch((error) => {
        res.status(500).json({
          status_code: ApiErrorCode.internalError,
          message: "Internal server Error",
          error: {
            error: error.message,
          },
        });
      });
  }
}
module.exports = caveteriaController;