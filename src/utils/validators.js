var { Joi } = require('celebrate');

const cities = Joi.string().valid(
  'Ciudad de México',
  'Aguascalientes',
  'Baja California',
  'Baja California Sur',
  'Campeche',
  'Chiapas',
  'Chihuahua',
  'Coahuila',
  'Colima',
  'Durango',
  'Estado de México',
  'Guanajuato',
  'Guerrero',
  'Hidalgo',
  'Jalisco',
  'Toluca',
  'Michoacán',
  'Morelos',
  'Nayarit',
  'Nuevo León',
  'Oaxaca',
  'Puebla',
  'Querétaro',
  'Quintana Roo',
  'San Luis Potosí',
  'Sinaloa',
  'Sonora',
  'Tabasco',
  'Tamaulipas',
  'Tlaxcala',
  'Veracruz',
  'Yucatán',
  'Zacatecas',
  'Extranjero',
);

const classification = Joi.string().valid(
  'AA',
  'A',
  'B',
  'C',
  'B15',
  'C',
  'D',
  'NA'
);

const type = Joi.string().valid(
  'm',
  's',
  'e',
);

const role = Joi.string().valid(
  'Director',
  'Writer',
  'Actor',
);

module.exports = {
  cities,
  classification,
  type,
  role,
}