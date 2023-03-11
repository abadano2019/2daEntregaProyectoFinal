import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({
    cartProducts: [{
                        id: {
                            type: mongoose.Schema.Types.ObjectId,
                            ref:'Products',
                        },
                        quantity: {
                            type: Number,
                            default:1,
                        },
                        _id:false
                    } 
                ]
})

cartsSchema.pre("findOne", function(next){
    this.populate("cartProducts.id");
    next();
})


export const cartsModel = mongoose.model('Carts', cartsSchema)