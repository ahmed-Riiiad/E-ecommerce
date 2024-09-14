import  mongoose  from 'mongoose';
export function dbconnection (){  
    mongoose.connect(process.env.Db_connection);
}
