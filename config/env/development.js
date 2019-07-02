module.exports = {
  env: 'development',
  db: {
    uri: 'mongodb+srv://LRest:LRest@cluster0-osap1.mongodb.net/test?retryWrites=true&w=majority'
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
