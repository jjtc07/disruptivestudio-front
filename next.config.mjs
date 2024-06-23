/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'loremflickr.com',
      'picsum.photos',
      'ui-avatars.com',
    ],
  },
}

export default nextConfig
