export interface Video {
  _id?: string;
  title: string;
  url: string; // Cloudinary URL or YouTube URL
  publicId?: string; // Cloudinary public_id for delete (optional for YouTube)
  sourceType: "cloudinary" | "youtube";
  createdAt?: string;
  updatedAt?: string;
}


