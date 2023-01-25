import Route from '@ember/routing/route';

export default class ThingRoute extends Route {
  // Methods

  model(params) {
    return params.id;
  }
}
