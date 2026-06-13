const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

let users = [
  { id: 1, username: "admin123", password: "admin123", role: "ADMIN" },
  { id: 2, username: "builder_bob", password: "password123", role: "USER" },
  { id: 3, username: "jane_doe", password: "password123", role: "USER" },
  { id: 4, username: "testuser", password: "password123", role: "USER" }
]; // NO DATABASE

let products = [
  {
    id: 1,
    name: "Industrial Cordless Drill",
    category: "Power Tools",
    rating: 4.8,
    price: 279.99,
    stock: 50,
    description: "A high-performance cordless drill engineered for pro builders with long-lasting battery life and precision torque control.",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 2,
    name: "Heavy-Duty Angle Grinder",
    category: "Power Tools",
    rating: 4.7,
    price: 139.99,
    stock: 35,
    description: "Durable grinder for cutting, grinding, and polishing metal or masonry in demanding environments.",
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 3,
    name: "Classic Claw Hammer",
    category: "Hand Tools",
    rating: 4.9,
    price: 24.5,
    stock: 120,
    description: "A perfectly balanced, shock-absorbing framing hammer built for driving and pulling nails on tough construction sites.",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 4,
    name: "Precision Screwdriver Set",
    category: "Hand Tools",
    rating: 4.6,
    price: 34.99,
    stock: 75,
    description: "Magnetic-tip screwdrivers with ergonomic grips, perfect for delicate electronics or heavy-duty panel installations.",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 5,
    name: "Pro Circular Saw",
    category: "Power Tools",
    rating: 4.8,
    price: 189.0,
    stock: 20,
    description: "Lightweight but powerful circular saw that rips through plywood and framing lumber with a smooth, clean cut.",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 6,
    name: "Adjustable Steel Wrench",
    category: "Hand Tools",
    rating: 4.5,
    price: 18.99,
    stock: 90,
    description: "A heavy-duty drop-forged steel wrench, an absolute essential for mechanics tightening bolts and plumbing fixtures.",
    image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 7,
    name: "Contractor Tape Measure",
    category: "Accessories",
    rating: 4.4,
    price: 15.99,
    stock: 150,
    description: "A rugged, drop-resistant 25-foot tape measure with a strong standout for quick, one-handed job site measurements.",
    image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80"
  },
  {
    id: 8,
    name: "Protective Gloves",
    category: "Safety",
    rating: 4.5,
    price: 9.99,
    stock: 200,
    description: "Anti-slip and cut-resistant work gloves.",
    image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?auto=format&fit=crop&w=900&q=80"
  }
];

let orders = [
  {
    id: 1001,
    items: [
      { id: 1, name: "Industrial Cordless Drill", price: 279.99, quantity: 1 }
    ],
    total: 279.99,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    username: "testuser"
  },
  {
    id: 1002,
    items: [
      { id: 3, name: "Classic Claw Hammer", price: 24.5, quantity: 2 },
      { id: 8, name: "Protective Gloves", price: 9.99, quantity: 5 }
    ],
    total: 98.95,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    username: "jane_doe"
  },
  {
    id: 1003,
    items: [
      { id: 5, name: "Pro Circular Saw", price: 189.0, quantity: 1 }
    ],
    total: 189.0,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    username: "builder_bob"
  }
];

// REGISTER
app.post("/register", (req, res) => {
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
    username: req.body.username,
    password: req.body.password,
    role: req.body.role || "USER"
  };
  users.push(newUser);
  res.json({ message: "User created" });
});

// LOGIN
app.post("/login", (req, res) => {
  const user = users.find(
    (u) => u.username === req.body.username && u.password === req.body.password,
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    {
      username: user.username,
      role: user.role,
    },
    "secret_key",
    { expiresIn: "1h" },
  );

  res.json({
    token,
    role: user.role,
    username: user.username,
  });
});

// PROFILE / VALIDATION
app.get("/profile", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "secret_key");
    res.json({
      user: {
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// PUBLIC PRODUCTS LIST
app.get("/products", (req, res) => {
  res.json(products);
});

// PUBLIC DETAILS API
app.get("/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const p = products.find(p => p.id === id);
  if (p) return res.json(p);
  res.status(404).json({ message: "Product not found" });
});

// ADMIN PRODUCTS GET (PAGINATED & SEARCHABLE)
app.get("/admin/products", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const q = req.query.q || "";

  let filtered = products;
  if (q) {
    filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase()));
  }

  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const paginated = filtered.slice(startIndex, endIndex);

  res.json({
    data: paginated,
    total: filtered.length
  });
});

// ADMIN PRODUCT POST
app.post("/admin/products", (req, res) => {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: req.body.name,
    category: req.body.category,
    price: parseFloat(req.body.price) || 0,
    stock: parseInt(req.body.stock) || 0,
    description: req.body.description || "",
    image: req.body.image || "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=900&q=80",
    rating: 5.0
  };
  products.push(newProduct);
  res.json(newProduct);
});

// ADMIN PRODUCT PUT
app.put("/admin/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const idx = products.findIndex(p => p.id === id);
  if (idx !== -1) {
    products[idx] = {
      ...products[idx],
      name: req.body.name,
      category: req.body.category,
      price: parseFloat(req.body.price) || 0,
      stock: parseInt(req.body.stock) || 0,
      description: req.body.description || products[idx].description,
      image: req.body.image || products[idx].image
    };
    return res.json(products[idx]);
  }
  res.status(404).json({ message: "Product not found" });
});

// ADMIN PRODUCT DELETE
app.delete("/admin/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  products = products.filter(p => p.id !== id);
  res.json({ message: "Product deleted" });
});

// ADMIN IMAGE UPLOAD
app.post("/admin/upload", (req, res) => {
  res.json({ url: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80" });
});

// ADMIN USERS GET
app.get("/admin/users", (req, res) => {
  res.json(users);
});

// ADMIN USER PUT
app.put("/admin/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const idx = users.findIndex(u => u.id === id);
  if (idx !== -1) {
    users[idx].role = req.body.role;
    return res.json(users[idx]);
  }
  res.status(404).json({ message: "User not found" });
});

// ADMIN USER DELETE
app.delete("/admin/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  res.json({ message: "User deleted" });
});

// ADMIN ORDERS GET
app.get("/admin/orders", (req, res) => {
  res.json(orders);
});

// PUBLIC ORDERS CREATE (DEDUCTS STOCK IN REAL TIME)
app.post("/orders", (req, res) => {
  const newOrder = {
    id: orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1001,
    items: req.body.items || [],
    total: parseFloat(req.body.total) || 0,
    createdAt: new Date().toISOString(),
    username: req.body.username || "Guest"
  };

  // Deduct stock levels in real time
  newOrder.items.forEach(orderItem => {
    const product = products.find(p => p.id === orderItem.id);
    if (product) {
      product.stock = Math.max(0, (product.stock || 0) - (orderItem.quantity || 1));
    }
  });

  orders.push(newOrder);
  res.json(newOrder);
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
