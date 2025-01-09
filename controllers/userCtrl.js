const userModel = require("../models/userModels");
//bcrypt-uses the bcrypt algorithm, which applies hashing and salting, making it more secure for storing passwords.
const bcrypt = require("bcryptjs");
//token
const jwt = require("jsonwebtoken");
//import doctor model
const doctorModel = require("../models/doctorModel");
const appointmentModel = require("../models/appointmentModel");
const moment = require("moment");

//register callback
const registerController = async (req, res) => {
  try {
    const existingUser = await userModel.findOne({ email: req.body.email });
    //Existing user
    if (existingUser) {
      return res
        .status(200)
        .send({ success: false, message: "User already exists!" });
    }

    //User doesnot exist
    const password = req.body.password;
    //using brcypt js
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    req.body.password = hashedPassword;
    //replace the user password with hashed password
    const newUser = new userModel(req.body);
    //save newUser
    await newUser.save();
    res.status(201).send({ success: true, message: "Registered successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: `Register Controller${error.message}` });
  }
};
//login callback
//when we login--we get authorized to a token
const loginController = async (req, res) => {
  try {
    //check if email exist in our database
    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User not found" });
    }
    //check the password
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ success: false, message: "Invalid email or password" });
    }
    //generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res
      .status(200)
      .send({ success: true, message: "Login successfully!", token });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: `Error in Login ${error.message}` });
  }
};
//To receieve request and response
const authController = async (req, res) => {
  try {
    //getting user
    const user = await userModel.findById({ _id: req.body.userId });
    //we need to hide the password
    user.password = undefined;
    //check if we find user
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "user not found!" });
    } else {
      res.status(200).send({
        success: true,
        data: user,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: "auth error" });
  }
};

//CONTROLLER TO APPLY AS A DOCTOR---get form data and store it in database
const applyDoctorController = async (req, res) => {
  try {
    const newDoctor = new doctorModel({ ...req.body, status: "pending" });
    await newDoctor.save();
    //Notify admin that we have got a request
    const adminUser = await userModel.findOne({ isAdmin: true });
    //notification comes from user
    //user comes adminUser
    const notification = adminUser.notification;
    notification.push({
      type: "apply-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has Applied for a Doctor AccounT`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
        //redirects to doctor list
        onClickPath: "/admin/doctors",
      },
    });
    await userModel.findByIdAndUpdate(adminUser._id, { notification });
    res.status(201).send({
      success: true,
      message: "Doctor Account Applied successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while applying for Doctor",
    });
  }
};

//NOTIFICATION CONTROOLLERR
const getAllNotificationController = async (req, res) => {
  try {
    //first get user--bcoz in user model we have notification(in user model)
    //finding user based on id
    const user = await userModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }
    const seennotification = user.seennotification;
    const notification = user.notification;
    //seen to unseen messages me push
    //seennotification.push(...notification);
    //empty the notification and add to the seen notification

    // Push unread notifications to seen notifications
    // Ensure no duplicates are added in case of any overlap
    notification.forEach((notif) => {
      if (!seennotification.some((seenNotif) => seenNotif._id === notif._id)) {
        seennotification.push(notif);
      }
    });

    user.notification = [];
    //user.seennotification = notification;
    const updatedUser = await user.save();
    res.status(200).send({
      success: true,
      message: "all Notification marked as read",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Error in notification",
      success: false,
      error,
    });
  }
};

//DELETE NOTIFICATION--->
const deleteAllNotificationController = async (req, res) => {
  try {
    //get user
    //find user based on the id
    const user = await userModel.findOne({ _id: req.body.userId });
    user.notification = [];
    user.seennotification = [];
    //update user
    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: "Notifications Deleted successfully!",
      data: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Unable to Delete notifications",
      error,
    });
  }
};

//GET ALL DOCTORS LIST ON USER PAGE
const getAllDoctorsController = async (req, res) => {
  try {
    const doctors = await doctorModel.find({ status: "approved" });
    res.status(200).send({
      success: true,
      message: "Doctors list fetched Successfully",
      data: doctors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while Fetching Doctors List",
    });
  }
};

//APPOINTMENT CONTROLLER
const bookAppointmentController = async (req, res) => {
  try {
    //Convert the received data to ISO format
    req.body.date = moment(req.body.date, "DD-MM-YY").toISOString();
    req.body.time = moment(req.body.time, "HH:mm").toISOString();
    //get the status
    req.body.status = "pending";
    const newAppointment = new appointmentModel(req.body);
    await newAppointment.save();

    //get the user and send the notification to doctor
    const user = await userModel.findOne({ _id: req.body.doctorInfo.userId });
    user.notification.push({
      type: "New-appointment-request",
      message: `A new Appointment Request from ${req.body.userInfo.name}`,
      //redirect path
      onClickPath: "/user/appointments",
    });
    await user.save();
    res.status(200).send({
      success: true,
      message: "Appointment Booked successfully!",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while Booking Appointment",
    });
  }
};
const bookingAvailabilityController = async (req, res) => {
  //Between Any Two Bookings keep a Time gap of 1hour.
  try {
    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    const appointments = await appointmentModel.find({
      doctorId,
      date,
      time: {
        $gte: fromTime,
        $lte: toTime,
      },
    });
    if (appointments.length > 0) {
      return res.status(200).send({
        message: "Appointments not Available at this time",
        success: true,
      });
    } else {
      return res.status(200).send({
        success: true,
        message: "Appointments Available!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Booking",
    });
  }
};

//APPOINTMENT LIST OF USERS---FOR DOCTORS
const userAppointmentsController = async (req, res) => {
  try {
    //get appointments
    const appointments = await appointmentModel.find({
      userId: req.body.userId,
    });
    res.status(200).send({
      success: true,
      message: "User Appointments Fetch Successfully!",
      data: appointments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching user Appointments.",
    });
  }
};
module.exports = {
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
};
