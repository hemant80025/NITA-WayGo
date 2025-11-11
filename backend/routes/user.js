const express = require("express");
require("dotenv").config();

const router = express.Router();
const fetchUser = require("../middleware/fetchUser");

const Place = require("../models/Place");
const PinLocation = require("../models/PinLocation");
const Feedback = require("../models/Feedback");
const UserReqLocation = require("../models/UserReqLocation");

router.use(express.json());


// POST /api/user/reqplace
router.post("/reqplace", fetchUser, async (req, res) => {
    try {
        const { name, type, latitude, longitude } = req.body;

        if (!name || !type || !latitude || !longitude) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if place already requested
        const existingPlace = await UserReqLocation.findOne({ latitude });
        if (existingPlace) {
            return res.status(400).json({ error: "Place already requested at this latitude" });
        }

        await UserReqLocation.create({ name, type, latitude, longitude });
        res.json({ msg: "Place requested successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while requesting place" });
    }
});

// POST /api/user/feedback
router.post("/feedback", fetchUser, async (req, res) => {
    try {
        const { message, imageUrl } = req.body;
        const user = req.user;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        await Feedback.create({
            user: user.id,
            message,
            imageUrl,
        });

        res.json({ msg: "Feedback submitted successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while submitting feedback" });
    }
});


// GET /api/user/places
router.get("/places", fetchUser, async (req, res) => {
    try {
        const places = await Place.find();
        res.json({ msg: places });
    } catch (error) {
        res.status(500).json({ error: "Error fetching places" });
    }
});


// POST /api/user/addpinlocation
router.post("/addpinlocation", fetchUser, async (req, res) => {
    try {
        const { name, type, latitude, longitude, message } = req.body;
        const user = req.user;

        if (!name || !type || !latitude || !longitude || !message) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingPin = await PinLocation.findOne({ latitude });
        if (existingPin) {
            return res.status(400).json({ error: "Pin already exists at this latitude" });
        }

        await PinLocation.create({
            user: user.id,
            name,
            type,
            latitude,
            longitude,
            message,
        });

        res.json({ msg: "Place pinned successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error while pinning place" });
    }
});


// GET /api/user/pinlocations
router.get("/pinlocations", fetchUser, async (req, res) => {
    try {
        const pins = await PinLocation.find({ user: req.user.id });
        res.json({ msg: pins });
    } catch (error) {
        res.status(500).json({ error: "Error fetching pinned locations" });
    }
});


// DELETE /api/user/deletepinlocation
router.delete("/deletepinlocation", fetchUser, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;

        await PinLocation.findOneAndDelete({
            user: req.user.id,
            latitude,
            longitude,
        });

        res.json({ msg: "Pin deleted successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
