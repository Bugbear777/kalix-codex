const express = require("express");
const path = require("path");
const session = require('express-session');
const connectMongo = require('connect-mongo');
const MongoStore = connectMongo.default || connectMongo;
require("dotenv").config();

const { connectToDatabase } = require("./data/database");

const indexRoutes = require("./routes/index");
const ancestryRoutes = require("./routes/ancestries");
const authRoutes = require('./routes/auth');
const accountRoutes = require("./routes/account");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24
    }
  })
);

app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});

app.use("/", indexRoutes);
app.use('/', authRoutes);
app.use("/", accountRoutes);
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