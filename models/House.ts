import mongoose from "mongoose";

export interface IHouse {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  image?: string;
  landlord: mongoose.Types.ObjectId;
  isPublished: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const houseSchema = new mongoose.Schema<IHouse>(
  {
    name: { type: String, required: true },
    description: String,
    address: String,
    city: String,
    image: String,
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const HouseModel =
  mongoose.models.House || mongoose.model<IHouse>("House", houseSchema);
export default HouseModel;
