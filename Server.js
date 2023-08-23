process.on('uncaughtException',(err)=>{
    console.log('errrrrrrrrr');
})

import  Express from 'express'
import { dbconnection } from './database/dbconnection.js'
import * as dotenv from 'dotenv'
import { init } from './src/init.routes.js';
import cors from 'cors'
dotenv.config()


const app = Express()
const port = 3000
app.use(cors())
app.use(Express.json())
app.use(Express.static('/UpLoads'))
init (app) 
dbconnection ()
app.listen(process.env.PORT || port , () => console.log(`O.K`))


process.on('unhandledRejection',(err)=>{
    console.log('eroooooooooooooooooooor',err)
})