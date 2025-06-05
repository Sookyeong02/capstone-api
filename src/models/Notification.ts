import mongoose, { Schema, Document } from "mongoose";
import { applyToJSONTransform } from "../toJSONTransform";

export interface Notification extends Document {
  userId: mongoose.Types.ObjectId;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<Notification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

applyToJSONTransform(notificationSchema);

const Notification = mongoose.model<Notification>(
  "Notification",
  notificationSchema
);
export default Notification;
