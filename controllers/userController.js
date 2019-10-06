const User = require('../models/user');
const { secret } = require('../utils/keys');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const { sendgridApiKey } = require('../utils/keys');

//configure transporter for email

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: sendgridApiKey
    }
  })
);

exports.signUpUser = (req, res, next) => {
  const signUpData = {};
  // hash the password first
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      res.status(500).json({ error: 'cannot register now tryagain later!' });
    } else {
      (signUpData.name = req.body.name),
        (signUpData.email = req.body.email),
        (signUpData.username = req.body.username),
        (signUpData.password = hash);
      User.findOne({ email: signUpData.email }).then(user => {
        if (user) {
          res.status(406).json({ error: 'email already exist' });
        } else {
          const newUser = new User(signUpData);
          newUser
            .save()
            .then(user => {
              if (!user) {
                res.json({
                  error: 'no user created'
                });
              }
              // transporter.sendMail({
              //   to:user.email,
              //   from:'my@social-app.com',
              //   subject:'You signed up',
              //   html:"<h1>Welcome to this social website!!!</h1>"

              // })
              res.json(user);
            })
            .catch(err => {
              console.log(err);
            });
        }
      });
    }
  });
};

exports.loginUser = (req, res, next) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(400).json({ email: 'email not found' });
    }
    // compare passwords
    bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: 'try again!' });
      } else if (!isMatch) {
        return res.status(400).json({ password: 'passwords incorrect' });
      } else if (isMatch) {
        // sign a jwt
        const payload = {
          id: user._id,
          name: user.name,
          username: user.username,
          email: user.email
        };
        jwt.sign(payload, secret, { expiresIn: '6h' }, (err, token) => {
          if (err) {
            console.log(err);
            return res.status(500);
          } else {
            res.json({
              email: user.email,
              username: user.username,
              id: user.id,
              name: user.name,
              token: `Bearer ${token}`
            });
          }
        });
      }
    });
  });
};

// implement reset password routes
exports.sendEmail = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.status(500).json({ error: 'crypto error' });
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(400).json({
            error: "email dosen't exists"
          });
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then(user => {
        res.json(user);
        transporter
          .sendMail({
            to: req.body.email,
            from: 'my@social-app.com',
            subject: 'Reset Password',
            html: `
            <h2> Reset password</h2>
            <p> click the link bellow to reset your password
            </p>
            <a href="${process.env.PORT}/user/reset/${token}">Reset password</a>
            `
          })
          .then(res => {
            console.log(res);
          });
      })
      .catch(err => {
        console.log(err);
      });
  });
};
exports.resetPassword = (req, res) => {
  User.findOne({ resetToken: req.params.token })
    .then(user => {
      if (!user) {
        return res.status(400).json({ error: 'no token found' });
      } else {
        // check for expiration
        if (!user.resetTokenExpiration > Date().now) {
          return res.json({ error: 'token expired' });
        } else {
          // reset password here
          //hash the password again
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
              res
                .status(500)
                .json({ error: 'cannot reset now tryagain later!' });
            } else {
              user.password = hash;
              user
                .save()
                .then(user => {
                  res.json(user);
                })
                .catch(err => {
                  console.log(err);
                });
            }
          });
        }
      }
    })
    .then(err => {
      console.log(err);
    });
};

exports.getUserById = (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.log(err);
    });
};
exports.updateUser = (req, res, next) => {
  const updateData = {};
  // hash the password first

  if (req.body.email) updateData.email = req.body.email;
  if (req.body.name) updateData.name = req.body.name;
  if (req.body.username) updateData.username = req.body.username;

  User.updateOne({ _id: req.user.id }, { $set: updateData })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      console.log(err);
    });
};
