import { loadEnvConfig } from "@next/env";
import type { NextConfig } from "next";
import path from "path";

const envPath = path.join(__dirname, "../..")
loadEnvConfig(envPath)

const nextConfig: NextConfig = {
    /* config options here */
};

export default nextConfig;
