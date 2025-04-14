const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ DB Connection Successful"))
  .catch((error) => console.log("❌ DB Connection Error:", error));

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// API Routes
app.use("/api/user", authRoutes);
app.use("/api/task", taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
