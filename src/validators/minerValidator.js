var { Segments, Joi, celebrate } = require('celebrate');

module.exports = {
  miner: celebrate({
    [Segments.BODY]: Joi.object().keys({
      url: Joi.string().required(),
    }),
  }),
}