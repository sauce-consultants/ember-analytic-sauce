import Service from "@ember/service";
import $ from "jquery";
import config from "ember-get-config";
import { inject as service } from "@ember/service";
import { computed, get, set } from "@ember/object";
import { not } from "@ember/object/computed";

export default Service.extend({
  // Attributes
  viewSequence: 0,
  eventSequence: 0,
  user: null,
  ip: null,
  // Services
  cordovaPlatform: service("ember-cordova/platform"),
  // Computed
  url: computed(function () {
    const url = get(config, "analytics-sauce.apiUrl");
    if (!url) {
      throw Error("please set a config value for analytics-sauce.apiUrl");
    }
    return url;
  }),
  globalSequence: computed("viewSequence", "eventSequence", function () {
    return get(this, "viewSequence") + get(this, "eventSequence");
  }),
  isWeb: computed("cordovaPlatform.isCordova", function () {
    return !this.get("cordovaPlatform.isCordova");
  }),
  isApp: not("isWeb"),
  platform: computed("isWeb", "isApp", function () {
    if (get(this, "isWeb")) {
      return "web";
    }
    if (get(this, "isWeb")) {
      return "app";
    }
  }),
  userAgent: computed(function () {
    return navigator.userAgent || navigator.vendor || window.opera;
  }),
  iOS: computed("userAgent", function () {
    const userAgent = this.get("userAgent");
    return (
      userAgent.match(/iPad/i) ||
      userAgent.match(/iPhone/i) ||
      userAgent.match(/iPod/i)
    );
  }),
  android: computed("userAgent", function () {
    const userAgent = this.get("userAgent");
    return userAgent.match(/Android/i);
  }),
  // Methods
  init() {
    this._super(...arguments);
    // create session hash
    const session =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    set(this, "session", session);
  },
  setUser(user) {
    set(this, "user", user);
  },
  setAppName(name) {
    set(this, "appName", name);
  },
  baseProperties() {
    const row = {};
    // ember app details
    set(row, "environment", get(config, "environment"));
    set(row, "appName", this.get("appName") || get(config, "APP.name"));
    // package version
    const v = get(config, "APP.version").split("+");
    set(row, "appVersion", v[0]);
    set(row, "appHash", v[1]);
    // System setting
    set(row, "userAgent", window.navigator.userAgent);
    // User details
    set(row, "sessionId", get(this, "session"));
    set(row, "userId", get(this, "user"));
    set(row, "flavor", get(config, "flavor"));
    return row;
  },
  trackVisit(view, title) {
    this.log("Track View");

    const row = this.baseProperties();

    this.incrementProperty("viewSequence");
    set(row, "viewSequence", get(this, "viewSequence"));
    set(row, "globalSequence", get(this, "globalSequence"));

    set(row, "name", view);
    set(row, "title", title);

    return this.send("/visits", row);
  },
  trackEvent(event, data) {
    this.log("Track Event");

    const row = this.baseProperties();

    this.incrementProperty("eventSequence");
    set(row, "eventSequence", get(this, "eventSequence"));
    set(row, "globalSequence", get(this, "globalSequence"));

    set(row, "name", event);
    set(row, "data", data);

    return this.send("/events", row);
  },
  send(uri, data) {
    const url = `${get(this, "url")}${uri}`;

    data = JSON.stringify(data);

    if (this.shouldSendData()) {
      return fetch(url, {
        method: "POST",
        headers: { accept: "application/json" },
        body: data,
      }).then((response) => {
        this.log("analytics sent", data);
      });
    } else {
      this.log(url, data);
    }
  },
  shouldSendData() {
    const currentEnv = config.environment,
      activeEnvs = get(config, "analytics-sauce.environments");

    if (activeEnvs) {
      return activeEnvs.indexOf(currentEnv) !== -1;
    }
    return false;
  },
  log(...args) {
    if (get(config, "analytics-sauce.debug")) {
      window.console.log(...args);
    }
  },
});
