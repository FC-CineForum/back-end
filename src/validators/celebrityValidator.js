var { Segments, Joi, celebrate } = require('celebrate');
var { role } = require('../utils/validators');

module.exports = {
  addCelebrity: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().max(100).required(),
      biography: Joi.string().required(),
      picture: Joi.string().required(),
    }),
  }),

  addRole: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      entryId: Joi.number().integer().required(), 
      celebrityId: Joi.number().integer().required(), 
    }),
    [Segments.BODY]: Joi.object().keys({
      role: role.required(),
    }),
  }),
};