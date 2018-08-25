const algoliasearch = require('algoliasearch');

const algolia = {
  appId: 'OFCNCOG2CU',
  apiKey: '6fe4476ee5a1832882e326b506d14126',
  indexName: 'npm-search'
};

const client = algoliasearch(algolia.appId, algolia.apiKey).initIndex(
  algolia.indexName
);

const attributesToRetrieve = [
  'name',
  'version',
  'description',
  'owner',
  'humanDownloadsLast30Days',
  'popular'
];

function getPackages(names) {
  return client.getObjects(names, attributesToRetrieve);
}

module.exports = { getPackages };
