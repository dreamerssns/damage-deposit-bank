import mongoose from "mongoose";

interface IMessage {
  sender: mongoose.Types.ObjectId;
  content: string;
  approved: boolean;
}

interface ISubject {
  house: mongoose.Types.ObjectId;
  title: string;
  messages: IMessage[];
}

const messageSchema = new mongoose.Schema<IMessage>(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
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
  },
  { timestamps: true }
);

const SubjectModel =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", subjectSchema);
export default SubjectModel;
