var { Segments, Joi, celebrate } = require('celebrate');

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
      celebrityId: Joi.number().integer().required(), 
      entryId: Joi.number().integer().required(), 
    }),
    [Segments.BODY]: Joi.object().keys({
      role: Joi.string().max(60).required(),
    }),
  }),
};