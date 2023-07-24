const userModel = require( "../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("../utils/utils")
const uuid = require("uuid")
const { createRoot } = require("./filesManager")


exports.register =async (email,password,repeatePassword,rootId)=>{
    const user =await userModel.findOne({email})
    if(user){
        throw new Error("Email already exists!")
    }
    console.log('password from register: ', password);
    return userModel.create({email,password,repeatePassword,rootId})
    
}

exports.login = async (email,password)=>{
    const user = await userModel.findOne({email});
    if(user){
       const isPasswordMatching = await bcrypt.compare(password,user.password);

       if(isPasswordMatching){
            const payload = {
                email,
                _id:user._id,
                rootId:user.rootId
            }
            const token = await jwt.sign(payload,jwt.secret)
            
        return {token,rootId:user.rootId}
       }
       else{
        throw new Error("No such user or password is incorect");
       }
    }else{
        throw new Error("No such user or password is incorect")
    }
}

