const search = require('./../index')({
  username: 'livescoretab'
});

const assert = require('assert');

const cities = [
  ['Kyiv', 'Kyiv'],
  ['Odessa', 'Odessa'],
  ['Kiev', 'Kyiv'],
  ['Kiev, Ukraine', 'Kyiv'],
  ['Dnipro', 'Dnipro'],
  ['Dnipropetrovsk', 'Dnipro'],
  ['Dnipropetrovsk, Ukraine', 'Dnipro']
];

cities.forEach(c => {
  search({
    q: c[0],
    maxRows: 1
  })
    .then(res => {
      assert(res.toponymName === c[1], `${res.name} not equal ${c[1]}`);
      console.log(res);
    })
    .catch(console.error);
});
