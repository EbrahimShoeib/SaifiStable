const {
  Client,
  clientValidation,
  pageValidation,
  updateValidation,
  updateMembershipValidation,
} = require("../models/client");
const path = require("path");
const multer = require("multer");
//import token
const ApiErrorCode = require("../../../core/errors/apiError");

// Set up Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Generate a unique filename
  },
});

// Initialize Multer with the storage configuration
const upload = multer({ storage });

class ClientController {
  static async createNewClient(req, res) {
    try {
      const { error } = clientValidation(req.body);

      if (error) {
        res.status(400).json({
          status_code: ApiErrorCode.validation,
          message: " Validation error",
          data: null,
          error: {
            message: error.message,
          },
        });
      } else {
        new Client({
          username: req.body.username,
          email: req.body.email,
          phone: req.body.phone,
          hourseId:req.body.hourseId,
          gender: req.body.gender,
          age: req.body.age,
          membershipStatus: req.body.membershipStatus,
          membershipType: req.body.membershipType,
        })
          .save()
          .then((docs) => {
            const { __v, ...other } = docs._doc;

            res.status(200).json({
              status_code: 1,
              message: "The client is created successfuly",
              data: {
                ...other,
              },
            });
          })
          .catch((error) => {
            res.status(500).json({
              status_code: ApiErrorCode.internalError,
              message:
                "There was an error when creating the client, please try again",
              data: null,
              error: {
                message: error.message,
              },
            });
          });
      }
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

  static async getClientById(req, res) {
    try {
      Client.findById(req.params.id)
      // .populate("hourseId")
        .then((docs) => {
          if (docs) {
            const { __v, ...other } = docs._doc;

            res.status(200).json({
              status_code: 1,
              message: "Got the client successfuly",
              data: {
                ...other,
              },
            });
          } else {
            res.status(404).json({
              status_code: ApiErrorCode.notFound,
              message: "Didnt found the client in our records",
              data: null,
              error: {
                message: "Didnt found the client in our records",
              },
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message:
              "There was an error when getting the client, please try again",
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

  static async getAllClients(req, res) {
    try {
      {
        // Pagination parameters
        const pageSize = 10; // Number of documents per page

        // Calculate the number of documents to skip
        const skip = (req.query.page - 1) * pageSize;

        const regexQuery = new RegExp(req.query.query, "i"); // Case-insensitive regex query

        Client.find({
          $or: [
            { username: { $regex: regexQuery } },
            { email: { $regex: regexQuery } },
            { phone: { $regex: regexQuery } },
          ],
        })
          .select("-__v")
          .skip(skip) // Skip documents
          .sort({ votes: 1, _id: -1 })
          .limit(pageSize)
          .populate("hourseId")
          .then(async (docs) => {
            const totalRecords = await Client.countDocuments();
            const maxPages = Math.ceil(totalRecords / pageSize);
            res.status(200).json({
              status_code: 1,
              message: "Got the clients successfuly",
              data: {
                current_page: parseInt(req.query.page) || 1,
                max_pages: maxPages,
                client: docs,
              },
            });
          })
          .catch((error) => {
            res.status(500).json({
              status_code: ApiErrorCode.internalError,
              message:
                "There was an error when getting the client, please try again",
              data: null,
              error: {
                message: error.message,
              },
            });
          });
      }
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

  static async updateClientById(req, res) {
    try {
      const { error } = updateValidation(req.body);

      if (error) {
        res.status(400).json({
          status_code: ApiErrorCode.validation,
          message: error.message,
          error: {
            message: error.message,
          },
        });
      } else {
        const updateOps = {}; // Object to hold the fields you want to update

        // Example fields to update
        if (req.body.username) {
          updateOps.username = req.body.username;
        }
        if (req.body.email) {
          updateOps.email = req.body.email;
        }
        if (req.body.age) {
          updateOps.age = req.body.age;
        }
        if (req.body.phone) {
          updateOps.phone = req.body.phone;
        }
        if (req.body.hourseId) {
          updateOps.hourseId = req.body.hourseId;
        }
        if (req.body.membershipStatus) {
          updateOps.membershipStatus = req.body.membershipStatus;
        }
        if (req.body.membershipType) {
          updateOps.membershipType = req.body.membershipType;
        }
        if (req.body.gender) {
          updateOps.gender = req.body.gender;
        }

        Client.findOneAndUpdate(
          { _id: req.params.id },
          { $set: updateOps },
          { new: true }
        )
          .select("-__v")
          .then((docs) => {
            if (docs) {
              res.status(200).json({
                status_code: 1,
                message: "The clients updated successfuly",
                data: docs,
              });
            } else {
              res.status(404).json({
                status_code: ApiErrorCode.notFound,
                message: "Didn't find the client",
                data: null,
                error: {
                  message: "Didn't find the client",
                },
              });
            }
          })
          .catch((error) => {
            res.status(500).json({
              status_code: ApiErrorCode.internalError,
              message:
                "There was an error when getting the client, please try again",
              data: null,
              error: {
                message: error.message,
              },
            });
          });
      }
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

  static async deleteClientById(req, res) {
    try {
      Client.findByIdAndDelete(req.params.id)
        .select("-__v")
        .then((docs) => {
          if (docs) {
            res.status(200).json({
              status_code: 1,
              message: "The clients deleted successfuly",
              data: docs,
            });
          } else {
            res.status(404).json({
              status_code: ApiErrorCode.notFound,
              message: "Didn't find the client",
              data: null,
              error: {
                message: "Didn't find the client",
              },
            });
          }
        })
        .catch((error) => {
          res.status(500).json({
            status_code: ApiErrorCode.internalError,
            message:
              "There was an error when getting the client, please try again",
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

  static async updateClientMembershipStatus(req, res) {
    try {
      const { error } = updateMembershipValidation(req.body);

      if (error) {
        res.status(400).json({
          status_code: ApiErrorCode.validation,
          message: " Validation error",
          error: {
            message: error.message,
          },
        });
      } else {
        Client.findOneAndUpdate(
          { _id: req.params.id },
          {
            $set: {
              membershipStatus: req.body.membership_status,
            },
          },
          { new: true }
        )
          .select("-__v")
          .then((docs) => {
            if (docs) {
              res.status(200).json({
                status_code: 1,
                message: "The clients updated successfuly",
                data: docs,
              });
            } else {
              res.status(404).json({
                status_code: ApiErrorCode.notFound,
                message: "Didn't find the client",
                data: null,
                error: {
                  message: "Didn't find the client",
                },
              });
            }
          })
          .catch((error) => {
            res.status(500).json({
              status_code: ApiErrorCode.internalError,
              message:
                "There was an error when getting the client, please try again",
              data: null,
              error: {
                message: error.message,
              },
            });
          });
      }
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

  static async uploadClientImage(req, res) {
    try {
      const client = await Client.findById(req.params.id);

      client.imageBuffer = req.file.buffer;
      client.imageType = req.file.mimetype;

      client
        .save()
        .then((docs) => {
          if (docs) {
            res.status(200).json({
              status_code: 1,
              message: "This is a hashed password",
              data: {
                docs,
              },
            });
          } else {
            res.status(404).json({
              status_code: ApiErrorCode.notFound,
              message: "User not found",
              data: null,
              error: {
                message: "didn't find the user you are looking for",
              },
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

  static async getClientImage(req, res) {
    try {
      const client = await Client.findById(req.params.id);

      if (!client) {
        return res.status(404).send("Image not found.");
      }

      res.set("Content-Type", client.imageType);
      res.send(client.imageBuffer);
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

  static async search(req, res) {}
}

module.exports = ClientController;