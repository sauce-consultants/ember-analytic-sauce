import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class ApplicationRoute extends Route {
  // Services

  @service() analytics;
  @service() router;

  // Methods

  constructor() {
    super(...arguments);

    // Setup event to track views on route change

    // This event fires our view request on every route change
    this.router.on('routeDidChange', (/*transition*/) => {
      // get URL for path property
      const path = this.router.currentURL,
        // get name of the route
        name = this.router.currentRouteName || 'unknown';

      this.analytics.setUser(42);

      // track visit
      this.analytics.trackVisit(path, name);
    });
  }
}
