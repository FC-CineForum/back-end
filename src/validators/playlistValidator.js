var { Segments, Joi, celebrate } = require('celebrate');

// TODO: Change DB table list to plalist
// TODO: Change DB list_movie to list_entry
// TODO: Change DB entries constrains
// TODO: Add trigger to update list's date_modified field

module.exports = {
  addPlaylist: celebrate({
    [Segments.BODY]: Joi.object().keys({
      listName: Joi.string().max(60).required(),
      username: Joi.string().min(8).max(30).required(),
      isPublic: Joi.boolean().required(),
      // dateCreated: Joi.string().required(),
      // dateModified: Joi.string().required(),
      description: Joi.string().max(280).optional(),
    }),
  }),

  addEntryToPlaylist: celebrate({
    [Segments.BODY]: Joi.object().keys({
      idEntry: Joi.number().integer().required(),
      listName: Joi.string().max(60).required(),
      username: Joi.string().min(8).max(30).required(),
    }),
  }),

  getUserPlaylists: celebrate({
    [Segments.BODY]: Joi.object().keys({
      username: Joi.string().require(),
    }),
  }),
}