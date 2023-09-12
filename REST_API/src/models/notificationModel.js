const mongoose = require("mongoose")

const schema = new mongoose.Schema({
    text:String,
    level:{
        type:Number,
        enum:[3,2,1]
    }
})


module.exports  = mongoose.model("Notification",schema) 