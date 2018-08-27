import { isObservableProp, action, observable, computed } from 'mobx';
import { map, forIn } from 'lodash';

export default class Model {
  @observable _loading = false;
  _availableRelations = [];
  _attributes = [];

  constructor() {
    const relations = this.relations && this.relations();

    // Set all relations
    if (relations) {
      this._availableRelations = Object.keys(relations);
      map(relations, (RelModel, relName) => {
        this[relName] = new RelModel();
        this[relName]._parent = this;
      });
    }

    // Index all attributes for easier stringifying
    forIn(this, (value, key) => {
      if (!key.startsWith('__') && isObservableProp(this, key)) {
        this._attributes.push(key);
      }
    });
  }

  @computed
  get loading() {
    return this._loading;
  }

  toJS() {
    const output = {};

    // Simply set properties
    this._attributes.forEach(attr => {
      output[attr] = this[attr];
    });

    // And recurse for relations
    this._availableRelations.forEach(relName => {
      const model = this[relName];
      output[relName] = model.toJS();
    });

    return output;
  }

  @action
  parse(data) {
    map(data, (value, key) => {
      // If the key is for a relation, parse that relation
      if (this._availableRelations.includes(key)) {
        this[key].parse(value);
      } else {
        this[key] = value;
      }
    });
  }
}
