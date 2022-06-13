var { Segments, Joi, celebrate } = require('celebrate');

module.exports = {
  rating: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      entryId: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object().keys({      
      username: Joi.string().max(30).required(),
      stars: Joi.number().integer().min(1).max(5).required(),
      message: Joi.string().required(),
    }),
  }),

  declassification: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      ratingId: Joi.number().integer().required(),
    }),
  }),

  reply: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      ratingId: Joi.number().integer().required(), 
    }),
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().max(30).required(),
      message: Joi.string().required(),
    }),
  }),

  returnComment: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      replyId: Joi.number().integer().required(),
    }),
  }),

  likes: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      replyId: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().max(30).required(),
      isLike: Joi.boolean().required(),
    }),
  }),

  dislike: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      replyId: Joi.number().integer().required(),
    }),
  }),
};