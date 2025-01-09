const doctorModel = require("../models/doctorModel");

const getDoctorInfoController = async (req, res) => {
  try {
    //get doctor from doctorModel based on userID
    const doctor = await doctorModel.findOne({ userId: req.body.userId });
    res.status(200).send({
      success: true,
      message: "Doctor data has been Fetched!",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in Fetching Doctor Details",
    });
  }
};

//after making controller--add in server.js file

//CONTROLLER TO UPDATE DOCTORS PROFILE
const updateProfileController = async (req, res) => {
  try {
    //updating doctor
    //doctor model se find doctor
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.body.userId },
      req.body
    );
    res.status(201).send({
      success: true,
      message: "Doctor's Profile Updated!!",
      data: doctor,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Doctor Profile Update issue",
    });
  }
};

//TO BOOK A DOCTOR BY ID
const getDoctorByIdController = async (req, res) => {
  try {
    // Fetch the doctor using the ID from route params
    const doctor = await doctorModel.findOne({ _id: req.params.doctorId }); // Use req.params to access the dynamic route parameter
    if (!doctor) {
      return res.status(404).send({
        success: false,
        message: "Doctor not found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Doctor's Booking Page",
      data: doctor,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error while fetching Doctor Booking",
    });
  }
};

module.exports = {
  getDoctorInfoController,
  updateProfileController,
  getDoctorByIdController,
};
