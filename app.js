const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/post");
const userRoutes = require("./routes/user")

const app = express();

mongoose.connect(process.env.MONGODB_URI, {  useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => {
    console.log("Database connection established successfully.")
  })
  .catch(() => {
    console.log("Database connection failure.")
  });
mongoose.set("useCreateIndex", true);

app.use("/images", express.static(path.join("images")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : true
}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes)


module.exports = app;
