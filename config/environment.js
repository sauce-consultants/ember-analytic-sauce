'use strict';

module.exports = function( /* environment, appConfig */ ) {
  return {
    'analytics-sauce': {
      apiUrl: 'http://analytics.sauce.construction',
      environments: ['staging', 'production'],
      debug: false,
    },
  }
};