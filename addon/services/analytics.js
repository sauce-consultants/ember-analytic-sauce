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
import {
  not
} from '@ember/object/computed';

export default Service.extend({
  // Attributes
  viewSequence: 0,
  eventSequence: 0,
  user: null,
  ip: null,
  // Services
  browser: service(),
  cordovaPlatform: service('ember-cordova/platform'),
  // Computed
  url: computed(function() {
    const sheet = get(config, 'analyticSauce.sheet');
    if (!sheet) {
      throw Error("please set a config value for analyticSauce.sheet");
    }
    return `https://sheetsu.com/apis/v1.0bu/${sheet}`;
  }),
  globalSequence: computed('viewSequence', 'eventSequence', function() {
    return get(this, 'viewSequence') + get(this, 'eventSequence');
  }),
  isWeb: computed('cordovaPlatform.isCordova', function() {
    return !this.get('cordovaPlatform.isCordova');
  }),
  isApp: not('isWeb'),
  platform: computed('isWeb', 'isApp', function() {
    if (get(this, 'isWeb')) {
      return 'web';
    }
    if (get(this, 'isWeb')) {
      return 'app';
    }
  }),
  userAgent: computed(function() {
    return (navigator.userAgent || navigator.vendor || window.opera);
  }),
  iOS: computed('userAgent', function() {
    const userAgent = this.get('userAgent');
    return (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || userAgent.match(/iPod/i));
  }),
  android: computed('userAgent', function() {
    const userAgent = this.get('userAgent');
    return (userAgent.match(/Android/i));
  }),
  // Methods
  init() {
    this._super(...arguments);
    // create session hash
    const session = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    set(this, 'session', session);
    // get ip
    $.getJSON('https://api.ipify.org?format=jsonp&callback=?', (data) => {
      set(this, 'ip', data.ip);
    });
  },
  setUser(user) {
    set(this, 'user', user);
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
    set(row, 'platform', get(this, 'platform'));
    set(row, 'os', get(this, 'browser.os'));
    set(row, 'ip', get(this, 'ip'));
    // Browser details
    set(row, 'browser', get(this, 'browser.browser.browserCode'));
    set(row, 'browser-version', get(this, 'browser.browser.version'));
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