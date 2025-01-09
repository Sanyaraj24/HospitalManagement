const express = require("express");

//import controllers
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
} = require("../controllers/doctorCtrl");
const router = express.Router();

//ROUTER TO GET DOCTORS PROFILE
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST || UPDATE DOCTOR PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

//POST | GET A SINGLE DCOTOR INFO FOR BOOKING
// GET request for fetching a single doctor's information
router.get("/getDoctorById/:doctorId", authMiddleware, getDoctorByIdController);

module.exports = router;
