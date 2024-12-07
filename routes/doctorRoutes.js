const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  getDoctorInfoController,
  updateProfileController,
} = require("../controllers/doctorCtrl");
const router = express.Router();

//ROUTER TO GET DOCTORS PROFILE
router.post("/getDoctorInfo", authMiddleware, getDoctorInfoController);

//POST || UPDATE DOCTOR PROFILE
router.post("/updateProfile", authMiddleware, updateProfileController);

module.exports = router;
