process.on('uncaughtException',(err)=>{
    console.log('uncaughtException_error' , err);
})
import express from 'express';
import * as dotenv from 'dotenv'
dotenv.config()
import { DataBase } from './database/dbconnection.js'
import { init } from './src/init.routes.js';
import cors from 'cors'
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import MongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { createOnlineOrder } from './src/modules/order/order.controler.js';

const app = express()
//Global MiddleWare
// 1- security http headers
app.use(helmet())
// 2- development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}
// 3- limit req from samp ip        
const limiter = rateLimit({
        max: 100 ,
        windowMs : 60 * 60 * 1000 ,
        message : 'too Many Request from this ip '
    })
app.use('/Api', limiter)
// 4- body parser , reading data from req body 
app.use(cors())
app.post('/webhook', express.raw({type: 'application/json'}),createOnlineOrder);
app.use(express.json({limit : '10kb'}))
// 5- Data Sanitization against NoSql query injection
    app.use(MongoSanitize())
// 6- prevent parameter pollution (sending more than filed in url )
app.use(hpp({
   whitelist : [
    'price'
    ]
}))
// 7- server static files 
app.use(express.static('/UpLoads')) 

// Routes 
init(app) 

// DataBase Connection
const port = 3000
DataBase()
app.listen(process.env.PORT || port , () => console.log(`server is Running on local port ${port} `))

// unhandledRejection error 
process.on('unhandledRejection',(err)=>{
    console.log('unhandledRejection_error',err)
})
