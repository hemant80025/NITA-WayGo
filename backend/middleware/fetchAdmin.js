var jwt = require("jsonwebtoken");
require("dotenv").config();

const fetchAdmin = async (req, res, next) => {

    const jwtToken = req.headers.authorization;

    if (!jwtToken) {
        res.status(401).json({
            error: "Please verify with correct authorize token",
        });
    } else {
        try {
            const jwtSuccess = jwt.verify(jwtToken, process.env.SECRET_KEY);
            req.admin = jwtSuccess.admin;
            next();
        } catch (error) {
            res.status(401).json({
                error: "Please verify with correct authorize token!",
            });
        }
    }
};

module.exports = fetchAdmin;
