import mongoose from "mongoose";

const URI = 'mongodb+srv://abadano05:coderhouse@cluster0.c3jlm8v.mongodb.net/ecommerce?retryWrites=true&w=majority'
//mongoose.set('strictQuery', false)
mongoose.connect(URI, (error)=>{
    if(error){
        console.log('Error en conexión de base de datos', error)
    }
    else
    {
        console.log('***** Base de datos conectada *****')
    }
})