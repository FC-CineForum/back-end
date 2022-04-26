var { Segments, Joi, celebrate } = require('celebrate');
const { cities } = require('../utils/validators');

module.exports = {

  signUp: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().min(8).max(25).required(),
      biography: Joi.string().min(8).max(25).optional(),  
      email: Joi.string().required(),
      country: cities.required(),
      isPublic: Joi.boolean().required(),
      birthDate: Joi.string().max(10).required(), //TODO: validate date
      avatar: Joi.string().optional(),
      password: Joi.string().required(),
      name: Joi.string().required(),
      lastName: Joi.string().required(),
      deleted: Joi.boolean().optional(),
    }), 
  }),

  get: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      username: Joi.string().required(),
    }),
  }),

  logIn: celebrate({
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().max(50).required(),
      password: Joi.string().min(2).required(),
    }),
  }),
}