/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // Leaflet needs this to handle its CSS and marker image imports
  transpilePackages: ['react-leaflet', 'leaflet'],
};

export default nextConfig;
