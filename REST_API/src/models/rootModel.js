const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    ownerId:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:"User"
    }, 
    storageVolume:Number,
    usedStorage:Number,
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
    freeFileContainer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FileContainer'
    },
    paidFileContainer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FileContainer'
    },
    autorised:Array,
    allSharedFolders:[{
        userId:{
            type: mongoose.Schema.Types.ObjectId ,
            ref:"User"
        },
        sharedFolderId:{
            type: mongoose.Schema.Types.ObjectId ,
            ref:"Folder"
        } 
    }],
    isPublic:Boolean
})


module.exports  = mongoose.model("Root",schema) 