import mongoose, { Schema, model } from "mongoose"
import ISeller from "./seller.interface"
import User from "../user.model"

const SellerSchema = new Schema<ISeller>(
  {
    productsListed: { 
      type: Number, 
      default: 0 
    },
    ratings: { 
      type: Number, 
      default: 0 
    },
  },
  { timestamps: true },
)

const Seller = User.discriminator<ISeller>("Seller", SellerSchema, "seller")

export default Seller;
