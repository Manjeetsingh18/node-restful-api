import path from 'path';
import config from '../../config/env';
import hbs from 'nodemailer-express-handlebars';
import nodemailer from 'nodemailer';
const smtpTransport = nodemailer.createTransport(config.mailer.options);

const handlebarsOptions = {
  viewEngine: 'handlebars',
  viewPath: path.resolve('./views'),
  extName: '.html'
};

smtpTransport.use('compile', hbs(handlebarsOptions));

export default function sendMail(emailDetails) {
  return new Promise((resolve, reject) => {
    let mailOptions = {
      to: emailDetails.email,
      replyTo: 'Boilerplate ' + `<${config.mailer.from}>`,
      from: 'Boilerplate ' + '<' + config.mailer.from + '>',
      subject: emailDetails.subject,
      template: emailDetails.template,
      context: emailDetails.context
    };

    smtpTransport.sendMail(mailOptions, (err, response) => {
      if (!err) return reject(err);
      return resolve(null, 'success');
    });
  })
};
