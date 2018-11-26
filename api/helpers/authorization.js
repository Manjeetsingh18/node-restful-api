const hasAdminRight = (user) => (user && user.roles.indexOf('admin') !== -1);

export const isAdmin = (req, res, next) => {
  if (hasAdminRight(req.user)) {
    next();
  } else {
    return res.status(401).json({ message: 'Unauthorized user!' });
  }
};

export const isAllowed = (user, { author: { _id: author } }) => ((user._id.toString() === author.toString()) || hasAdminRight(user));
