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
      ratingId: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().max(30).required(),
      isLike: Joi.boolean().required(),
    }),
  }),

  isLike: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      ratingId: Joi.number().integer().required(),
      username: Joi.string().max(30).required(),
    }),
  }),

  dislike: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      ratingId: Joi.number().integer().required(),
    }),
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().max(30).required(),
    }),
  }),

  createPlaylist: celebrate({
    [Segments.BODY]: Joi.object().keys({
      list_name: Joi.string().max(30).required(),
      username: Joi.string().max(30).required,
      is_public: Joi.boolean().required(),
      description: Joi.string().max(280).optional(),
    }),
  }),

  getPlaylist: celebrate({
    [Segments.PARAMS]: Joi.object().keys({
      username: Joi.string().max(30).required(),
    }),
  }),

  find: celebrate({
    [Segments.QUERY]: Joi.object().keys({
      word: Joi.string().max(30).required(),
    }),
  }),
};