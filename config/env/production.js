module.exports = {
  env: 'production',
  port: process.env.PORT || 5000,
  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGODB_URI,
  },
  secret: process.env.SECRET || 'ENCRYPTED_KEY',
  mailer: {
    from: process.env.MAILER_FROM,
    options: {
      host: 'smtp.gmail.com',
      port: 465,
      service: process.env.MAILER_SERVICE_PROVIDER || 'Gmail',
      auth: {
        user: process.env.MAILER_EMAIL_ID,
        pass: process.env.MAILER_PASSWORD
      }
    }
  }
};
