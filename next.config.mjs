/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["mui-chips-input"],
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/*",
      },
    ],
  },
};

export default nextConfig;
