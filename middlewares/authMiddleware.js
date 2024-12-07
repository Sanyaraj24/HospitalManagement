//AUTH MIDDLEWARE

const JWT = require("jsonwebtoken");
//token data--->in request header
//form data-->in body
module.exports = async (req, res, next) => {
  try {
    //ex--> token=Bearer fjekjfefojfeiovjefio
    const token = req.headers["authorization"].split(" ")[1];
    JWT.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(200).send({ success: false, message: "Auth failed" });
      } else {
        //decoding user id
        req.body.userId = decode.id;
        next();
      }
    });
  } catch (error) {
    console.log(error);
    res.status(401).send({ success: false, message: "Auth failed" });
  }
};
