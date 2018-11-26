import comments from '../controllers/comments';

export default function commentRoutes(app) {
  app.route('/comments/:commentId')
    .get(comments.getComment)
    .put(comments.updateComment)
    .delete(comments.removeComment);

  app.param('commentId', comments.loadCommentById);

};
