var { Segments, Joi, celebrate } = require('celebrate');
const { classification, type } = require('../utils/validators');

module.exports = {
  addMovie: celebrate({
    [Segments.BODY]: Joi.object().keys({      
      title: Joi.string().max(80).required(),
      synopsis: Joi.string().max(280).required(),
      image: Joi.string().required(),
      release: Joi.number().integer().required(),
      classification: classification.required(),
      type: type.required(),
      trailer: Joi.string().required(),
      length: Joi.number().integer().required(),
    }),
  }),

  addSeries: celebrate({
    [Segments.BODY]: Joi.object().keys({      
      title: Joi.string().max(80).required(),
      synopsis: Joi.string().max(280).required(),
      image: Joi.string().required(),
      release: Joi.number().integer().required(),
      classification: classification.required(),
      type: type.required(),
      trailer: Joi.string().required(),
    }),
  }),

  addEpisode: celebrate({
    [Segments.BODY]: Joi.object().keys({
      idSeries: Joi.number().integer().required(),
      title: Joi.string().max(80).required(),
      synopsis: Joi.string().max(280).required(),
      image: Joi.string().required(),
      release: Joi.number().integer().required(),
      classification: classification.required(),
      type: type.required(),
      season: Joi.number().integer().required(),
      noEp: Joi.number().integer().required(),
      length: Joi.number().integer().required(),
    }),
  }),
}