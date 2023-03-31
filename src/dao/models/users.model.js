import mongoose from 'mongoose'

const usersSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
    default: 0,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Carts',
  },
  role:{
    type: String,
    required: true,
    default: "user"
  }
})

usersSchema.pre("findOne", function(next){
  this.populate("cart");
  next();
})

export const userModel = mongoose.model('Users',usersSchema)
