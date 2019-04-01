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
import Ember from 'ember';


export default Service.extend({
  // Attributes
  url: 'https://sheetsu.com/apis/v1.0bu/6498441a3194/',
  viewSequence: 0,
  eventSequence: 0,
  user: null,
  // Services
  browser: service(),
  // Computed
  globalSequence: computed('viewSequence', 'eventSequence', function() {
    return get(this, 'viewSequence') + get(this, 'eventSequence');
  }),
  // Methods
  init() {
    this._super(...arguments);
    const session = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    set(this, 'session', session);
  },
  baseProperties() {
    const row = {};
    // ember app details
    set(row, 'environment', get(config, 'environment'));
    set(row, 'project', get(config, 'APP.name'));
    // package version
    const v = get(config, 'APP.version').split('+');
    set(row, 'version', v[0]);
    set(row, 'hash', v[1]);
    // System setting
    set(row, 'os', get(this, 'browser.info.os'));
    set(row, 'ip', null); //get(this, 'browser').lookup('ip'));
    // Browser details
    set(row, 'browser', get(this, 'browser.info.browser.browserCode'));
    set(row, 'browser-version', get(this, 'browser.info.browser.version'));
    // User details
    set(row, 'session', get(this, 'session'));
    set(row, 'user', get(this, 'user'));
    // date
    const date = new Date();
    set(row, 'date', date.toISOString());
    return row;
  },
  trackView(view, title) {
    window.console.log('Track View');

    const row = this.baseProperties();

    this.incrementProperty('viewSequence');
    set(row, 'view-sequence', get(this, 'viewSequence'));
    set(row, 'global-sequence', get(this, 'globalSequence'));

    set(row, 'name', view);
    set(row, 'title', title);

    return this.send('/sheets/views', row);
  },
  trackEvent(event, data) {
    window.console.log('Track Event');

    const row = this.baseProperties();

    this.incrementProperty('eventSequence');
    set(row, 'event-sequence', get(this, 'eventSequence'));
    set(row, 'global-sequence', get(this, 'globalSequence'));

    set(row, 'name', event);
    set(row, 'data', data);

    return this.send('/sheets/events', row);
  },
  send(uri, data) {

    const url = `${get(this, 'url')}${uri}`;

    return $.ajax({
      type: "POST",
      url,
      data,
      success: (data) => {
        window.console.log('analytics sent');
        window.console.log(data);
      },
      dataType: 'json'
    });
  }
});