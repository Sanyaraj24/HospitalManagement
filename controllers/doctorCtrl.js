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
      message: "Error in Fetching Doctor Details",
    });
  }
};
module.exports = { getDoctorInfoController, updateProfileController };
