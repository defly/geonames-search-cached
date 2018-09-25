const redis = require('redis');
const fetch = require('node-fetch');
const { promisify } = require('util');

const url = (query, username) =>
  `http://api.geonames.org/searchJSON?q=${query}&username=${username}&maxRows=1`;

const fetchEntity = (query, username) =>
  fetch(url(query, username))
    .then(res => res.json())
    .then(({ geonames }) => geonames.pop() || null);

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

  const saveEntity = query => e => {
    if (e) {
      return set(`${queryPrefix}:${query}`, JSON.stringify(e.geonameId)).then(
        () => set(`${entityPrefix}:${e.geonameId}`, JSON.stringify(e)) && e
      );
    } else {
      return set(`${queryPrefix}:${query}`, JSON.stringify(null)) && null;
    }
  };

  const resolveEntity = query => geonameId =>
    get(`${entityPrefix}:${geonameId}`).then(
      entity =>
        entity
          ? JSON.parse(entity)
          : fetchEntity(query, username).then(saveEntity(query))
    );

  return query =>
    get(`${queryPrefix}:${query}`).then(id => {
      if (id === 'null') {
        return null;
      } else {
        return resolveEntity(query)(id);
      }
    });
};

module.exports = search;
