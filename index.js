const redis = require('redis');
const fetch = require('node-fetch');
const { stringify: toQuery } = require('querystring');
const { promisify } = require('util');

const url = (params, username) =>
  `http://api.geonames.org/searchJSON?${toQuery(params)}&username=${username}`;

const fetchEntity = (params, username) =>
  fetch(url(params, username))
    .then(res => res.json())
    .then(({ geonames }) => geonames[0] || null);

const search = options => {
  const {
    redisOptions,
    queryPrefix = 'q',
    entityPrefix = 'e',
    username = 'demo'
  } = options;
  const client = redis.createClient(redisOptions);
  const get = promisify(client.get).bind(client);
  const set = promisify(client.set).bind(client);

  const saveEntity = params => e => {
    const query = toQuery(params);
    if (e) {
      const id = JSON.stringify(e.geonameId);
      const entity = JSON.stringify(e);
      return Promise.all([
        set(`${queryPrefix}:${query}`, id),
        set(`${entityPrefix}:${e.geonameId}`, entity)
      ]).then(() => e);
    } else {
      return set(`${queryPrefix}:${query}`, 'null').then(() => null);
    }
  };

  const resolveEntity = params => geonameId =>
    get(`${entityPrefix}:${geonameId}`).then(
      entity =>
        entity
          ? JSON.parse(entity)
          : fetchEntity(params, username).then(saveEntity(params))
    );

  return params =>
    get(`${queryPrefix}:${toQuery(params)}`).then(id => {
      if (id === 'null') {
        return null;
      } else {
        return resolveEntity(params)(id);
      }
    });
};

module.exports = search;
