# Tracking Events

To track events add the following code to your actions.

{{#docs-snippet name='controller.js' title='tests/dummy/app/controller/my-controller.js'}}
    export default Controller.extend({
      // Service
      analytics: service(),
      // Actions
      actions: {
        fireEvent() {
          get(this, 'analytics').trackEvent('My Event', {
            value1: 'foo',
            value2: 'bar'
          });
        }
      }
    });
{{/docs-snippet}}

{{test-event}}
