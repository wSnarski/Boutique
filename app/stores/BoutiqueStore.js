import alt from '../alt';
import {assign} from 'underscore';
import BoutiqueActions from '../actions/BoutiqueActions';

class BoutiqueStore {
  constructor() {
    this.bindActions(BoutiqueActions);
  }

  onGetBoutiqueSuccess(data) {
    assign(this, data);
  }

  onGetBoutiqueFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(BoutiqueStore);
