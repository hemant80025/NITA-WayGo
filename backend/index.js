import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";  // Import MongoDB connection
import userRoutes from "./routes/userRoutes.js";  // Import user routes

dotenv.config();  // Load environment variables

const app = express();

// Middleware
app.use(cors());  // Enable CORS for frontend communication
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
connectDB().then(() => {
    //console.log(" Connected to MongoDB via Compass (localhost:27017)");
}).catch((err) => {
    console.error(" MongoDB Connection Error:", err);
});

// Use routes
app.use("/api", userRoutes);

// Home route
app.get("/", (req, res) => {
    res.send(" API is running...");
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
