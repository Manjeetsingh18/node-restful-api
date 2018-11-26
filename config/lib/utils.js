import redis from 'redis';
import { isEmpty, isNull, merge, isEqual } from 'lodash';
import config from '../env';
import jwt from 'jsonwebtoken';

const client = redis.createClient(config.REDIS_URL),
  TOKEN_EXPIRATION_SEC = 7 * 24 * 60 * 60;

client.on('error', (err) => {
  console.log(err);
});

client.on('connect', () => {
  console.log("Redis successfully connected");
});

const getTokenFromClientRequest = (headers) => {
  if (headers.authorization && headers.authorization.split(' ')[0] === 'JWT') {
    return headers.authorization.split(' ')[1];
  } else {
    return null;
  }
};

export const tokenize = (user) => {
  return new Promise((resolve, reject) => {
    if (isEmpty(user)) {
      return reject(new Error('User data cannot be empty.'));
    }
    user.salt = undefined;
    user.password = undefined;
    let data = {
      user,
      token: jwt.sign({ email: user.email, _id: user._id }, config.secret, {
        expiresIn: TOKEN_EXPIRATION_SEC,
      })
    };

    var decoded = jwt.decode(data.token);
    data.token_exp = decoded.exp;
    data.token_iat = decoded.iat;

    // save in redis
    client.set(data.token, JSON.stringify(data), (err, response) => {
      if (err) return reject({ message: new Error(err) });

      client.expire(data.token, TOKEN_EXPIRATION_SEC, (err, response1) => {
        if (err) return reject({ message: new Error("Can not set the expire value for the token key") });
        return resolve(data);
      });
    });
  })
};

const retrieve = (id) => {
  return new Promise((resolve, reject) => {
    if (isNull(id)) return reject("invalid token");

    client.get(id, (err, response) => {
      if (err) {
        return reject(err);
      } else {
        var data = JSON.parse(response);
        if (!isEmpty(data) && isEqual(data.token, id)) {
          return resolve(data);
        } else {
          return reject("token doesnt exist");
        }

      }
    });
  });

};

const verify = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.secret, { ignoreExpiration: true }, (err, decode) => {
      if (err) return reject("invalid token");

      retrieve(token)
        .then(data => resolve(data))
        .catch(e => reject(e));
    });
  });
};

export const expire = (headers) => {
  return new Promise((resolve, reject) => {
    const token = getTokenFromClientRequest(headers);
    if (token !== null) {
      client.expire(token, 0, (err, response) => {
        if (err) {
          return reject(err);
        } else {
          return resolve(null);
        }
      });
    } else {
      return resolve('Invalid token')
    }
  });
};

export const verifyMiddleware = function(headers) {
  const token = getTokenFromClientRequest(headers);
  if (token == (null || undefined)) return Promise.reject('unauthorized user');
  return verify(token);
};
