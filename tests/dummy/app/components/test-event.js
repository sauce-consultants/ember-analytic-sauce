import Component from '@ember/component';
import {
  inject as service
} from '@ember/service';
import {
  get
} from '@ember/object';

export default Component.extend({
  // Service
  analytics: service(),
  // Actions
  actions: {
    fireEvent() {
      this.analytics.trackEvent('Usage Event', {
        value: 'foo'
      });
    }
  }
});