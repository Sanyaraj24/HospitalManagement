const express = require("express");
const {
  loginController,
  registerController,
  authController,
  applyDoctorController,
  getAllNotificationController,
  deleteAllNotificationController,
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

module.exports = router;
