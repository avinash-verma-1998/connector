const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/user", userRoutes);

app.use((req, res) => {
  res.send("<h1>Page not found</h1> ");
});
const PORT = process.env.PORT || 5000;

mongoose
  .connect("mongodb://localhost:27017/app-test", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(res => {
    console.log("connected to database");
    app.listen(PORT, () => {
      console.log(`server is up and running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });
