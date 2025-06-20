// models/Subject.ts
import mongoose, { Model } from "mongoose";
import { IUser } from "./UserModel"; // Assuming you have a User model defined

export type MessageDTO = {
  _id: string;
  content: string;
  image: string | null;
  approved: boolean;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    avatarUrl: string | null;
    role: "renter" | "landlord" | "admin";
  };
};
export interface IMessage {
  _id?: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId | IUser;
  content: string;
  image?: string;
  approved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubject {
  _id?: mongoose.Types.ObjectId;
  house: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
  createdBy: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    image: { type: String }, // <-- added
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const subjectSchema = new mongoose.Schema<ISubject>(
  {
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    title: { type: String, required: true },
    messages: [messageSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const SubjectModel: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", subjectSchema);

export default SubjectModel;
