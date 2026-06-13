const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const verifyJWT = require("./middleware/verifyJWT");

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admin only" });
  }
  next();
}

const USERS_FILE = path.join(__dirname, "users.json");
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error(
    "ERROR: JWT_SECRET is required. Create a .env file with JWT_SECRET=your_secret",
  );
  process.exit(1);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateRegisterPayload({ username, password, role }) {
  if (!isNonEmptyString(username) || username.trim().length < 3) {
    return "username must be at least 3 characters";
  }
  if (!isNonEmptyString(password) || password.length < 6) {
    return "password must be at least 6 characters";
  }
  if (role && !["USER", "ADMIN"].includes(role)) {
    return "invalid role";
  }
  return null;
}

function validateLoginPayload({ username, password }) {
  if (!isNonEmptyString(username) || !isNonEmptyString(password)) {
    return "username and password required";
  }
  return null;
}

function validateProductPayload(body, allowPartial = false) {
  const { name, category, price, stock, image, description } = body;

  if (!allowPartial || Object.prototype.hasOwnProperty.call(body, "name")) {
    if (!isNonEmptyString(name)) {
      return "name is required";
    }
    if (name.trim().length > 100) {
      return "name must be at most 100 characters";
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "category")) {
    if (category !== undefined && typeof category !== "string") {
      return "category must be a string";
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "price")) {
    const priceValue = Number(price);
    if (!Number.isFinite(priceValue) || priceValue < 0) {
      return "price must be a non-negative number";
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "stock")) {
    const stockValue = Number(stock);
    if (
      !Number.isFinite(stockValue) ||
      stockValue < 0 ||
      !Number.isInteger(stockValue)
    ) {
      return "stock must be a non-negative integer";
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "image")) {
    if (image !== undefined && !isNonEmptyString(image)) {
      return "image must be a valid URL string";
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "description")) {
    if (description !== undefined && typeof description !== "string") {
      return "description must be a string";
    }
  }

  return null;
}

function readUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

app.get("/health", (req, res) => res.json({ ok: true }));

// Register - creates USER accounts only from the client. ADMIN creation is blocked
// here unless there is no admin yet and caller supplies role=ADMIN (not from client UI).
app.post("/register", async (req, res) => {
  const { username, password, role = "USER" } = req.body;
  const validationError = validateRegisterPayload({ username, password, role });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const users = readUsers();

  if (users.find((u) => u.username === username)) {
    return res.status(409).json({ message: "username already exists" });
  }

  // Prevent client-side creation of ADMIN accounts: only allow ADMIN if none exist
  if (role === "ADMIN" && users.some((u) => u.role === "ADMIN")) {
    return res.status(403).json({ message: "An admin account already exists" });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = {
    id: Date.now(),
    username,
    passwordHash,
    role,
  };

  users.push(user);
  writeUsers(users);

  return res.status(201).json({ message: "created" });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const validationError = validateLoginPayload({ username, password });
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const users = readUsers();
  const user = users.find((u) => u.username === username);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { username: user.username, role: user.role },
    JWT_SECRET,
    {
      expiresIn: "2h",
    },
  );

  return res.json({ token, role: user.role, username: user.username });
});

// Example protected route
app.get("/profile", (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: "Unauthorized" });
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    res.json({ user: payload });
  } catch (e) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Serve uploaded images
const UPLOADS_DIR = path.join(__dirname, "uploads");
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);
app.use("/uploads", express.static(UPLOADS_DIR));

// Image upload endpoint
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`);
  },
});
const upload = multer({ storage });

app.post(
  "/admin/upload",
  verifyJWT,
  requireAdmin,
  upload.single("image"),
  (req, res) => {
    if (!req.file) return res.status(400).json({ message: "no file" });
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ url });
  },
);

// Admin product management
const PRODUCTS_FILE = path.join(__dirname, "products.json");

function readProducts() {
  try {
    const raw = fs.readFileSync(PRODUCTS_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

function writeProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
}

const ORDERS_FILE = path.join(__dirname, "orders.json");

function readOrders() {
  try {
    const raw = fs.readFileSync(ORDERS_FILE, "utf-8");
    return JSON.parse(raw || "[]");
  } catch (e) {
    return [];
  }
}

app.get("/admin/products", verifyJWT, requireAdmin, (req, res) => {
  const q = (req.query.q || "").toLowerCase();
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.max(1, Math.min(100, Number(req.query.limit) || 10));

  let products = readProducts();
  if (q) {
    products = products.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q),
    );
  }

  const total = products.length;
  const start = (page - 1) * limit;
  const pageData = products.slice(start, start + limit);

  res.json({ data: pageData, total });
});

app.post("/admin/products", verifyJWT, requireAdmin, (req, res) => {
  const validationError = validateProductPayload(req.body);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const {
    name,
    category = "",
    price = 0,
    stock = 0,
    image = "",
    description = "",
  } = req.body;
  const products = readProducts();
  const id = Date.now();
  const p = {
    id,
    name: name.trim(),
    category: category.trim(),
    price: Number(price),
    stock: Number(stock),
    image: image.trim(),
    description: description.trim(),
  };
  products.push(p);
  writeProducts(products);
  res.status(201).json(p);
});

app.put("/admin/products/:id", verifyJWT, requireAdmin, (req, res) => {
  const validationError = validateProductPayload(req.body, true);
  if (validationError) {
    return res.status(400).json({ message: validationError });
  }

  const id = Number(req.params.id);
  const products = readProducts();
  const idx = products.findIndex((x) => x.id === id);
  if (idx === -1) return res.status(404).json({ message: "not found" });
  const updated = {
    ...products[idx],
    ...(req.body.name !== undefined && { name: req.body.name.trim() }),
    ...(req.body.category !== undefined && {
      category: req.body.category.trim(),
    }),
    ...(req.body.price !== undefined && { price: Number(req.body.price) }),
    ...(req.body.stock !== undefined && { stock: Number(req.body.stock) }),
    ...(req.body.image !== undefined && { image: req.body.image.trim() }),
    ...(req.body.description !== undefined && {
      description: req.body.description.trim(),
    }),
  };
  products[idx] = updated;
  writeProducts(products);
  res.json(updated);
});

app.delete("/admin/products/:id", verifyJWT, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  let products = readProducts();
  products = products.filter((x) => x.id !== id);
  writeProducts(products);
  res.json({ ok: true });
});

// Admin user management
app.get("/admin/users", verifyJWT, requireAdmin, (req, res) => {
  const users = readUsers().map((u) => ({
    id: u.id,
    username: u.username,
    role: u.role,
  }));
  res.json(users);
});

app.put("/admin/users/:id", verifyJWT, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return res.status(404).json({ message: "not found" });
  users[idx] = { ...users[idx], ...req.body };
  writeUsers(users);
  res.json({
    id: users[idx].id,
    username: users[idx].username,
    role: users[idx].role,
  });
});

app.delete("/admin/users/:id", verifyJWT, requireAdmin, (req, res) => {
  const id = Number(req.params.id);
  let users = readUsers();
  users = users.filter((u) => u.id !== id);
  writeUsers(users);
  res.json({ ok: true });
});

app.get("/admin/orders", verifyJWT, requireAdmin, (req, res) => {
  const orders = readOrders();
  res.json(orders);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Auth server listening on ${PORT}`));
