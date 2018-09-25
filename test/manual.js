const search = require('./../index');

const cities = [
  'Odesa, Ukraine',
  'Odesa, Ukraine',
  'Odesa, Ukraine',
  'Ukraine',
  'Ukraine',
  'Kiev, Ukraine',
  'Kiev, Ukraine',
  'Kiev, Ukraine',
  'Kyiv, Ukraine',
  'Kyiv, Ukraine',
  'Kyiv',
  'Kyiv',
  'Kiev',
  'Kiev',
  'Dnipro, Ukraine'
];

cities.forEach(c => {
  search({ username: 'demo' })(c)
    .then(console.log)
    .catch(console.error);
});