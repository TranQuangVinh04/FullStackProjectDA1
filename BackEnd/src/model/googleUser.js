const mongoose = require("mongoose");

const SchemaGoogle = new mongoose.Schema({
    accessToken:{
        type:Object
    },
    refreshToken:{
        type:Object
    },
    profile:{
        type:Object
    }
})
const googleUser = mongoose.model("GoogleUser",SchemaGoogle);
module.exports = googleUser;