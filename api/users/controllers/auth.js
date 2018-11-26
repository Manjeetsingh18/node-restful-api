/**
 * Authentication controller
 */
import mongoose from 'mongoose';
import crypto from 'crypto';
import { isEmpty } from 'lodash';
import { tokenize, expire } from '../../../config/lib/utils';
import config from '../../../config/env';
import User from '../models/users';
import error from '../../helpers/mongoose-error';
import sendMail from '../../helpers/email';


/**
 * logs a user in 
 */
const login = (req, res) => {
  return User.findOne({ email: req.body.email.toLowerCase() })
    .then(user => isEmpty(user) ? Promise.reject(`No account with ${req.body.email} found.`) : user)
    .then(user => user.authenticate(req.body.password) ? tokenize(user) : Promise.reject('Invalid Password'))
    .then(response => res.json(response))
    .catch(e => res.status(400).json({ message: e }));
};

/**
 * Registers a new user
 */
const register = async(req, res, next) => {
  const body = req.body;
  body.provider = 'local';
  const newUser = new User(body);
  newUser.save()
    .then(user => tokenize(user))
    .then(response => res.json(response))
    .catch(e => res.status(422).json(error(e)))
};

/**
 * Forgot for reset password
 */
const forgotPassword = async(req, res) => {

  let token = await generateToken();
  User.findOne({
      email: req.body.email.toLowerCase()
    }, { "salt": 0, "password": 0 }).exec()
    .then(user => {
      if (isEmpty(user)) return Promise.reject('No account with that email has been found');
      if (user.resetPasswordExpires > Date.now()) {
        token = user.resetPasswordToken;
      }
      return User.update({ _id: user._id }, { $set: { resetPasswordToken: token, resetPasswordExpires: Date.now() + 604800000 } });
    })
    .then(response => res.json({ token }))
    .catch(e => res.status(422).json(err));

};


/**
 * Reset password
 */
const resetPassword = (req, res) => {
  User.findOne({
      resetPasswordToken: req.body.token,
      resetPasswordExpires: {
        $gt: Date.now()
      }
    }).exec()
    .then(user => {
      if (isEmpty(user)) return Promise.reject('Password reset token is invalid or has expired.');
      user.password = req.body.password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      return user.save();
    })
    .then(newUser => tokenize(newUser))
    .then(response => res.json(response))
    .catch(e => res.status(422).json({ message: e }));
};

/**
 * Change Password
 */
const changePassword = (req, res, next) => {
  const passwordDetails = req.body;
  User.findById({ _id: req.user._id }).exec()
    .then(user => {
      if (isEmpty(user)) return Promise.reject('User is not found');
      if (!user.authenticate(passwordDetails.currentPassword)) return Promise.reject('Current password is incorrect');
      user.password = passwordDetails.newPassword;
      return user.save()
    })
    .then(newUser => tokenize(newUser))
    .then(response => res.json(response))
    .catch(e => res.status(422).json({ message: e }));
};

/**
 * Signs out a user
 */
const signOut = (req, res) => {
  return expire(req.headers)
    .then(data => res.json({ message: 'user signed out' }))
    .catch(e => res.status(400).json({ message: 'Error signing out' }));

};

function generateToken(randomByteLength = 24) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(randomByteLength, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });
}

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
  changePassword,
  signOut
}
