import Controller from '@ember/controller';
import {
  inject as service
} from '@ember/service';
import {
  get
} from '@ember/object';

export default Controller.extend({
  // Service
  analytics: service(),
  // Actions
  actions: {
    fireEvent() {
      get(this, 'analytics').trackEvent('Usage Event', {
        value: 'foo'
      });
    }
  }
});