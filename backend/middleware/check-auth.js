const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports = (req,res,next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log("Token in check auth",token);
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next();
  } catch (error) {
    res.status(401).json({ message : 'You are not authentificated!'});
  }
};
