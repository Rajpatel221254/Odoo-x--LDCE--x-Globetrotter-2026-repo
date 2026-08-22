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
      '[ImageKit] Warning: ImageKit credentials partially missing in .env (IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT).'
    );
  }

  return new ImageKit({
    publicKey,
    privateKey,
    urlEndpoint,
  });
};

const imagekit = getImageKitInstance();

export default imagekit;
