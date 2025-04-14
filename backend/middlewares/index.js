// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // 2. If not in header, check cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Verify token and attach user to request
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = protect;
