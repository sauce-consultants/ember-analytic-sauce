# Tracking Users

To track users views and events user the `setUser` method in the analytics service.

As the service is a singleton, you only need to set it once per service. We suggest

-   After a successfull log in
-   After a successfull log out
-   After restoring the session from local storage

{{#docs-snippet name='application.js' title='tests/dummy/app/torii-adapters/application.js'}}
  // after log in / session restor
  get(this, 'analytics').setUser(user.id);
  // after log out
  get(this, 'analytics').setUser(null);

{{/docs-snippet}}

{{test-event}}
