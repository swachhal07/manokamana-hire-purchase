import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export default cloudinary

/**
 * Upload an in-memory file buffer (from multer) to Cloudinary.
 * `resourceType` is 'image' for photos and 'raw' for PDFs/other documents.
 * Returns { url, publicId }.
 */
export function uploadBuffer(buffer, { folder, resourceType = 'image', filename }) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `manokamana/${folder}`,
        resource_type: resourceType,
        // Keep a readable filename for raw files (PDFs) so downloads look sane.
        ...(filename ? { public_id: filename, unique_filename: true } : {}),
      },
      (err, result) => {
        if (err) return reject(err)
        resolve({ url: result.secure_url, publicId: result.public_id })
      },
    )
    stream.end(buffer)
  })
}

/** Best-effort delete of a previously uploaded asset. Never throws. */
export async function deleteAsset(publicId, resourceType = 'image') {
  if (!publicId) return
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
  } catch {
    // Orphaned assets are acceptable; deletion failures must not break requests.
  }
}
