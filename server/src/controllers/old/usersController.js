import User from '../models/user';

/**
 * Fetch user firstnames
 */
export const fetchUsers = (req, res, next) => {
  console.log('fetchUsers');
  User.find({}, 'firstname', (err, users) => {
    if (err) { return next(err); }

    res.json(users);
  });
};

export const fetchUser = (token) => {
  console.log('fetchUser');
	console.log(token);
  const loggedUser = User.findOne({_id: token}, 'firstname', (err, users) => {
    if (err) { return next(err); }
    console.log(users);
    return users;
  });
};

export const fetchUserCount = (req, res, next) => {
  console.log('fetchUserCount');
  User.estimatedDocumentCount({}, function(err, count) {
    if (err) { return next(err); }
    console.log(count); // this will print the count to console
    res.json(count);
  });
};

