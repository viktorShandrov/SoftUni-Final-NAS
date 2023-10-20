const userModel = require( "../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("../utils/utils")
const uuid = require("uuid")
const { createRoot } = require("./filesManager")
const {OAuth2Client} = require('google-auth-library');
const {googleClientId} = require('../utils/utils');
const notificationModel = require("../models/notificationModel")
const { default: mongoose, trusted } = require("mongoose")
const nodemailer = require('nodemailer');

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
            
        return {token,rootId:user.rootId,userId:user._id,email}
       }
       else{
        throw new Error("No such user or password is incorrect");
       }
    }else{
        throw new Error("No such user or password is incorrect")
    }
}
exports.addNotification = async (userId,notificationId)=>{
    const user = await userModel.findById(userId)
    user.notifications.push({notification:notificationId,seen:false})
    await user.save()
}
exports.addNotificationForEveryone = async(notId)=>{
    const allUsers =await userModel.find()
    for (const user of allUsers) {
        this.addNotification(user._id,notId)
    }
}
exports.newNotification = async (message,level,userId) =>{
    const {_id} =await notificationModel.create({message,level})
    if(userId){
        //specificly for on person
       await this.addNotification(userId,_id)
    }else{
        //to everyone
        await this.addNotificationForEveryone(_id)
    }
}
exports.makeAllNotificationsSeen=async(userId)=>{
    const user = await userModel.findById(userId).populate("notifications.notification")
    for (const notification of user.notifications) {
        notification.seen = true
    }
    await user.save()
}
exports.getNotifications=async(userId)=>{
    const user = await userModel.findById(userId).populate("notifications.notification")
    return user.notifications
}
exports.areThereUnSeenNotifications=async(userId)=>{
    const user = await userModel.findById(userId)
    for (const notification of user.notifications) {
        if(!notification.seen){
            return true
        }
    }
    return false
}
exports.sendConfirmationEmail= async (email,password)=>{

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Confirmation</title>
</head>
<body>
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border-collapse: collapse;">
        <tr>
            <td align="center" bgcolor="#007BFF" style="padding: 40px 0 30px 0;">
                <h1 style="color: #ffffff; font-size: 24px; font-weight: bold; margin: 0;">Email Confirmation</h1>
            </td>
        </tr>
        <tr>
            <td bgcolor="#f4f4f4" style="padding: 40px 30px 40px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;">
                    <tr>
                        <td style="color: #333333; font-size: 16px; line-height: 24px;">
                            <p>Thank you for signing up! To complete your registration in "The Confederacy Cloud", please click the button below:</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: collapse;">
                                <tr>
                                    <td align="center" bgcolor="#007BFF" style="border-radius: 3px;">
                                        <a href="http://localhost:4200/#/accountConfirmation/${email}/${password}" target="_blank" style="color: #ffffff; text-decoration: none; display: inline-block; padding: 10px 20px; font-size: 18px; font-weight: bold;">Confirm Your Email</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="color: #333333; font-size: 16px; line-height: 24px; padding-top: 20px;">
                            <p>If you did not register on our website, please ignore this email.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td bgcolor="#007BFF" style="padding: 30px 30px 30px 30px;">
                <p style="color: #ffffff; font-size: 12px; line-height: 18px; margin: 0;">&copy; 2023 The Confederacy. All rights reserved.</p>
            </td>
        </tr>
    </table>
</body>
</html>`

// Create a Nodemailer transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.abv.bg',
        port: 465, // Use the appropriate port for secure SMTP (abv.bg uses port 465 for SSL/TLS)
        secure: true, // Use SSL/TLS
        auth: {
            user: 'viktor_shandrov@abv.bg', // Your abv.bg email address
            pass: '#69BGshadopest43', // Your abv.bg email password
        },
        tls: {
            rejectUnauthorized: false, // Add this to accept self-signed certificates
        },
    });

// Email data
    const mailOptions = {
        from: 'viktor_shandrov@abv.bg',
        to:email,
        subject: 'Confirmation email',
        html,
    };

// Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });

}

