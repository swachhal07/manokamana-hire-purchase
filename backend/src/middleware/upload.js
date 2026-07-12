import multer from 'multer'

/** Files are held in memory and streamed straight to Cloudinary. */
export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB
})
