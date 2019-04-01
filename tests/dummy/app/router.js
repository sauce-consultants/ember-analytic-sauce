import AddonDocsRouter, {
  docsRoute
} from 'ember-cli-addon-docs/router';
import config from './config/environment';
import {
  get
} from '@ember/object';
import {
  inject as service
} from '@ember/service';
import {
  scheduleOnce
} from '@ember/runloop';

const Router = AddonDocsRouter.extend({
  // Properties
  location: config.locationType,
  rootURL: config.rootURL,
  // Services
  analytics: service(),
  router: service(),
  // Methods
  didTransition() {
    this._super(...arguments);
    this._trackPage();
  },
  _trackPage() {
    scheduleOnce('afterRender', this, () => {
      window.console.log('- afterRender');
      const screen = this.router.currentURL;
      const title = this.router.currentRouteName || 'unknown';
      get(this, 'analytics').trackView(screen, title);
    });
  },
  init() {
    this._super(...arguments);

    window.console.log('tak');
    this.on('routeDidChange', () => {
      window.console.log('- routeDidChange');
      const screen = this.router.currentURL;
      const title = this.router.currentRouteName || 'unknown';

      get(this, 'analytics').trackView(screen, title);
    });
  }
});

Router.map(function() {
  docsRoute(this, function() {
    this.route('usage');
  });

  this.route('not-found', {
    path: '/*path'
  });
});

export default Router;