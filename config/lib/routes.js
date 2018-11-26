import articles from '../../api/articles/routes';
import users from '../../api/users/routes';

export default function(app, io) {
  articles(app, io);
  users(app, io);
};
