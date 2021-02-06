require('dotenv').config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = (req, res) =>{
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()
        .then(result => {
          res.status(201).json({
            message: "New User created",
            result: result
          })
        })
        .catch(err => {
          res.status(500).json({
            message: err._message
          })
        })
    });
}

exports.userLogin = (req, res) => {
  let foundUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication failure"
        });
      }
      foundUser = user;
      return bcrypt.compare(req.body.password, user.password)
    })
    .then(result => {
        if (!result) {
          return res.status(401).json({
            message: "Authentication failure"
          })
        }
        const token = jwt.sign(
            {email: foundUser.email, userId: foundUser._id},
            process.env.TOKEN_KEY,
            {expiresIn: "1h"}
          );
          res.status(200).json({
            token: token,
            expires: 3600,
            userId: foundUser._id
          })
        })
        .catch (err => {
           return res.status(401).json({
            message: "Authentication failure"
          })
         });

}
