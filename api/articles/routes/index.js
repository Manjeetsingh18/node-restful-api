import ArticleRoutes from './articles';
import CommentRoutes from './comments';

export default function routes(app, io) {
  ArticleRoutes(app);
  CommentRoutes(app);
};