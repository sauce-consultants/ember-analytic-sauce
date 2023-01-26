import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ThingController extends Controller {
  // Service

  @service analytics;

  // Actions
  @action hitIt(thing) {
    this.analytics.trackEvent('hit.thing', { id: thing });
  }
}
