import users from '../controllers/users';
import auth from '../controllers/auth';
import { isAdmin } from '../../helpers/authorization';

export default function userRoutes(app) {
  app.route('/users')
    .get(isAdmin, users.listUsers);

  app.route('/users/:userId')
    .get(isAdmin, users.getUser)
    .delete(isAdmin, users.removeUser);

  app.route('/me/changePassword')
    .post(auth.changePassword);

  app.route('/me')
    .get(users.me)
    .put(users.updateUser);

  app.param('userId', users.loadUserById);

};
