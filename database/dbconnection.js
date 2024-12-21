import  mongoose  from 'mongoose';

export function DataBase(){ 
    const DbOnline = process.env.Db_OnLine.replace(
   `<db_password>` , process.env.DataBase_Password ) 
    const DbLocal = process.env.Db_Local
       mongoose.connect(DbOnline)
       .then(()=>console.log(`OnLine Connection is O.K `))
       ;
    //    mongoose.connect(DbLocal)
    //    .then(()=>console.log(`Local Connection is O.K `))
    //    ;
   }
   