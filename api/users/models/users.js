import mongoose from 'mongoose';
import crypto from 'crypto';
import httpStatus from 'http-status';
import APIError from '../../helpers/error';
const Schema = mongoose.Schema;

/**
 * User Schema
 */
const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: 'Please fill in your full name'
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    default: '',
    match: [/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please fill a valid email address']
  },
  password: {
    type: String,
    required: true,
    default: ''
  },
  provider: {
    type: String
  },
  profile_picture: {
    type: String,
    default: ''
  },
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user']
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  salt: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
});

/**
 * pre save hook for password hash
 */
UserSchema.pre('save', function(next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * pre validate hook for password strength
 */
UserSchema.pre('validate', function(next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{7,20})/;
    const passwordValidity = pattern.test(this.password);
    if (!passwordValidity) {
      const error = "Please ensure your password is more than 7 characters, has an uppercase character, and a number";
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 100000, 64, 'sha512').toString('base64');
  } else {
    return password;
  }
};

/**
 * method for password authentication
 */
UserSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get a user
   */

  get(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return Promise.reject("Invalid User Id");

    return this.findById(id)
      .exec()
      .then((user) => {
        if (user) {
          return user;
        }
        const err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'created' timestamp.
   */
  list({ skip = 0, limit = 50, ...query } = {}) {
    return this.find(query)
      .sort({ created: 1 })
      .skip((+skip) * (+limit))
      .limit(+limit)
      .exec();
  }
};

export default mongoose.model('User', UserSchema);
