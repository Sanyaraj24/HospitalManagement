const {
  getAllUsersController,
  getAllDoctorsController,
  changeAccountStatusController,
} = require("../controllers/adminCtrl");
const authMiddleware = require("../middlewares/authMiddleware");

const express = require("express");
const router = express.Router();

//GET METHOD || GET ALL USERS
router.get("/getAllUsers", authMiddleware, getAllUsersController);

//GET METHOD || GET ALL DOCTORS LIST
router.get("/getAllDoctors", authMiddleware, getAllDoctorsController);

//POST METHOD || CHANGE ACCOUND STATUS
router.post(
  "/changeAccountStatus",
  authMiddleware,
  changeAccountStatusController
);

module.exports = router;
