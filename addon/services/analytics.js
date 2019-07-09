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
    // const sheet = get(config, 'analyticSauce.sheet');
    // if (!sheet) {
    //   throw Error("please set a config value for analyticSauce.sheet");
    // }
    return `http://192.168.1.190:8000`;
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
  },
  setUser(user) {
    set(this, 'user', user);
  },
  baseProperties() {
    const row = {};
    // ember app details
    set(row, 'environment', get(config, 'environment'));
    set(row, 'appName', get(config, 'APP.name'));
    // package version
    const v = get(config, 'APP.version').split('+');
    set(row, 'appVersion', v[0]);
    set(row, 'appHash', v[1]);
    // System setting
    set(row, 'userAgent', window.navigator.userAgent);
    // User details
    set(row, 'sessionId', get(this, 'session'));
    set(row, 'userId', get(this, 'user'));
    return row;
  },
  trackVisit(view, title) {
    // window.console.log('Track View');

    const row = this.baseProperties();

    this.incrementProperty('viewSequence');
    set(row, 'viewSequence', get(this, 'viewSequence'));
    set(row, 'globalSequence', get(this, 'globalSequence'));

    set(row, 'name', view);
    set(row, 'title', title);

    return this.send('/visits', row);
  },
  trackEvent(event, data) {
    // window.console.log('Track Event');

    const row = this.baseProperties();

    this.incrementProperty('eventSequence');
    set(row, 'eventSequence', get(this, 'eventSequence'));
    set(row, 'globalSequence', get(this, 'globalSequence'));

    set(row, 'name', event);
    set(row, 'data', data);

    return this.send('/events', row);
  },
  send(uri, data) {

    const url = `${get(this, 'url')}${uri}`;

    data = JSON.stringify(data);

    return $.ajax({
      type: "POST",
      url,
      data,
      // success: (data) => {
      //   window.console.log('analytics sent');
      //   window.console.log(data);
      // },
      dataType: 'json'
    });
  }
});