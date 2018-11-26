module.exports = {
  env: 'development',
  db: {
    uri: 'mongodb://' + (process.env.DB_1_PORT_27017_TCP_ADDR || 'localhost') + '/express-boilerplate'
  },
  port: process.env.PORT || 4000,
  secret: process.env.SECRET || 'ENCRYPTED_KEY',
  mailer: {
    from: process.env.MAILER_FROM || '',
    options: {
      host: 'smtp.gmail.com',
      port: 465,
      service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID || '',
        pass: process.env.MAILER_PASSWORD || ''
      }
    }
  },
};
