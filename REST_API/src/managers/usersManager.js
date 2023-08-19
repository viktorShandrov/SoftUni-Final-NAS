const userModel = require( "../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("../utils/utils")
const uuid = require("uuid")
const { createRoot } = require("./filesManager")
const {OAuth2Client} = require('google-auth-library');
const {googleClientId} = require('../utils/utils');

exports.register =async (email,password,repeatePassword,rootId,userId)=>{
    const user =await userModel.findOne({email})
    if(user){
        throw new Error("Email already exists!")
    }

    return userModel.create({_id:userId,email,password,repeatePassword,rootId})
    
}
exports.verify =async (credential)=>{
    const client = new OAuth2Client();
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: googleClientId
    
    });
    const payload = ticket.getPayload();
    userId = payload['sub'];
    email = payload['email']
    return {email,userId}
}

exports.login = async (email,password,isLoggingFromGoogle)=>{
    const user = await userModel.findOne({email});
    if(user){
        let isPasswordMatching 
        if(!isLoggingFromGoogle){
            if(user.password===undefined){
                throw new Error("User is registered via third party service")
            }
             isPasswordMatching = await bcrypt.compare(password,user.password);
        }

       if(isPasswordMatching||isLoggingFromGoogle){
            const payload = {
                email,
                _id:user._id,
                rootId:user.rootId
            }
            const token = await jwt.sign(payload,jwt.secret)
            
        return {token,rootId:user.rootId,userId:user._id}
       }
       else{
        throw new Error("No such user or password is incorect");
       }
    }else{
        throw new Error("No such user or password is incorect")
    }
}

