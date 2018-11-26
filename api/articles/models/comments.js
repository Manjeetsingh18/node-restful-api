import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/error';

const Schema = mongoose.Schema;

/**
 * Comment Schema
 */
const CommentSchema = new mongoose.Schema({
  content: {
    type: String,
    trim: true,
    required: 'Please enter the article content'
  },  
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  updated: {
    type: Date
  },
  status: {
    type: String,
    default: 'AWAITING_APPROVAL'
  },
  created: {
    type: Date,
    default: Date.now
  }
});

/**
 * Statics
 */
CommentSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Comment, APIError>}
   */

  get(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return Promise.reject("Invalid Comment Id");

    return this.findOne({ _id: id })
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
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<Comment[]>}
   */
  list({ skip = 0, limit = 50, ...query } = {}) {
    return this.find(query)
      .sort({ created: 1 })
      .skip((+skip) * (+limit))
      .limit(+limit)
      .exec();
  }
};

export default mongoose.model('Comment', CommentSchema);
