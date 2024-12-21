import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';  // Import the required function from 'url' module
import path from 'path';
import pug from 'pug';

// Workaround for getting __dirname in ES modules
const __filename = fileURLToPath(import.meta.url); // Get current file path
const __dirname = path.dirname(__filename); // Get directory path

export class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `${process.env.Email_From}`;
    }

    newTransporter() {
        if (process.env.NODE_ENV === 'devlopment') {
            // SendGrid or Gmail transport
            return nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'riaadawdalha200019@gmail.com',
                    pass: 'gpfm pekq qqdu crnz'
                }
            });
        }
        // Local SMTP or other environment transport
        return nodemailer.createTransport({
            host: process.env.E-mail_HOST,
            port: process.env.E-mail_PORT,
            auth: {
                user: process.env.E-mailUserName,
                pass: process.env.E-mail_Password
            }
        });
    }

    async send(template, subject) {
        // Resolve the template path using the new __dirname workaround
        const templatePath = path.resolve(__dirname, '..', '..', 'views', 'emails', `${template}.pug`);        
        // console.log('__dirname:', __dirname);
        // console.log('Template path:', templatePath);  // Log the resolved template path

        // 1. Generate HTML based on pug template
        const html = pug.renderFile(templatePath, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        // 2. Define the email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html
        };

        // 3. Send the email
        await this.newTransporter().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to Natours Family');
    }

    async sendPasswordReset() {
        await this.send('passwordReset', 'Your password reset token (valid for 10 min)');
    }
    async verifyEmail() {
        await this.send('verifyEmail', 'Plz , Verify Your Email');
    }
}



// import nodemailer from "nodemailer"
// import { html } from "./userEmailTempletHtml.js"
// import jwt from "jsonwebtoken"

// export const sendEmail = async option => {
//     // create transport
// const transporter = nodemailer.createTransport({
//     service : "gmail",
//     auth :{
//         user : 'riaadawdalha200019@gmail.com' ,
//         pass : 'gpfm pekq qqdu crnz'

//     }
// }) 
//     var token = jwt.sign({email : option.email} , 'tttttttt') 
//     // define the email options 
//     const mailOptions = {
//         from : 'riaadawdalha200019@gmail.com',
//         To : option.email,
//         subject : token.subject,
//         Text : " Hello ",
//         html :html(token)
//     }

//     //send the email 
//     await transporter.sendMail(mailOptions)
    
// }