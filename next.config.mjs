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
  async rewrites() {
    return [
      {
        source: '/channel/:name',
        destination: '/channel/[name]',
      },
      {
        source: '/profile/:username',
        destination: '/profile/[username]',
      },
      {
        source: '/post/:id',
        destination: '/post/[id]',
      },
    ];
  },
};

export default nextConfig;
