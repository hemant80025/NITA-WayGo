const express = require("express");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");

router.use(express.json());


// POST /api/authUser/createuser (Public)
router.post("/createuser", async (req, res) => {
    try {
        const { name, email, password, imageUrl } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            imageUrl,
        });

        // Generate JWT token
        const tokenData = { user: { id: user._id } };
        const jwtToken = jwt.sign(tokenData, process.env.SECRET_KEY);

        res.json({
            msg: "User created successfully",
            token: jwtToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while creating user" });
    }
});


// POST /api/authUser/login (Public)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, msg: "Email and password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }

        // Generate JWT token
        const tokenData = { user: { id: user._id } };
        const jwtToken = jwt.sign(tokenData, process.env.SECRET_KEY);

        res.json({
            success: true,
            token: jwtToken,
            name: user.name,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
});


// POST /api/authUser/getuser (Protected)
router.post("/getuser", fetchUser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
