import multer from 'multer'

const MAX_FILE_SIZE = 15 * 1024 * 1024 // 15 MB

/** Reject anything whose MIME type isn't in the allow-list for this field. */
function mimeFilter(allowed) {
  return (_req, file, cb) => {
    if (allowed.includes(file.mimetype)) return cb(null, true)
    const err = new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname)
    err.message = `Unsupported file type: ${file.mimetype}. Allowed: ${allowed.join(', ')}`
    cb(err)
  }
}

/** Files are held in memory and streamed straight to Cloudinary. */
function makeUploader(allowed) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE, files: 1 },
    fileFilter: mimeFilter(allowed),
  })
}

/** Photos (blog covers, team portraits). */
export const uploadImage = makeUploader([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/gif',
])

/** Documents (financial report PDFs). */
export const uploadPdf = makeUploader(['application/pdf'])
