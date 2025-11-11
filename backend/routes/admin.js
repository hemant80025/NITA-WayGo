const express = require("express");
require("dotenv").config();

const router = express.Router();
const fetchAdmin = require("../middleware/fetchAdmin");

const Place = require("../models/Place");
const Feedback = require("../models/Feedback");
const UserReqLocation = require("../models/UserReqLocation");

router.use(express.json());

// Route 1: Add a Place (POST /api/admin/addplace)
router.post("/addplace", fetchAdmin, async (req, res) => {
    try {
        const { name, type, latitude, longitude, imageUrl, importantData } = req.body;

        if (!name || !type || !latitude || !longitude) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if a place already exists with the same latitude
        const existingPlace = await Place.findOne({ latitude });
        if (existingPlace) {
            return res.status(400).json({ error: "Place already exists with this latitude" });
        }

        // Create new place
        await Place.create({ name, type, latitude, longitude, imageUrl, importantData });

        // Remove matching user location request if it exists
        await UserReqLocation.findOneAndDelete({ latitude });

        res.json({ msg: "Place added successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while adding place" });
    }
});

// Route 2: Get All Places (GET /api/admin/places)
router.get("/places", fetchAdmin, async (req, res) => {
    try {
        const places = await Place.find();
        res.json({ msg: places });
    } catch (error) {
        res.status(500).json({ error: "Error fetching places" });
    }
});

// Route 3: Get All User Location Updates (GET /api/admin/getuserlocationupdates)
router.get("/getuserlocationupdates", fetchAdmin, async (req, res) => {
    try {
        const updates = await UserReqLocation.find();
        res.json({ msg: updates });
    } catch (error) {
        res.status(500).json({ error: "Error fetching user location updates" });
    }
});

// Route 4: Get All Feedback (GET /api/admin/feedback)
router.get("/feedback", fetchAdmin, async (req, res) => {
    try {
        const feedback = await Feedback.find();
        res.json({ msg: feedback });
    } catch (error) {
        res.status(500).json({ error: "Error fetching feedback" });
    }
});

// Route 5: Delete a Place (DELETE /api/admin/deletePlace)
router.delete("/deletePlace", fetchAdmin, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        await Place.findOneAndDelete({ latitude, longitude });
        res.json({ msg: "Place deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Route 6: Delete a User Location Update (DELETE /api/admin/deleteuserlocationupdates)
router.delete("/deleteuserlocationupdates", fetchAdmin, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        await UserReqLocation.findOneAndDelete({ latitude, longitude });
        res.json({ msg: "Update deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
