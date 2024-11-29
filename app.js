const express = require("express");
const dotenv = require("dotenv");
const personRoutes = require("./routes/person");

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).json({ message: "Welcome to the API" });
});
app.use("/api/person", personRoutes);

module.exports = app;
