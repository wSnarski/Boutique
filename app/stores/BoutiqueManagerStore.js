import alt from '../alt';
import BoutiqueManagerActions from '../actions/BoutiqueManagerActions';

class BoutiqueManagerStore {
  constructor() {
    this.bindActions(BoutiqueManagerActions);
    this.boutiques = [];
  }

  onGetMyBoutiquesSuccess(data) {
    this.boutiques = data;
  }

  onGetMyBoutiquesFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(BoutiqueManagerStore);
