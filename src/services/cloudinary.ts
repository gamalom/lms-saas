import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { config } from "dotenv";
config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "lms_uploads",
      allowedFormats: ["jpg", "png", "jpeg"],
    };
  },
});

const uploadLimits = {
  fileSize: 1024 * 1024 * 5, // 5MB
};

export { cloudinary, storage, uploadLimits };
