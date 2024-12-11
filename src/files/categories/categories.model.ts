import { model, Schema } from "mongoose"
import { ICategories } from "./categories.interface"

const CategorySchema = new Schema<ICategories>(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  { timestamps: true },
)

const Category = model<ICategories>("Category", CategorySchema, "category")


export default Category