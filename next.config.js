module.exports = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      path: false,
      crypto: false,
      os: false,
      zlib: false,
      https: false,
      child_process: false,
      net: false,
      tls: false,
      http: false,
    };

    return config
  }
}
