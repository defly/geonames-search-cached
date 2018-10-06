# geonames-search-cached
Wrapper for http://api.geonames.org/searchJSON endpoint with results caching in Redis.
Use if you need frequent geo toponym resolution by input string.

## Install

```
npm i geonames-search-cached
```

## Usage
```
redis-server
```

```javascript
const search = require('geonames-search-cached')({
  redisOptions: {...}, // node_redis connection config, optional
  queryPrefix: 'q', // prefix for query string stored in node_redis, default 'q',
  entityPrefix: 'e', // prefix for geonames entity string stored in node_redis, default 'e',
  username: 'demo' // username from geonames
});

search({q: 'Kyiv, Ukraine', maxRows: 1})
  .then(console.log)
  .catch(console.error);

```
