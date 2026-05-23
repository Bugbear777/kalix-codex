const express = require("express");
const path = require("path");
require("dotenv").config();

const { connectToDatabase } = require("./data/database");

const indexRoutes = require("./routes/index");
const ancestryRoutes = require("./routes/ancestries");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", indexRoutes);
app.use("/ancestries", ancestryRoutes);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Kalix Codex running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });