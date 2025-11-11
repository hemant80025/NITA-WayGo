var jwt = require("jsonwebtoken");
require("dotenv").config();

const fetchUser = async (req, res, next) => {

    const jwtToken = req.headers.authorization;

    if (!jwtToken) {
        res.status(401).json({
            error: "Please verify with correct authorize token",
        });
    } else {
        try {
            const jwtSuccess = jwt.verify(jwtToken, process.env.SECRET_KEY);
            req.user = jwtSuccess.user;
            next();
        } catch (error) {
            res.status(401).json({
                error: "Please verify with correct authorize token!",
            });
        }
    }
};

module.exports = fetchUser;
