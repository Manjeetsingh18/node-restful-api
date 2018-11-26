import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from '../../helpers/error';

const Schema = mongoose.Schema;

/**
 * Article Schema
 */
const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: 'Please enter the article title'
  },
  content: {
    type: String,
    trim: true,
    required: 'Please enter the article content'
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: {
    type: Array,
    default: []
  },
  status: {
    type: String,
    default: 'AWAITING_APPROVAL'
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  image_url: {
    type: Array,
    default: []
  }
});

/**
 * Statics
 */
ArticleSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<Article, APIError>}
   */

  get(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) return Promise.reject("Invalid Article Id");

    return this.findOne({ _id: id })
      .populate('author', 'fullName profile_picture')
      .populate({
        path: "comments",
        match: { status: 'APPROVED' },
        model: "Comment",
        select: 'author, content, created, updated status',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName profile_picture'
        }
      })
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
   * @returns {Promise<Article[]>}
   */
  list({ skip = 0, limit = 50, ...query } = {}) {
    return this.find(query)
      .populate('author', 'fullName profile_picture')
      .populate({
        path: "comments",
        match: { status: 'APPROVED' },
        model: "Comment",
        select: 'author, content, created, updated status',
        populate: {
          path: 'author',
          model: 'User',
          select: 'fullName profile_picture'
        }
      })
      .sort({ created: 1 })
      .skip((+skip) * (+limit))
      .limit(+limit)
      .exec();
  }
};

export default mongoose.model('Article', ArticleSchema);
