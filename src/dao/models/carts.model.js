import mongoose from "mongoose";

const cartProductSchema = new mongoose.Schema({
    id: {
        type: Number,
        //required: true,
    },
    quantity: {
        type: Number,
       // required: true,
    }
})


const cartsSchema = new mongoose.Schema({
    cartProducts: {
        type: Array,
        default:[]   
    }
})

export const cartsModel = mongoose.model('Carts', cartsSchema)