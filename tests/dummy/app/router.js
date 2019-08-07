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
      const path = get(this, 'router.currentURL');
      const name = get(this, 'router.currentRouteName') || 'unknown';
      get(this, 'analytics').trackVisit(name, path);
    });
  },
  init() {
    this._super(...arguments);

    this.on('routeDidChange', () => {
      const screen = get(this, 'router.currentURL');
      const title = get(this, 'router.currentRouteName') || 'unknown';

      get(this, 'analytics').trackVisit(screen, title);
    });
  }
});

Router.map(function() {
  docsRoute(this, function() {
    this.route('usage');
    this.route('views');
    this.route('events');
    this.route('user');
    this.route('config');
  });

  this.route('not-found', {
    path: '/*path'
  });
});

export default Router;