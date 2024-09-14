// process.on('uncaughtException',(err)=>{
//     console.log('error');
// })

import express from 'express';
import * as dotenv from 'dotenv'
dotenv.config()
import { dbconnection } from './database/dbconnection.js'
import { init } from './src/init.routes.js';
import cors from 'cors'
import morgan from 'morgan';



const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
// app.use(morgan('dev'))


app.use(express.static('/UpLoads')) 
init(app) 
dbconnection ()
app.listen(process.env.PORT || port , () => console.log(`O.K`))


process.on('unhandledRejection',(err)=>{
    console.log('error',err)
})
