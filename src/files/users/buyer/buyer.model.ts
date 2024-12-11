import mongoose, { Schema, model } from "mongoose"
import User from "../user.model"
import IBuyer from "./buyer.interface"

const BuyerSchema = new Schema<IBuyer>(
  {
    cartItems: { 
      type: Number, 
      default: 0 
    },
    purchaseHistory: [{ 
      type: String, 
    }],
  },
  { timestamps: true },
)

const Buyer = User.discriminator<IBuyer>("Buyer", BuyerSchema, "buyer")

export default Buyer;
