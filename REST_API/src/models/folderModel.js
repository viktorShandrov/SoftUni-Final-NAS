const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    rootId:{
        type:mongoose.Types.ObjectId,
        ref:"Root"
    },
    ownerId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    name:String,
    dirComponents:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Folder'
        }
    ],
    fileComponents:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }
    ],
    parentFolder:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Folder'
        }
    ,
    autorised:Array,
    isPublic:Boolean
})


module.exports  = mongoose.model("Folder",schema) 