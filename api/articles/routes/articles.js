import articles from '../controllers/articles';
import comments from '../controllers/comments';

export default function articleRoutes(app) {
  app.route('/articles')
    .get(articles.listArticles)
    .post(articles.createArticle);

  app.route('/articles/:articleId')
    .get(articles.getArticle)
    .put(articles.updateArticle)
    .delete(articles.removeArticle);

  app.route('/articles/:articleId/comments')
    .post(comments.createComment);

  app.param('articleId', articles.loadArticleById);

};
