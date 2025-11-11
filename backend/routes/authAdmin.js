const express = require("express");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const router = express.Router();
const Admin = require("../models/Admin");
const fetchAdmin = require("../middleware/fetchAdmin");

router.use(express.json());


// POST /api/authAdmin/createadmin  (Public)
router.post("/createadmin", async (req, res) => {
    try {
        const { name, email, password, imageUrl } = req.body;


        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ error: "Admin already exists with this email" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        const admin = await Admin.create({
            name,
            email,
            password: hashedPassword,
            imageUrl,
        });

        // Create JWT token
        const tokenData = { admin: { id: admin._id } };
        const jwtToken = jwt.sign(tokenData, process.env.SECRET_KEY);

        res.json({
            msg: "Admin created successfully",
            token: jwtToken,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while creating admin" });
    }
});


// POST /api/authAdmin/login  (Public)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;


        if (!email || !password) {
            return res.status(400).json({ success: false, msg: "Email and password required" });
        }

        // Check admin existence
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, msg: "Invalid credentials" });
        }

        // Generate JWT
        const tokenData = { admin: { id: admin._id } };
        const jwtToken = jwt.sign(tokenData, process.env.SECRET_KEY);

        res.json({
            success: true,
            token: jwtToken,
            name: admin.name,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Internal server error" });
    }
});


// POST /api/authAdmin/getadmin  (Protected)
router.post("/getadmin", fetchAdmin, async (req, res) => {
    try {
        const adminId = req.admin.id;
        const admin = await Admin.findById(adminId).select("-password");
        res.json(admin);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
