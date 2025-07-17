const connectToMongo = require("./db");
require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();

const startServer = async () => {
  try {
    const port = process.env.PORT || 5000;
    await connectToMongo();
    app.use(cors());

    app.use("/api/authUser", require("./routes/authUser"));

    app.use("/api/authAdmin", require("./routes/authAdmin"));

    app.use("/api/admin",require("./routes/admin"));

    app.use("/api/user",require("./routes/user"));

    app.get("/", (req, res)=>{
      return res.send("Backend is running for NITA-WayGo")
    })

    app.get(/(.*)/, (req, res) => {
      res.status(404).json({ error: "NOT FOUND!" });
    });

    app.listen(port, ()=>{
      console.log(`Server running on http://localhost:${port}`)
    })

  } catch(error){
    console.log(error);
  }
};

startServer();
