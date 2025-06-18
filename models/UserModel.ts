import mongoose, { Document, Model, Schema } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  role: "renter" | "landlord" | "admin";
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  resetToken?: string;
  resetTokenExpiry?: number;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["renter", "landlord", "admin"],
      default: "renter",
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatarUrl: { type: String },
    resetToken: { type: String },
    resetTokenExpiry: { type: Number },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
