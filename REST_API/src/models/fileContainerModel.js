const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    ownerId:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:"User"
    },
    rootId:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:"Root"
    },
    type:{
        type:String,
        enum: ["free","paid"]
    },
    storageVolume:{
        type:mongoose.Schema.Types.Decimal128
    },
    usedStorage:{
        type:mongoose.Schema.Types.Decimal128
    },
    fileComponents:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'File'
        }
    ],
    isLocked:{
        type:Boolean,
        default:false
    },

})


module.exports  = mongoose.model("FileContainer",schema)