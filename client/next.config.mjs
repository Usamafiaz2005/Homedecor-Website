/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      // Adding Cloudinary as well, assuming your backend product images are hosted there
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      }
    ],
    // 2. Define allowed quality presets to silence the Next.js 16 warning
    qualities: [25, 50, 75, 85, 90, 100],
  },
};

export default nextConfig;