import  mongoose  from 'mongoose';

export function DataBase(){ 
    const DbOnline = process.env.DB_ONLINE.replace(
   `<db_password>` , process.env. DATABASE_PASSWORD  ) 
    const DbLocal = process.env.DB_LOCAL
       mongoose.connect(DbLocal)
       .then(()=>console.log(`OnLine Connection is O.K `))
       ;
    //    mongoose.connect(DbLocal)
    //    .then(()=>console.log(`Local Connection is O.K `))
    //    ;
   }
   