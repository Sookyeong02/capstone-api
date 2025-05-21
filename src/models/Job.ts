import mongoose, { Document, Schema } from "mongoose";

export interface Job extends Document {
  companyId: mongoose.Types.ObjectId;
  title: string;
  category?: string;
  experience?: string;
  content?: string;
  link: string;
  deadline?: Date;
  isDeadlineFlexible?: boolean;
  location?: string;
  thumbnail?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const jobSchema = new Schema<Job>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    category: { type: String },
    experience: { type: String },
    content: { type: String },
    link: { type: String, required: true },
    deadline: { type: Date },
    isDeadlineFlexible: { type: Boolean, default: false },
    location: { type: String },
    thumbnail: { type: String },
  },
  { timestamps: true }
);

const Job = mongoose.model<Job>("Job", jobSchema);
export default Job;
