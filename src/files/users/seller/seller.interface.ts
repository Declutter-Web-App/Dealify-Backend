import { Document } from "mongoose";
import { IUser } from "../user.interface";

interface ISeller extends IUser {
  productsListed: number;
  ratings: number;
}

export default ISeller;