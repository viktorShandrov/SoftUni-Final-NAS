const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    ownerId:{
        type:mongoose.Types.ObjectId,
        ref: "User"
    },
    rootId:{
        type:mongoose.Types.ObjectId,
        ref: "Root"
    },
    // fileChunks:{
    //     type:String,
    //     ref: "files.files"
    // },
    type:String,
    length:Number,
    createdAt:Date,
    fileName:String
})


module.exports  = mongoose.model("File",schema) 