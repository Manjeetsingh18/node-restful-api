import Promise from 'bluebird';
import mongoose from 'mongoose';
import config from './config/env';
import server from './config/lib/express';

mongoose.Promise = Promise;

// export default function() { uncomment this line and the last line to use cluster
mongoose.connect(config.db.uri, { useNewUrlParser: true })
  .then(
    () => {
      server.listen(config.port, () => {
        console.log(`server started on port ${config.port} ${config.env}`);
      })
    },
    (err) => { console.log(`Error connecting to mongodb`); }
  );
// }
