import dotenv from 'dotenv'
import type { NextConfig } from "next";
import path from "path";

const envPath = path.join(__dirname, "..", "..", ".env")
dotenv.config({ path: envPath });

const nextConfig: NextConfig = {
    /* config options here */
};

export default nextConfig;
