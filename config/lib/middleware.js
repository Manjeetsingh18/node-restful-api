import { verifyMiddleware } from './utils';
import unless from 'express-unless';
import { merge } from 'lodash';

export default function() {
  var middlewareFunction = (req, res, next) => {
    return verifyMiddleware(req.headers)
      .then((data) => {
        req.user = merge(req.user, data).user;
        next();
      })
      .catch((err) => res.status(401).json({ message: err || 'unauthorised user' }))
  };

  middlewareFunction.unless = unless;

  return middlewareFunction;

};
