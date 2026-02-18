/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com",
      "images.unsplash.com",
      "placehold.co",
      "atm-reply-cast-shipment.trycloudflare.com",
      "pose-rejected-best-fleece.trycloudflare.com",
      "shoppassport.onrender.com",
      "api.shophopapp.com"
    ],
  },
};

module.exports = nextConfig;