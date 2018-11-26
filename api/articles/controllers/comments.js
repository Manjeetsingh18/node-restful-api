import Article from '../models/articles';
import Comment from '../models/comments';
import config from '../../../config/env';
import error from '../../helpers/mongoose-error';
import { isAllowed } from '../../helpers/authorization';

/**
 * Load comment by Id.
 */
const loadCommentById = (req, res, next, id) => {
  Comment.get(id)
    .then(comment => {
      req.comment = comment;
      return next()
    }).catch(e => res.status(401).json(e));
};

/**
 * create a new comment
 */
const createComment = (req, res, next) => {
  req.body.author = req.user._id;
  const comment = new Comment(req.body);
  comment.save()
    .then(({ _id }) => Article.findByIdAndUpdate(req.params.articleId, { $push: { comments: _id } }))
    .then(response => res.json(comment))
    .catch(e => res.status(422).json(error(e)));
}

/**
 * Update existing comment
 */
const updateComment = (req, res, next) => {
  if (!isAllowed(req.user, req.comment)) return res.status(401).json({ message: 'Forbidden!' });

  let comment = req.body;
  comment.updated = Date.now();
  comment = Object.assign(req.comment, comment);

  comment.save()
    .then(response => res.json(response))
    .catch(e => res.status(422).json(error(e)));
}

/**
 * Delete comment.
 */
const removeComment = (req, res, next) => {
  if (!isAllowed(req.user, req.comment)) return res.status(401).json({ message: 'Forbidden!' });

  let comment = { status: 'VOID' };
  comment.updated = Date.now();
  comment = Object.assign(req.comment, comment);

  comment.save()
    .then(deletedComment => res.json(deletedComment))
    .catch(e => res.status(422).json(error(e)));
};

/**
 * Get comment list.
 */
const getComment = (req, res) => res.json(req.comment);

export default { loadCommentById, createComment, getComment, updateComment, removeComment };
