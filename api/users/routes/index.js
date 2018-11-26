import AuthRoutes from './auth';
import UserRoutes from './users';

export default function routes(app, io) {
  AuthRoutes(app);
  UserRoutes(app);
};