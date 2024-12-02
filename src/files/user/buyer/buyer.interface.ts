import { Document } from "mongoose";
import { IUser } from "../user.interface";

interface IBuyer extends IUser {
  cartItems: number;
  purchaseHistory: Array<string>; // List of purchased items (IDs or names)
}

export default IBuyer;