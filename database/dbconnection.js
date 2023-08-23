import  mongoose  from 'mongoose';
export function dbconnection (){  
    mongoose.connect('mongodb+srv://e-commerce:ahmed123@cluster0.a2hjdbv.mongodb.net/E-commerce');
}
