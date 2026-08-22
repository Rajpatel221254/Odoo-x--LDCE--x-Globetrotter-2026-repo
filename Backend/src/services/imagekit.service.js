import imagekit from '../config/imagekit.js';

/**
 * Upload an image buffer to ImageKit
 * 
 * @param {Buffer} fileBuffer - The binary buffer from multer
 * @param {string} fileName - Destination file name
 * @param {string} folder - Folder in ImageKit media library (default: 'globetrotter/profiles')
 * @returns {Promise<{ url: string, fileId: string, thumbnailUrl: string, name: string, filePath: string }>}
 */
export const uploadImageToImageKit = async (
  fileBuffer,
  fileName,
  folder = 'globetrotter/profiles'
) => {
  const privateKey =
    process.env.IMAGEKIT_PRIVATE_KEY ||
    process.env.Imagekit_Kit_Private_Key ||
    process.env.IMAGEKIT_SECRET;

  if (!privateKey) {
    const error = new Error(
      'ImageKit private key is missing. Please set IMAGEKIT_PRIVATE_KEY (or Imagekit_Kit_Private_Key) in .env'
    );
    error.statusCode = 500;
    throw error;
  }

  try {
    const base64File = fileBuffer.toString('base64');
    const response = await imagekit.upload({
      file: base64File,
      fileName,
      folder,
      useUniqueFileName: true,
    });

    return {
      url: response.url,
      fileId: response.fileId,
      thumbnailUrl: response.thumbnailUrl || response.url,
      name: response.name,
      filePath: response.filePath,
    };
  } catch (error) {
    console.error('[ImageKit] Upload error:', error.message);
    const err = new Error(error.message || 'Failed to upload image to ImageKit');
    err.statusCode = error.statusCode || 500;
    throw err;
  }
};

/**
 * Delete an image from ImageKit by fileId
 * 
 * @param {string} fileId 
 */
export const deleteImageFromImageKit = async (fileId) => {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.warn(`[ImageKit] Failed to delete image ${fileId}:`, error.message);
  }
};

/**
 * Generate client-side authentication parameters for direct frontend uploads
 */
export const getImageKitAuthParams = () => {
  return imagekit.getAuthenticationParameters();
};
