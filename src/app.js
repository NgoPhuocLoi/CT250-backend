const express = require("express");
const {
  handleNotFoundRoute,
  errorHandler,
} = require("./middlewares/errorHandler");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", require("./routes"));
app.use(handleNotFoundRoute);
app.use(errorHandler);

module.exports = app;
