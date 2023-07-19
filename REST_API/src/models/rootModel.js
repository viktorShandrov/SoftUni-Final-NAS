const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    // ownerId:mongoose.Types.ObjectId, 
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
    autorised:Array,
    isPublic:Boolean
})


module.exports  = mongoose.model("Root",schema) 