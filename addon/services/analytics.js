import Service from '@ember/service';
import config from 'ember-get-config';

export default class AnalyticsService extends Service {
  // Properties

  /**
   *
   */
  session = null;

  /**
   *
   */
  user = null;

  /**
   *
   */
  appName = null;

  /**
   * Number of views in this session
   */
  viewSequence = 0;

  /**
   * Number of events in this session
   */
  eventSequence = 0;

  /**
   * Tracking data sent with each event and visit
   */
  data = {
    // The enviroment the app is running in e.g. productions, staging, development
    environment: null,
    // String to represent the app name - defaults to name in package.json
    appName: null,
    // The version of the app - defaults to version in package.json
    appVersion: null,
    // The hash of the last commit
    appHash: null,
    // Browser user agent string
    userAgent: null,
    // Unique uuid to identify the session, regenerated each time the browser refreshes
    sessionId: null,
    // Some form of identity to track the user
    userId: null,
  };

  // Getters

  /**
   * Returns the base url for our service
   */
  get analyticsUrl() {
    const url = config['analytics-sauce']?.apiUrl;
    if (!url) {
      throw Error('please set a config value for analytics-sauce.apiUrl');
    }
    return url;
  }

  /**
   * Total number of views and events in this sequence
   */
  get globalSequence() {
    return this.viewSequence + this.eventSequence;
  }

  // Public Methods

  /**
   * Assign unique session when the service is instanciated
   */
  constructor() {
    super();
    // create a random session uuid to identify this session

    this.data.sessionId = this.#generateUuid();

    // ember app details
    this.data.environment = config.environment;
    this.data.appName = config.APP.name;
    // package version
    const v = config.APP.version.split('+');
    this.data.appVersion = v[0];
    this.data.appHash = v[1];
    // System setting
    this.data.userAgent = window.navigator.userAgent;
  }

  /**
   * Set a unique id to represent the user
   * Could be id, email, name etc
   *
   * @param {string/int} user
   */
  setUser(user) {
    this.data.userId = user;
  }

  /**
   * The app name will default to the name provided in package.json
   * Call this method if it needs to be customised
   * @param {string} name
   */
  setAppName(name) {
    this.appName = name;
  }

  /**
   * Overide any of the analytics base properties if needed
   * - environment
   * - appName
   * - appVersion
   * - appHash
   * - userAgent
   * - sessionId
   * - userId
   *
   * @param {object} data
   */
  setData(data) {
    // merge para with existing data object
    this.data = { ...this.data, ...data };
  }

  /**
   * Track a visit to a specific route of the app
   *
   * @param {string} view   - uri
   * @param {string} title  - humanised name for view
   * @returns object
   */
  trackVisit(view, title) {
    const row = this.data;

    this.viewSequence++;

    row.viewSequence = this.viewSequence;
    row.globalSequence = this.globalSequence;

    row.name = view;
    row.title = title;

    this.#log('Track View');
    return this.sendRequest('/visits', row);
  }

  /**
   * Track a specific event in the app
   * e.g. user clicked button or handled error
   *
   * @param {string} event  - string to identify the event
   * @param {object} data   -
   * @returns object
   */

  trackEvent(event, data) {
    const row = this.data;

    this.eventSequence++;

    row.viewSequence = this.viewSequence;
    row.globalSequence = this.globalSequence;

    row.name = event;
    row.data = data;

    this.#log('Track Event');
    return this.sendRequest('/events', row);
  }

  // Private Methods

  /**
   * Generate a unique uuid
   *
   * @returns string
   */
  #generateUuid() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  // Methods

  /**
   * Send data to api
   *
   * @param {string} uri
   * @param {object} data
   *
   * @returns {object} response
   */
  sendRequest(uri, data) {
    const url = `${this.analyticsUrl}${uri}`;

    data = JSON.stringify(data);

    if (this.#shouldSendData()) {
      return fetch(url, {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: data,
      }).then((/*response*/) => {
        this.#log('analytics sent', data);
      });
    } else {
      this.#log(url, data);
    }
  }

  /**
   * Returns true if we should send data to the analytics api
   *
   * @returns boolean
   */
  #shouldSendData() {
    const currentEnv = config.environment,
      activeEnvs = config['analytics-sauce'].environments;

    if (activeEnvs) {
      return activeEnvs.indexOf(currentEnv) !== -1;
    }
    return false;
  }

  /**
   * Logs data to console if active
   *
   * @param  {...any} args
   */
  #log(...args) {
    if (config['analytics-sauce']?.debug) {
      window.console.log(...args);
    }
  }
}
