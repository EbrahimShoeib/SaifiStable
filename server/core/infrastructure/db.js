const mongoose = require( "mongoose")


async function connectingDataBase ( ) {
     
    mongoose.connect(
    //process.env.CONNECTION_STRING,
    process.env.MONGO_URI,
    ).then(()=> {
        console.log("connected to the database successfully")
    })
    .catch((error)=> {
        console.log("didn't connect to database :" + " " + error.message)
    });
};
module.exports = {
    connectingDataBase
}
