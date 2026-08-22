import multer from 'multer';
import path from 'path';

// Store uploaded files in memory as Buffer objects
const storage = multer.memoryStorage();

// Validate image file formats
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpe?g|png|webp|gif|svg|avif|heic|heif|bmp|tiff?)$/i;
  const isImageMime = file.mimetype && file.mimetype.startsWith('image/');
  const isImageExt = file.originalname && allowedExtensions.test(path.extname(file.originalname));

  // Accept if MIME type is an image or file extension is an image
  if (isImageMime || isImageExt) {
    cb(null, true);
  } else {
    const error = new Error(
      'Invalid file format. Only image files (JPEG, PNG, JPG, WEBP, GIF, SVG, AVIF) are allowed.'
    );
    error.statusCode = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max limit
  },
});

/**
 * Middleware for handling single profile photo upload.
 * Supports field names: 'profilePhoto', 'photo', 'avatar', 'image'
 */
export const uploadProfilePhoto = (req, res, next) => {
  const uploadHandler = upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'avatar', maxCount: 1 },
    { name: 'image', maxCount: 1 },
  ]);

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const error = new Error('File too large. Maximum allowed photo size is 5MB.');
        error.statusCode = 400;
        return next(error);
      }
      const error = new Error(`Upload error: ${err.message}`);
      error.statusCode = 400;
      return next(error);
    } else if (err) {
      return next(err);
    }

    // Normalize req.file from any of the matched field names
    if (req.files) {
      const file =
        req.files.profilePhoto?.[0] ||
        req.files.photo?.[0] ||
        req.files.avatar?.[0] ||
        req.files.image?.[0];
      if (file) {
        req.file = file;
      }
    }

    next();
  });
};

/**
 * Middleware for handling single trip cover image upload.
 * Supports field names: 'coverImage', 'image', 'photo', 'file'
 */
export const uploadCoverImage = (req, res, next) => {
  const uploadHandler = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'file', maxCount: 1 },
  ]);

  uploadHandler(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        const error = new Error('File too large. Maximum allowed cover image size is 5MB.');
        error.statusCode = 400;
        return next(error);
      }
      const error = new Error(`Upload error: ${err.message}`);
      error.statusCode = 400;
      return next(error);
    } else if (err) {
      return next(err);
    }

    if (req.files) {
      const file =
        req.files.coverImage?.[0] ||
        req.files.image?.[0] ||
        req.files.photo?.[0] ||
        req.files.file?.[0];
      if (file) {
        req.file = file;
      }
    }

    next();
  });
};

/**
 * Helper to upload a single file with custom field name
 */
export const uploadSingle = (fieldName = 'photo') => {
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          const error = new Error('File too large. Maximum allowed size is 5MB.');
          error.statusCode = 400;
          return next(error);
        }
        const error = new Error(`Upload error: ${err.message}`);
        error.statusCode = 400;
        return next(error);
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

export default upload;
