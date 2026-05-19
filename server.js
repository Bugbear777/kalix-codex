const express = require("express");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const indexRoutes = require("./routes/index");
app.use("/", indexRoutes);

app.use((req, res) => {
  res.status(404).render("pages/404", {
    title: "Page Not Found | Kalix Codex",
  });
});

app.listen(PORT, () => {
  console.log(`Kalix Codex running on port ${PORT}`);
});