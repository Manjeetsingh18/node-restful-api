import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import compress from 'compression';
import helmet from 'helmet';
import methodOverride from 'method-override';
import cors from 'cors';
import http from 'http';
import expressValidation from 'express-validation';
import routes from './routes';
import config from '../env';
import path from 'path';
import httpStatus from 'http-status';
import APIError from '../../api/helpers/error';
import middleware from './middleware';
import limiter from './limiter';
import socketIo from 'socket.io';

const app = express();

app.use(helmet());
if (config.env === 'development') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());
app.use(methodOverride());

app.use(cors());

app.use(middleware().unless({ path: [/^\/auth\/.*/] }));
app.use(limiter());

let server = http.createServer(app);
let io = socketIo(server);

routes(app, io);

app.use((err, req, res, next) => {

  if (err instanceof expressValidation.ValidationError) {
    const errorMessages = err.errors.map(error => error.messages.join('. ')).join(', ');
    const apiError = new APIError({ message: errorMessages.toString().replace(/(: .*\/)|(\")/gi, ''), status: 419 });
    return next(apiError);
  } else
  if (!(err instanceof APIError)) {
    const apiError = new APIError(err, err.status);
    return next(apiError);
  }
  return next(err);
});


app.use((req, res, next) => {
  const err = new APIError({ message: 'API not found', status: 404 });
  return next(err);
});


app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    stack: config.env === 'development' ? err.stack : undefined
  });
});

export default server;
