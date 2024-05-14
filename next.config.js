const webpack = require("webpack");
const { i18n } = require("./next-i18next.config");
/** @type {import('next').NextConfig} */

const allowedOrigins = [
  "https://api.lens.dev",
  "https://api-v2.lens.dev/",
  "https://chromadin.infura-ipfs.io",
  "https://tenor.googleapis.com",
  "https://gateway-arbitrum.network.thegraph.com",
  "https://youtube.com",
  "https://vimeo.com",
  "https://gw.ipfs-lens.dev",
  "https://www.chromadin.xyz",
  "https://arweave.net/",
];

const nextConfig = {
  reactStrictMode: true,
  crossOrigin: "anonymous",
  i18n,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "chromadin.infura-ipfs.io",
        pathname: "/ipfs/**",
      },
      {
        protocol: "https",
        hostname: "gw.ipfs-lens.dev",
        pathname: "/ipfs/**",
      },
    ],
    unoptimized: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false,
      buffer: require.resolve("buffer/"),
    };

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ["buffer", "Buffer"],
      })
    );

    return config;
  },
  async headers() {
    let headersConfig = [];

    allowedOrigins.forEach((origin) => {
      headersConfig.push({
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: origin,
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Origin, X-Requested-With, Content-Type, Accept, Authorization",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
        ],
      });
    });

    return headersConfig;
  },
};

module.exports = nextConfig;
