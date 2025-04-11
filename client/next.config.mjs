/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'i.imgur.com',                       // Add Imgur
      'res.cloudinary.com',                // Add Cloudinary
      // Keep any other existing domains you already have
    ],
  },
}

export default nextConfig
