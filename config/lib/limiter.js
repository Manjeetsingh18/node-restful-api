import { RateLimiter } from 'limiter';

let limiter = new RateLimiter(150, 'hour');

export default () => {
  return (req, res, next) => {
    limiter.removeTokens(1, (err, remainingRequests) => {
      if (!err) {
          next()
      } else {
        return res.status(422).json({message: 'Error several hit comiing from your IP'});
      }
    });
  }
}