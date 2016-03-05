import alt from '../alt';
import ItemManagerActions from '../actions/ItemManagerActions';

class ItemManagerStore {
  constructor() {
    this.bindActions(ItemManagerActions);
    this.closetItems = [];
    //this.wishItems = []
  }

  onGetItemCountForUserSuccess(data) {
    this.closetItems = data;
  }

  onGetItemCountForUserFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onAddItemForUserSuccess(jqXhr) {
    toastr.success(jqXHr.responseJSON.message);
    ItemManagerActions.getItemCountForUser();
  }

  onAddItemForUserFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }

  onAddItemForBoutiqueSuccess(jqXhr) {
    toastr.success(jqXHr.responseJSON.message);
    ItemManagerActions.getItemCountForUser();
  }

  onAddItemForBoutiqueFail(jqXhr) {
    toastr.error(jqXhr.responseJSON.message);
  }
}

export default alt.createStore(ItemManagerStore);
