const ApiErrorCode = require("../../../../core/errors/apiError");
const {Daily} = require("../../../management/daily/model/dailyModel")
const {
  Package,
  createNewPackage,
  updatePackage,
} = require("../model/package");
class packageController {
  static async getAllpackages(req, res) {
    // Pagination parameters
    const pageSize = 10; // Number of documents per page

    // Calculate the number of documents to skip
    const skip = (req.query.page - 1) * pageSize;

    const regexQuery = new RegExp(req.query.query, "i");

    Package.find({
      $or: [
        { category: { $regex: regexQuery } },
        { status: { $regex: regexQuery } },
      ],
    })
    .select("-__v")
    .skip(skip) // Skip documents
    .sort( 
      { votes: 1, _id: -1 }).limit(pageSize) 
      .then(async (docs) => {
        if (docs) {
          const totalRecords = await Package.countDocuments();

          const maxPages = Math.ceil(totalRecords / pageSize);

          res.status(200).json({
            status_code: 1,
            message: "Success To Get All Package ",

            Packages: {
              current_page: parseInt(req.query.page) || 1,
              max_pages: maxPages,
              data: docs,
            },
            error: null,
          });
        } else {
          res.status(404).json({
            status_code: ApiErrorCode.notFound,
            message: "Can`t Found Menu Packages ",
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
  static async getPackageById(req, res) {
    Package.findById(req.params.id)
      .then((docs) => {
        if (docs) {
          res.status(200).json({
            status_code: 1,
            message: "Success To Get All Package By Id ",
            Packages: {
              data: docs,
            },
            error: null,
          });
        } else {
          res.status(404).json({
            status_code: 1,
            message: "Cant do to  Package Id ",
            Packages: {
              data: null,
            },
          });
        }
      })
      .catch((error) => {
        res.status(200).json({
          status_code: 1,
          message: "internal Server Error ",
          Packages: {
            data: null,
          },
          error: {
            error: error.message,
          },
        });
      });
  }
  static async createNawPackage(req, res) {
    try {
      const { error } = createNewPackage(req.body);
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
       const docs= await new Package({
          category: req.body.category,
          lessons: req.body.lessons,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
          status: req.body.status,
          name: req.body.name,
        })
          .save()
          
            res.status(200).json({
              status_code: 1,
              message: "Package is created successfuly",
              data: docs,
            });
          
          
      }
    } catch (error) {
      res.status(500).json({
        status_code: ApiErrorCode.internalError,
        message: "internal server error , please try again",
        error: {
          error: error.message,
        },
      });
    }
  }
  static async updatePackage(req, res) {
    const { error } = updatePackage(req.body);
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
      Package.find({ id: req.params.id })
        .then(async (docs) => {
          if (docs) {
            await Package.findByIdAndUpdate(
              req.params.id,
              {
                $set: {
                  // clientName: req.body.clientName,
                  category: req.body.category,
                  lessons: req.body.lessons,
                  startDate: req.body.startDate,
                  endDate: req.body.endDate,
                  status: req.body.status,
                  name: req.body.name,

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
                    message: "Cand update package",
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
  }
  static async deletePackage(req, res) {
    Package.findByIdAndDelete(req.params.id)
      .then((docs) => {
        if (docs) {
          res.status(500).json({
            status_code: 1,
            message: "Package Deleted Successfully",
            data: [],
            error: null,
          });
        } else {
          res.status(500).json({
            status_code: ApiErrorCode.validation,
            message: "Package Id Is Not Found",
            data: null,
          });
        }
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
  static async getCoursesById (req,res) {

    await Daily.find({clientId:req.params.id})
    .then((docs)=>{
      console.log({clientId:req.params.id})
      if(docs){
        res.status(200).json({
          status_code:0,
          message:"success to get client Course",
          Courses :{data:docs},
        })
      }else{
        res.status(404).json({
          status_code:ApiErrorCode.notFound,
          message:"Client Id Is Not Found",
          data:null,
        })
      }
    })
    .catch((error)=>{
      res.status(500).json({
        status_code:ApiErrorCode.internalError,
        message:"Internal Server Error , Please try again",
        data:null,
        error:{
          error:error.message
        }
    })
    })
  }
}

module.exports = {
  packageController,
};

/**
 * clientName:req.body.clientName,
        category:req.body.category,
        lessons:req.body.lessons,
        startDate:req.body.startDate,
        endDate:req.body.endDate,
        status:req.body.endDate,
 */
