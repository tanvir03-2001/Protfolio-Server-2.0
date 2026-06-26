import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    throw new Error(
      "CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET are required",
    );
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
  });

  return cloudinary;
}

export function uploadToCloudinary(buffer, { folder = "misc", filename }) {
  const cloudinary = configureCloudinary();

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `portfolio/${folder}`,
        public_id: filename
          ? filename.replace(/\.[^.]+$/, "").replace(/\s+/g, "-").toLowerCase()
          : undefined,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );

    stream.end(buffer);
  });
}

export function deleteFromCloudinary(publicId, resourceType = "image") {
  const cloudinary = configureCloudinary();

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: resourceType, invalidate: true },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      },
    );
  });
}
