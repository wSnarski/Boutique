import alt from '../alt';
import {assign} from 'underscore';
import ItemActions from '../actions/ItemActions';

class ItemStore {
  constructor() {
    this.bindActions(ItemActions);
  }

  onGetItemSuccess(data) {
    assign(this, data);
  }

  onGetItemFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(ItemStore);
