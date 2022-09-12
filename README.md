# ember-analytic-sauce

[Short description of the addon.]

## Compatibility

- Ember.js v3.16 or above
- Ember CLI v2.13 or above
- Node.js v10 or above

## Installation

```
ember install ember-analytic-sauce
```

## Usage

### Set App's name
This will set your app's name so that the analytics recorded are separate, in the case that your app is re-used for different projects.

```
this.analytics.setAppName("your-app-name")
```

Not setting this will mean your app's default name set in package.json will be used instead.

### Track screen views

```
import Route from '@ember/routing/route';
import {inject as service} from '@ember/service';
import config from '../config/environment';

export default class ApplicationRoute extends Route {
  constructor() {
    super(...arguments);

    // Override default app name
    // this.analytics.setAppName("your-app-name")

    // Setup event to track views on route change

    if (config.environment !== 'test') {
      // This event fires our view request on every route change
      this.router.on('routeDidChange', (transition) => {
        // generate URL for path property
        // const path = getUrlFromTransition(transition, this.routing);
        // get name of the route
        // const name = transition.to.name;

        // get URL for path property
        const path = this.router.currentURL;
        // get name of the route
        const name = this.router.currentRouteName || 'unknown';

        // get user id - example is using ember-simple-auth
        const userId = this.session.data.authenticated.data.id;

        // if logged in - set the user id
        if (userId) {
          this.analytics.setUser(userId);
        }

        // track visit
        this.analytics.trackVisit(path, name);
      });
    }
  }
}
```

### Track events

example of tracking an event in a controllers action

```
import Controller from '@ember/controller';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

export default class ThingController extends Controller {

    @service() analytics;

    @action doThing() {
        this.analytics.trackEvent('my.event', {
            some:'data'
        });
    }
}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
