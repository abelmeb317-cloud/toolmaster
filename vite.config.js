import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const USERS_FILE = path.join(process.cwd(), "server", "users.json");
const JWT_SECRET = globalThis.process?.env?.JWT_SECRET || "secret_key";

function readJSON(filePath, fallback) {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw || JSON.stringify(fallback));
  } catch {
    return fallback;
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function storeHash(plain) {
  return `plain:${String(plain)}`;
}

function verifyHash(plain, stored) {
  return storeHash(plain) === stored;
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/business-redesign-AbelMeb/",
});
