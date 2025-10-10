import { Schema, model, models } from "mongoose";

const VideoSchema = new Schema(
  {
    title: { type: String, required: true, index: true },
    url: { type: String, required: true },
    publicId: { type: String, required: false, unique: false, index: true },
    sourceType: { type: String, enum: ["cloudinary", "youtube"], required: true, index: true },
  },
  { timestamps: true }
);

// Compound index for search and uniqueness improvement
VideoSchema.index({ title: "text" });

// In dev hot-reload, an old cached model may still enforce the previous schema.
// Drop the cached model so the updated schema (optional publicId) is used.
if (models.Video) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (models as any).Video;
}
const Video = model("Video", VideoSchema);
export default Video;


