const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

let users = []; // NO DATABASE

// REGISTER
app.post("/register", (req, res) => {
  users.push(req.body);
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

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
