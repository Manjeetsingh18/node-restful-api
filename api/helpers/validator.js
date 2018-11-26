import Joi from 'joi';

const emailValidation = Joi.string().regex(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/).required();

export default {
  // POST /auth/register
  createUser: {
    body: {
      password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
      email: emailValidation,
      fullName: Joi.string().required()
    }
  },
  
  // POST /auth/login
  login: {
    body: {
      email: emailValidation,
      password: Joi.string().required()
    }
  },

};
