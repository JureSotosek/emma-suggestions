const { getSuggestions } = require('./elasticsearch');
const { parseElasticsearchResponse } = require('./libs');

async function suggestions(dependencies = [], devDependencies = [], limit = 5) {
  const elasticsearchResponse = await getSuggestions(
    dependencies,
    devDependencies
  );

  const {
    suggestedDependencies,
    suggestedDevDependencies,
    suggestedAllDependencies
  } = parseElasticsearchResponse(elasticsearchResponse);

  const filteredSuggestedDependencies = suggestedDependencies
    .filter(dependency => !dependencies.includes(dependency))
    .slice(0, limit);

  const filteredSuggestedDevDependencies = suggestedDevDependencies
    .filter(devDependency => !devDependencies.includes(devDependency))
    .slice(0, limit);

  const filteredSuggestedAllDependencies = suggestedAllDependencies
    .filter(
      dependency =>
        !devDependencies.includes(dependency) &&
        !dependencies.includes(dependency)
    )
    .slice(0, limit);

  const IDsToFetch = [
    //Set used to remove duplicates
    ...new Set([
      ...filteredSuggestedDependencies,
      ...filteredSuggestedDevDependencies,
      ...filteredSuggestedAllDependencies
    ])
  ];

  const algoliaResponse = await getPackages(IDsToFetch);

  const suggestedPackages = algoliaResponse.results.filter(
    package => package && filteredSuggestedDependencies.includes(package.name)
  );
  const suggestedDevPackages = algoliaResponse.results.filter(
    package =>
      package && filteredSuggestedDevDependencies.includes(package.name)
  );
  const suggestedAllPackages = algoliaResponse.results.filter(
    package =>
      package && filteredSuggestedAllDependencies.includes(package.name)
  );

  return {
    dependencies: suggestedPackages,
    devDependencies: suggestedDevPackages,
    allDependencies: suggestedAllPackages
  };
}

module.exports = { suggestions };