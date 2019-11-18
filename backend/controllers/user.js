const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  // Bcrypt will hash the password for us, 10 is a random number ( higher is more secure),
  // this method is asynchronous so we will create the user in a promise
    bcrypt.hash(req.body.password, 10).then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({
            message: "User created!",
            result: result
          });
        })
        .catch(err => {
          res.status(500).json({
              message: 'Invalid authentification credentials!'
          });
        });
    });
  }

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  // Search in the database for a unique user
  User.findOne({ email: req.body.email })
    .then(user => {
// if the user does'nt exist, authentification is denied
      if (!user) {
        return res.status(401).json({
          message: "Invalid authentification credentials!"
        });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      // jsonwebtoken (Jwt) will create a token containing a object that will be returned to the client, using a encryption phrase
        const token = jwt.sign(
        { email: fetchedUser.email, userId: fetchedUser._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({
        token: token,
        userId: fetchedUser._id,
        expiresIn: 3600 // send the duration of the token in seconds
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
}
