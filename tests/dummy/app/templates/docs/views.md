# Tracking Views

To track page views in ember add the following code to `app/router.js`.

{{#docs-snippet name='router.js' title='tests/dummy/app/router.js'}}
  const Router = EmberRouter.extend({
    // ...
    // Services
    analytics: service(),
    router: service(),
    // Methods
    didTransition() {
      this.\_super(...arguments);
      this.trackPage();
    },
    trackPage() {
      scheduleOnce('afterRender', this, () => {
        const screen = get(this, 'router.currentURL');
        const title = get(this, 'router.currentRouteName') || 'unknown';
        get(this, 'analytics').trackVisit(screen, title);
      });
    },
  });
{{/docs-snippet}}
