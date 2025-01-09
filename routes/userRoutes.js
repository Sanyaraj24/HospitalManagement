const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
  getAllDoctorsController,
  bookAppointmentController,
  bookingAvailabilityController,
  userAppointmentsController,
} = require("../controllers/userCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

//router object
const router = express.Router();

//routes------>
//Login || post method
router.post("/login", loginController);
//Register || post method
router.post("/register", registerController);

//AUTH || POST || to getUserdata
router.post("/getUserData", authMiddleware, authController);

//to apply as doctor || POST
router.post("/apply-doctor", authMiddleware, applyDoctorController);

//notification || POST
router.post(
  "/get-all-notification",
  authMiddleware,
  getAllNotificationController
);

//delete notification
router.post(
  "/delete-all-notification",
  authMiddleware,
  deleteAllNotificationController
);

//ON HOME PAGE--DISPLAY LIST OF DOCTORS
//GET ALL DOCTORS
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//FOR USER TO BOOK AN APPOINTMENT
router.post("/book-appointment", authMiddleware, bookAppointmentController);

//FOR CHECKING AVAILABILITY
router.post(
  "/booking-availability",
  authMiddleware,
  bookingAvailabilityController
);

//Appointment List
router.get("/user-appointments", authMiddleware, userAppointmentsController);

module.exports = router;
