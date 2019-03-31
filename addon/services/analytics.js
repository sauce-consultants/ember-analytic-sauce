import Service from '@ember/service';
import $ from 'jquery';
import config from 'ember-get-config';
import {
  inject as service
} from '@ember/service';
import {
  computed,
  get,
  set,
} from '@ember/object';

export default Service.extend({
  // Attributes
  url: 'https://firestore.googleapis.com/v1/projects/2FL8YYkdkiMNQJyJdV6bhc/databases/(default)/documents',
  viewSequence: 0,
  eventSequence: 0,
  // Services
  browser: service(),
  // Computed
  globalSequence: computed('viewSequence', 'eventSequence', function() {
    return get(this, 'viewSequence') + get(this, 'eventSequence');
  }),
  // Methods
  trackView(options = {}) {
    window.console.log('Track View', get(this, 'browser.info'));

    this.incrementProperty('viewSequence');

    set(options, 'environment', get(config, 'environment'));

    set(options, 'project', get(config, 'APP.name'));

    const v = get(config, 'APP.version').split('+');
    set(options, 'version', v[0]);
    set(options, 'hash', v[1]);

    set(options, 'os', get(this, 'browser.info.os'));
    set(options, 'ip', get(this, 'browser').lookup('ip'));

    set(options, 'browser', get(this, 'browser.info.browser.browserCode'));
    set(options, 'browser-version', get(this, 'browser.info.browser.version'));

    set(options, 'view-sequence', get(this, 'viewSequence'));
    set(options, 'global-sequence', get(this, 'globalSequence'));

    return this.send('/views.json', options);
  },
  trackEvent(options = {}) {
    window.console.log('Track Event');

    this.incrementProperty('eventSequence');

    set(options, 'environment', get(config, 'environment'));

    set(options, 'project', get(config, 'APP.name'));

    const v = get(config, 'APP.version').split('+');
    set(options, 'version', v[0]);
    set(options, 'hash', v[1]);

    set(options, 'event-sequence', get(this, 'eventSequence'));
    set(options, 'global-sequence', get(this, 'globalSequence'));

    return this.send('/events.json', options);
  },
  send(uri, data) {
    // const json = JSON.stringify(data);
    window.console.log(data);

    $.ajax({
      type: "POST",
      url: `${get(this, 'url')}${uri}`,
      data: JSON.stringify(data),
      success: () => {
        window.console.log('analytics sent');
      },
      dataType: 'json'
    });
  }
});