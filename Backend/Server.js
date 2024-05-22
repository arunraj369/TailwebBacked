require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 8000;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const session = require("express-session");
const User = require("./Models/UserModel");
const authRoutes = require("./Routes/authRoutes");
const data = require("./Routes/RoutesPage");

mongoose
  .connect("mongodb://localhost:27017/StudentDB")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json({ extended: false }));
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Routes
app.use("/api", data);
app.use("/auth", authRoutes);

// app.use("/", (req, res) => {
//   res.send("Hello");
// });

app.listen(PORT, (req, res) => {
  console.log(`Server working on http://localhost:${PORT}`);
});
