import express from "express";
import { createUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

// Route to create a user (POST)
router.post("/create_users", createUser);

// Route to get users based on name query (GET)
router.get("/fetch_users/:key", getUsers);

export default router;
