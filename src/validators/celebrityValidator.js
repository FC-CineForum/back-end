var { Segments, Joi, celebrate } = require('celebrate');

module.exports = {
  addCelebrity: celebrate({
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().max(100).required(),
      biography: Joi.string().required(),
      picture: Joi.string().required(),
    }),
  }),
};