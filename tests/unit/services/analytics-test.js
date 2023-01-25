import { module, test } from 'qunit';
import { setupTest } from 'dummy/tests/helpers';
import config from 'ember-get-config';

let SENT_URI = null,
  SENT_DATA = null,
  sendRequest = function (uri, data) {
    SENT_URI = uri;
    SENT_DATA = data;
    return null;
  };

module('Unit | Service | analytics', function (hooks) {
  // Specify the other units that are required for this test.
  ['config:environment', 'service:intl'], setupTest(hooks);

  test('it exists', function (assert) {
    let service = this.owner.lookup('service:analytics');
    assert.ok(service);
  });

  test('track a view', function (assert) {
    let service = this.owner.lookup('service:analytics');
    // stub mocked api service
    service.sendRequest = sendRequest;

    service.trackVisit('/', 'Home');

    assert.strictEqual(service.viewSequence, 1, 'test view sequence');
    assert.strictEqual(service.eventSequence, 0, 'test event sequence');
    assert.strictEqual(service.globalSequence, 1, 'test global sequence');

    assert.strictEqual(SENT_URI, '/visits', 'requested correct uri');

    const v = config.APP.version.split('+'),
      appVersion = v[0],
      appHash = v[1];

    let data = SENT_DATA;

    assert.strictEqual(data.appHash, appHash, 'sent app hash');
    assert.strictEqual(data.appName, 'ember-analytic-sauce', 'sent app name');
    assert.strictEqual(data.appVersion, appVersion, 'sent app name');
    assert.strictEqual(data.environment, 'test', 'sent environment');

    assert.strictEqual(data.sessionId, service.data.sessionId, 'sent session');
    assert.strictEqual(
      data.userAgent,
      window.navigator.userAgent,
      'sent user agent'
    );

    assert.strictEqual(data.name, '/', 'sent view name');
    assert.strictEqual(data.title, 'Home', 'sent home');
    assert.strictEqual(data.userId, null, 'sent userId');

    // set a user id
    service.setUser(42);

    // Track
    service.trackVisit('/auth', 'Login');

    data = SENT_DATA;

    assert.strictEqual(data.name, '/auth', 'sent view name');
    assert.strictEqual(data.title, 'Login', 'sent home');
    assert.strictEqual(data.userId, 42, 'sent userId');

    assert.strictEqual(service.viewSequence, 2, 'test view sequence');
    assert.strictEqual(service.eventSequence, 0, 'test event sequence');
    assert.strictEqual(service.globalSequence, 2, 'test global sequence');
  });

  test('track an event', function (assert) {
    let service = this.owner.lookup('service:analytics');
    // stub mocked api service
    service.sendRequest = sendRequest;

    service.trackEvent('login.success', { foo: 'bar' });

    assert.strictEqual(service.viewSequence, 0, 'test view sequence');
    assert.strictEqual(service.eventSequence, 1, 'test event sequence');
    assert.strictEqual(service.globalSequence, 1, 'test global sequence');

    assert.strictEqual(SENT_URI, '/events', 'requested correct uri');

    const v = config.APP.version.split('+'),
      appVersion = v[0],
      appHash = v[1];

    let data = SENT_DATA;

    assert.strictEqual(data.appHash, appHash, 'sent app hash');
    assert.strictEqual(data.appName, 'ember-analytic-sauce', 'sent app name');
    assert.strictEqual(data.appVersion, appVersion, 'sent app name');
    assert.strictEqual(data.environment, 'test', 'sent environment');

    assert.strictEqual(data.sessionId, service.data.sessionId, 'sent session');
    assert.strictEqual(
      data.userAgent,
      window.navigator.userAgent,
      'sent user agent'
    );

    assert.strictEqual(data.name, 'login.success', 'sent event name');
    assert.strictEqual(data.data.foo, 'bar', 'sent event data');
    assert.strictEqual(data.userId, null, 'sent userId');

    // set a user id
    service.setUser(42);

    // Track
    service.trackEvent('thing.create', { foo: 'moo' });

    data = SENT_DATA;

    assert.strictEqual(data.name, 'thing.create', 'sent event name');
    assert.strictEqual(data.data.foo, 'moo', 'sent event data');
    assert.strictEqual(data.userId, 42, 'sent userId');

    assert.strictEqual(service.viewSequence, 0, 'test view sequence');
    assert.strictEqual(service.eventSequence, 2, 'test event sequence');
    assert.strictEqual(service.globalSequence, 2, 'test global sequence');
  });

  test('track a view then event', function (assert) {
    let service = this.owner.lookup('service:analytics');
    // stub mocked api service
    service.sendRequest = sendRequest;

    service.trackVisit('/', 'Home');

    assert.strictEqual(service.viewSequence, 1, 'test view sequence');
    assert.strictEqual(service.eventSequence, 0, 'test event sequence');
    assert.strictEqual(service.globalSequence, 1, 'test global sequence');

    assert.strictEqual(SENT_URI, '/visits', 'requested correct uri');

    const v = config.APP.version.split('+'),
      appVersion = v[0],
      appHash = v[1];

    let data = SENT_DATA;

    assert.strictEqual(data.appHash, appHash, 'sent app hash');
    assert.strictEqual(data.appName, 'ember-analytic-sauce', 'sent app name');
    assert.strictEqual(data.appVersion, appVersion, 'sent app name');
    assert.strictEqual(data.environment, 'test', 'sent environment');

    assert.strictEqual(data.sessionId, service.data.sessionId, 'sent session');
    assert.strictEqual(
      data.userAgent,
      window.navigator.userAgent,
      'sent user agent'
    );

    assert.strictEqual(data.name, '/', 'sent view name');
    assert.strictEqual(data.title, 'Home', 'sent home');
    assert.strictEqual(data.userId, null, 'sent userId');

    // set a user id
    service.setUser(42);

    // Track
    service.trackEvent('login.success', { foo: 'bar' });

    data = SENT_DATA;

    assert.strictEqual(data.name, 'login.success', 'sent event name');
    assert.strictEqual(data.data.foo, 'bar', 'sent event data');
    assert.strictEqual(data.userId, 42, 'sent userId');

    assert.strictEqual(service.viewSequence, 1, 'test view sequence');
    assert.strictEqual(service.eventSequence, 1, 'test event sequence');
    assert.strictEqual(service.globalSequence, 2, 'test global sequence');
  });
});
