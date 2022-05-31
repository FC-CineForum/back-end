var { Segments, Joi, celebrate } = require('celebrate');

module.exports = {
  rating: celebrate({
    [Segments.BODY]: Joi.object().keys({      
      idEntry: Joi.number().integer().required(),
      username: Joi.string().max(30).required(),
      stars: Joi.number().integer().min(1).max(5).required(),
      message: Joi.string().required(),
    }),
  }),

  reply: celebrate({
    [Segments.BODY]: Joi.object().keys({
      idRating: Joi.number().integer().required(), 
      username: Joi.string().max(30).required(),
      message: Joi.string().required(),
    }),
  }),

  likes: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().max(30).required(),
      idReply: Joi.number().integer().required(),
      isLike: Joi.boolean().required(),
    }),
  }),
};