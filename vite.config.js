<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";

const USERS_FILE = path.join(process.cwd(), "server", "users.json");
// Vite executes this in Node; keep process access via globalThis to satisfy strict linters
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

// NOTE: bcryptjs was not available for Vite config bundling in your environment.
// This dev-only fallback stores plain-text passwords.
// Do NOT use this in production.
function storeHash(plain) {
  return `plain:${String(plain)}`;
}

function verifyHash(plain, stored) {
  return storeHash(plain) === stored;
}

export default defineConfig({
  plugins: [react(), tailwindcss()],

  // GitHub Pages subpath (must match BrowserRouter basename)
  // Note: do NOT include a trailing slash for Vite base.
  base: "/business-redesign-AbelMeb",


  build: {
    assetsDir: "assets",
    sourcemap: false,
    emptyOutDir: true,
  },

  server: {
    port: 3000,
    strictPort: true,

    configureServer(devServer) {
      devServer.middlewares.use((req, res, next) => {
        console.log("[api]", req.method, req.url);

        if (req.url === "/health") {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        if (req.method === "POST" && req.url === "/register") {
          let body = "";

          req.on("data", (chunk) => (body += chunk));

          req.on("end", () => {
            try {
              const parsed = JSON.parse(body || "{}");
              const { username, password, role = "USER" } = parsed;

              if (
                !username ||
                typeof username !== "string" ||
                username.trim().length < 3
              ) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    message: "username must be at least 3 characters",
                  }),
                );
                return;
              }

              if (
                !password ||
                typeof password !== "string" ||
                password.length < 6
              ) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    message: "password must be at least 6 characters",
                  }),
                );
                return;
              }

              if (role && !["USER", "ADMIN"].includes(role)) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "invalid role" }));
                return;
              }

              const users = readJSON(USERS_FILE, []);

              if (users.find((u) => u.username === username)) {
                res.statusCode = 409;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "username already exists" }));
                return;
              }

              if (role === "ADMIN" && users.some((u) => u.role === "ADMIN")) {
                res.statusCode = 403;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({
                    message: "An admin account already exists",
                  }),
                );
                return;
              }

              users.push({
                id: Date.now(),
                username,
                passwordHash: storeHash(password),
                role,
              });

              writeJSON(USERS_FILE, users);

              res.statusCode = 201;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "created" }));
            } catch {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "register failed" }));
            }
          });

          return;
        }

        if (req.method === "POST" && req.url === "/login") {
          let body = "";

          req.on("data", (chunk) => (body += chunk));

          req.on("end", () => {
            try {
              const parsed = JSON.parse(body || "{}");
              const { username, password } = parsed;

              if (!username || !password) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(
                  JSON.stringify({ message: "username and password required" }),
                );
                return;
              }

              const users = readJSON(USERS_FILE, []);
              const user = users.find((u) => u.username === username);

              if (!user || !verifyHash(password, user.passwordHash)) {
                res.statusCode = 401;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ message: "Invalid credentials" }));
                return;
              }

              const token = jwt.sign(
                {
                  username: user.username,
                  role: user.role,
                },
                JWT_SECRET,
                {
                  expiresIn: "2h",
                },
              );

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  token,
                  role: user.role,
                  username: user.username,
                }),
              );
            } catch {
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ message: "login failed" }));
            }
          });

          return;
        }

        next();
      });
    },
  },
});
<<<<<<< HEAD
>>>>>>> 82ba93c (Add GitHub Pages deployment)
=======

>>>>>>> 5e12bd9 (deploy build)
