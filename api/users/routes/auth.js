import auth from '../controllers/auth';
import validate from 'express-validation';
import validatorParam from '../../helpers/validator';

export default function coreRoutes(app) {
  app.route('/auth/login').post(validate(validatorParam.login), auth.login);
  app.route('/auth/register').post(validate(validatorParam.createUser), auth.register);

  app.route('/auth/forgotPassword').post(auth.forgotPassword);
  app.route('/auth/resetPassword').post(auth.resetPassword);

  app.route('/auth/sign_out').get(auth.signOut);
};
