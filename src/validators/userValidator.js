var { Segments, Joi, celebrate } = require('celebrate');
const { cities } = require('../utils/validators');

module.exports = {
  logIn: celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().max(50).required().killHtml(),
      password: Joi.string().min(8).required().killHtml(),
    }),
  }),

  signUp: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().min(8).max(25).required().killHtml(),
      name: Joi.string().min(8).required().killHtml(),
      email: Joi.string().min(8).required().killHtml(),
      password: Joi.string().min(8).required().killHtml(), 
      confirmpassword: Joi.string().min(8).required().killHtml(), 
      birthDay: Joi.string().min(10).max(10).required().killHtml(), //TODO: Validate date
      country: cities.required(),
    }),
  }),
}