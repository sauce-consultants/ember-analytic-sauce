import {
  Factory
} from 'ember-cli-mirage';

export default Factory.extend({
  page(i) {
    return `Page ${i}`;
  },
  title(i) {
    return `Title ${i}`;
  },
});