import alt from '../alt';
import ItemManagerActions from '../actions/ItemManagerActions';

class ItemManagerStore {
  constructor() {
    this.bindActions(ItemManagerActions);
    this.boutiqueItems = [];
    //this.wishItems = []
  }

  onGetItemCountForUserSuccess(data) {
    this.boutiqueItems = data;
  }

  onGetItemCountForUserFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onAddItemForBoutiqueSuccess(item) {
    toastr.success('Item successfully added.');
    ItemManagerActions.getItemCountForUser(item.itemId);
  }

  onAddItemForBoutiqueFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(ItemManagerStore);
