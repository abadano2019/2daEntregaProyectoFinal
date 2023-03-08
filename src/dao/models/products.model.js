import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const productsSchema = new mongoose.Schema({
    
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    code:{
        type: String,
        required: true,
        unique: true,
    },
    category:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
        default: true,
    },
    thumbnails:{
        type:[String],
    },
    stock:{
        type: Number,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    }
})

productsSchema.plugin(mongoosePaginate)
        
export const productsModel = mongoose.model('Products', productsSchema)