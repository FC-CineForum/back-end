var { Segments, Joi, celebrate } = require('celebrate');

module.exports = {
createPlaylist: celebrate({
  [Segments.BODY]: Joi.object().keys({
    listName: Joi.string().max(60).required(),
    username: Joi.string().max(30).required(),
    isPublic: Joi.boolean().required(),
    description: Joi.string().max(280).optional(),
  }),
}),

getPlaylist: celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    username: Joi.string().max(30).required(),
  }),
}),

addEntry: celebrate({
  [Segments.BODY]: Joi.object().keys({
    entryId: Joi.number().integer().required(),
    username: Joi.string().max(30).required(),
    listName: Joi.string().max(60).required(),
  }),
}),

playlist:  celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    username: Joi.string().max(30).required(),
    name: Joi.string().max(60).required(),
  }),
}),
}