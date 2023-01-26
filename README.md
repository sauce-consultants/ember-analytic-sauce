# ember-analytic-sauce

[Short description of the addon.]

## Compatibility

- Ember.js v3.28 or above
- Ember CLI v3.28 or above
- Node.js v14 or above

## Installation

```
ember install ember-analytic-sauce
```

## Config

This application has a few config options you can set in your `config/environment.js` file

```
/// ...
ENV['analytics-sauce'] = {
    apiUrl: 'https://analytics.sauce.construction',
    environments: ['development', 'staging', 'production'],
    debug: true,
};
```

| name         | type   | description                                                 |
| ------------ | ------ | ----------------------------------------------------------- |
| apiUrl       | string | The analytics api to send requests to                       |
| environments | array  | Array of environments to send analytics                     |
| debug        | true   | If set to true analytics data will be logged to the console |

## Usage

### Track app views

Update your `app/routes/application.js` to track each time your user hits any route in the app

```
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
```

### Track app events

To track events you will can inject the analytics service into your controller/service/component/route when appropriate

```
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ThingController extends Controller {
  // Service

  @service analytics;

  // Actions
  @action hitIt(thing) {
    this.analytics.trackEvent('hit.thing', { id: thing });
  }
}
```

### Set user

To set some user indentifiable data you can call setUser on the analytics service.

Ensure this method is called everytime the user refreshes the app.

```
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LoginController extends Controller {
  // Service

  @service analytics;

  // Actions
  @action login(user) {

    // ...

    this.analytics.setUser(user.uuid);
  }
}
```

### Set app name

By default this package will use the name in package.json as the appName. If you want to override this you can call the `setAppName` method.

```
export default class ApplicationRoute extends Route {

    // ... in routeDidChange
    this.analytics.setAppName('myAppThing);

}
```

### Customise other data

There is also a more generic `setData` method to override any of the generic analytics data that is sent to the api.

```
export default class ApplicationRoute extends Route {

    // ... in routeDidChange
    this.analytics.setData({
        environment:'foo',
        appName: 'myAppThing'
        appVersion: '1.0.2b',
        appHash:'bash',
        userAgent:'iOS 16.3.2',
        sessionId:'a4sf43v0s',
        userId:42
    });

}
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
