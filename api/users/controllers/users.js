import User from '../models/users';
import error from '../../helpers/mongoose-error';

/**
 * Load user by Id.
 */
const loadUserById = (req, res, next, id) => {
  User.get(id)
    .then(user => {
      req.user = user;
      return next()
    }).catch(e => res.status(422).json(e));
};

/**
 * Update existing user
 */
const updateUser = (req, res, next) => {
  let user = req.body;
  user.updated = Date.now();
  User.findOneAndUpdate({ _id: user._id }, user, { new: true })
    .then(response => res.json(response))
    .catch(e => res.status(422).json(error(e)));
}

/**
 * Delete user
 */
const removeUser = (req, res, next) => {
  User.findOneAndUpdate({ _id: req.user._id }, { isActive: false }).exec()
    .then(deletedUser => res.json(deletedUser))
    .catch(e => res.status(422).json(error(e)));
};

/**
 *  get signed in user.
 */
const me = (req, res, next) => {
  User.findById(req.user._id, { salt: 0, password: 0 }).exec()
    .then(user => res.json(user))
    .catch(e => res.status(422).json(error(e)));
};

/**
 * get in user.
 */
const getUser = (req, res, next) =>  res.json(req.user);

/**
 * Get user list.
 */
const listUsers = (req, res, next) => {
  User.list(req.query)
    .then(users => res.json(users))
    .catch(e => res.status(422).json(error(e)));
}

export default { loadUserById, listUsers, updateUser, removeUser, me, getUser };
