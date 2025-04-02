import User from '../models/User.js';

// Create a new user dynamically with validation
export const createUser = async (req, res) => {
    try {
        const { name, lat, lon, address } = req.body;

        // Ensure all required fields are provided
        if (!name || name.length < 1 || !lat || !lon || !address) {
            return res.status(400).json({ message: "All fields (name, lat, lon, address) are required" });
        }

        const user = new User({ name, lat, lon, address });
        await user.save();
        return res.status(201).json({ message: "User created successfully", user });

    } catch (error) {
        console.log("errro coming")
        console.error(" Error in createUser:", error);  // Log error to console
        res.status(500).json({ error: error.message });
    }
};

// Get users whose full name matches or starts with given letters
export const getUsers = async (req, res) => {

    try {
        const keyValue = req.params.key; // Get the filter from query params

        // If no name is provided, return an error
        if (!keyValue || keyValue.length < 1) {
            return res.status(400).json({ message: "Data is required to fetch users" });
        }

        let result = await User.find(
            {
                "$or": [
                    {name: {$regex: keyValue}},
                    {address: {$regex: keyValue}}
                ]
            }
        ).sort({name: 1});

        if (result.length > 0) {
            return res.json(result);
        }

        return res.status(404).json({ message: "No users found with the specified name filter" });

    } catch (error) {
        console.error(" Error in getUsers:", error);  // Log error to console
        res.status(500).json({ error: error.message });
    }
};
