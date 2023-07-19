const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const schema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"],
    },
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    rootId:{
        type:mongoose.Types.ObjectId,
        ref:"Root"
    },

})
schema.virtual("repeatePassword").set(function(value){
    if(this.password!==value){
        throw new Error("Passwords mismach!")
    }
})
schema.pre("save",async function(){
    console.log('this.password: ', this.password);
    this.password = await bcrypt.hash(this.password,3);
})


module.exports  = mongoose.model("User",schema) 