import ImageKit from 'imagekit';

/**
 * Initialize ImageKit instance from environment variables with flexible naming
 */
const getImageKitInstance = () => {
  const publicKey =
    process.env.IMAGEKIT_PUBLIC_KEY ||
    process.env.Imagekit_Public_Key ||
    process.env.IMAGEKIT_KEY ||
    '';

  const privateKey =
    process.env.IMAGEKIT_PRIVATE_KEY ||
    process.env.Imagekit_Kit_Private_Key ||
    process.env.IMAGEKIT_SECRET ||
    '';

  const urlEndpoint =
    process.env.IMAGEKIT_URL_ENDPOINT ||
    process.env.Imagekit_Url_Endpoint ||
    process.env.IMAGEKIT_ENDPOINT ||
    'https://ik.imagekit.io/globetrotter';

  if (!publicKey || !privateKey || !urlEndpoint) {
    console.warn(
      '[ImageKit] Warning: ImageKit credentials partially missing in .env (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT). Returning mock client to prevent crash.'
    );
    return {
      upload: async ({ file, fileName, folder }) => {
        console.log(`[ImageKit Mock] Simulating upload of ${fileName} to ${folder}`);
        return {
          url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
          fileId: 'mock_file_id',
          thumbnailUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=100&q=80',
          name: fileName,
          filePath: `/mock/${fileName}`
        };
      },
      deleteFile: async (fileId) => {
        console.log(`[ImageKit Mock] Simulating deletion of ${fileId}`);
      },
      getAuthenticationParameters: () => ({
        token: 'mock_token',
        expire: 0,
        signature: 'mock_signature'
      })
    };
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
};

const imagekit = getImageKitInstance();

export default imagekit;
