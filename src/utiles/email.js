import nodemailer from "nodemailer"
import { html } from "./userEmailTempletHtml.js"
import jwt from "jsonwebtoken"

export const sendEmail = async option => {
    // create transport
const transporter = nodemailer.createTransport({
    service : "gmail",
    auth :{
        user : 'riaadawdalha200019@gmail.com' ,
        pass : 'gpfm pekq qqdu crnz'

    }
}) 
    var token = jwt.sign({email : option.email} , 'tttttttt') 
    // define the email options 
    const mailOptions = {
        from : 'riaadawdalha200019@gmail.com',
        To : option.email,
        subject : token.subject,
        Text : " Hello ",
        html :html(token)
    }

    //send the email 
    await transporter.sendMail(mailOptions)
    
}