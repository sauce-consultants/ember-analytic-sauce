import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
// import $ from 'jquery';

const App = Application.extend({
  modulePrefix: config.modulePrefix,
  podModulePrefix: config.podModulePrefix,
  Resolver
});
//
// $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
//   if (!jqXHR.crossDomain) {
//     options.contentType = 'application/vnd.api+json';
//     options.beforeSend = function(jqXHR) {
//       jqXHR.setRequestHeader('Accept', 'application/vnd.api+json');
//       jqXHR.setRequestHeader('Content-Type', 'application/vnd.api+json');
//     };
//     // jqXHR.setRequestHeader('Authorization', localStorage.getItem("auth_token"));
//   }
// });

loadInitializers(App, config.modulePrefix);

export default App;