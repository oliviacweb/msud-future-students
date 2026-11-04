import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,

  cacheHandler: path.resolve(__dirname, './cache-handler.mjs'),

  cacheHandlers: {
    remote: path.resolve(__dirname, './cacheHandlers/remote-handler.mjs'),
  },

  cacheMaxMemorySize: 0,

  // Stamped into every page so the accessibility check can tell a fresh build from an old one.
  env: {
    BUILD_TIME: String(Math.floor(Date.now() / 1000)),
  },
};

export default nextConfig;
