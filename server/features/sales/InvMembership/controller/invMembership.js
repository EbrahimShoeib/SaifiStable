const {
  InvMembership,
  createNewInvMembership,updateInvMembership
} = require("../model/invMembership");
const {Client} = require('../../../client/models/client')

const ApiErrorCode = require("../../../../core/errors/apiError");

class invMembershipController {
  static async getAllinvMembership(req, res) {
    // Pagination parameters
    const pageSize = 10; // Number of documents per page

    // Calculate the number of documents to skip
    const skip = (req.query.page - 1) * pageSize;

    const regexQuery = new RegExp(req.query.query, "i"); // Case-insensitive regex query
    InvMembership.find({
      $or: [
        { type: { $regex: regexQuery } },
        { membershipType: { $regex: regexQuery } },
      ],
    })
    .select("-__v")
    .skip(skip) // Skip documents
    .sort( 
      { votes: 1, _id: -1 }).limit(pageSize) 
      .populate("clientId")
      .then(async (docs) => {
        if (docs) {
          const totalRecords = await InvMembership.countDocuments();

          const maxPages = Math.ceil(totalRecords / pageSize);

          res.status(200).json({
            status_code: 1,
            message: "Success To Get All  InvMembership",
            InvMembership: {
              current_page: parseInt(req.query.page) || 1,
              max_pages: maxPages,
              data: docs,
            },
            error: null,
          });
        } else {
          res.status(404).json({
            status_code: ApiErrorCode,
            message: "Can`t Found Menu InvMembership ",
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

  static async getinvMembershipById(req, res) {
    await InvMembership.findById(req.params.id)
      .populate("clientId")
      .then((docs) => {
        if (docs) {
          res.status(200).json({
            status_code: 0,
            message: "Success to get InvMembership By Id",
            data: docs,
          });
        } else {
          res.status(404).json({
            status_code: ApiErrorCode.notFound,
            message: "Can`t Found InvMembership  ",
            data: null,
          });
        }
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

  static async createNewinvMembership(req, res) {
    const { error } = createNewInvMembership(req.body);
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
      InvMembership.findOne({ clientId: req.body.clientId })
        .then((docs) => {
          
            new InvMembership({
              clientId: req.body.clientId,
              membershipType: req.body.membershipType,
              startDate: req.body.startDate,
              endDate: req.body.endDate,
              status: req.body.status,
            })

              .save()
              .then(async (docs) => {

                await Client.findByIdAndUpdate(
                  req.body.clientId,
                  { $inc: { activityCount: 1 } },
                )

                res.status(200).json({
                  status_code: 1,
                  message: "InvMembership  created successfuly",
                  data: docs,
                });
              })
              .catch((error) => {
                res.status(500).json({
                  status_code: ApiErrorCode.internalError,
                  message: "InvMembership  Already Found",
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

  static async updateinvMembership(req, res) {
   
   const {error}=updateInvMembership(req.body)
if(error){
  res.status(400).json({
    status_code: ApiErrorCode.validation,
    message: error.message,
    data: null,
    error: {
      message: error.message,
    },
  });
}else{
    InvMembership.find({ id: req.params.id })
    .then(async (docs) => {
      if (docs) {
        await InvMembership.findByIdAndUpdate(
          req.params.id,
          {
            $set: {
              // clientName: req.body.clientName,
              clientId: req.body.clientId,
              membershipType: req.body.membershipType,
              startDate: req.body.startDate,
              endDate: req.body.endDate,
              status: req.body.status,
            },
          },
          { new: true }
        )
          .then((docs) => {
            if (docs) {
              res.status(200).json({
                status_code: 0,
                message: "Updated Suvccess",
                data: docs,
              });
            } else {
              res.status(400).json({
                status_code: ApiErrorCode.validation,
                message: "Cand update InvMembership",
                data: null,
              });
            }
          })
          .catch((error) => {
            res.status(404).json({
              status_code: ApiErrorCode.validation,
              message: "InvMembership id is not found",
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

   
  }

  static async deleteinvMembership(req, res) {
    await InvMembership.findByIdAndDelete(req.params.id)
      .then((docs) => {
        if (docs) {
            res.status(200).json({
              status_code: 0,
              message: "Deleted  Successfully",
              data: [],
            });
          } else {
            res.status(400).json({
              status_code: ApiErrorCode.validation,
              message: "Can`d Find  InvMembership Id",
              data: null,
            });
          }
      })
      .catch((error) => {
        res.status(400).json({
            status_code: ApiErrorCode.validation,
            message: "internal server error , please try again",
            data: null,
            error:{
                error:error.message
            }
          });
      });
  }
}

module.exports = { invMembershipController };
