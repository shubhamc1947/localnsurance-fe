import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Fix Windows EPERM error: Next.js file tracing scans user home directory
// and fails on Windows junction points (e.g. "Application Data", "Cookies").
// Patch fs.readdir to return empty for inaccessible junction paths.
const origReaddir = fs.readdir;
fs.readdir = function (p, ...args) {
  const cb = args[args.length - 1];
  if (typeof p === "string" && typeof cb === "function") {
    const normalized = p.replace(/\\/g, "/");
    if (
      normalized.includes("/Users/") &&
      !normalized.includes("/node_modules/") &&
      !normalized.startsWith(__dirname.replace(/\\/g, "/"))
    ) {
      return cb(null, []);
    }
  }
  return origReaddir.call(this, p, ...args);
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    outputFileTracingRoot: __dirname,
  },
};

export default nextConfig;
