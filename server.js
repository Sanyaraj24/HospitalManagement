const express = require("express");
const colors = require("colors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
//dotenv config
dotenv.config();

//mongodb connection
connectDB();

//rest object
const app = express();

//middlewares
app.use(express.json());
app.use(morgan("dev"));

//routes for testing
/*app.get("/", (req, res) => {
  res.status(200).send({
    message: "server running",
  });
});*/
//app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//routes--
app.use("/api/v1/user", require("./routes/userRoutes"));
//admin routes--
app.use("/api/v1/admin", require("./routes/adminRoutes"));
//DOCTOR ROUTER--
app.use("/api/v1/doctor", require("./routes/doctorRoutes"));

//static files
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

const port = process.env.PORT || 5000;
//listen port
app.listen(port, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV} Mode on port ${process.env.PORT}`
      .bgCyan.white
  );
});
