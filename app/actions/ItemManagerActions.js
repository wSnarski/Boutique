import alt from '../alt';

class ItemManagerActions {
  constructor() {
    this.generateActions(
      'getItemCountForUserSuccess',
      'getItemCountForUserFail',
      'addItemForUserSuccess',
      'addItemForUserFail',
      'addItemForBoutiqueSuccess',
      'addItemForBoutiqueFail'
    );
  }

  getItemCountForUser(itemId) {
    $.ajax({ url: '/api/Boutiques/My/items/' + itemId})
    .done((data) => {
      this.actions.getItemCountForUserSuccess(data);
    })
    .fail((jqXhr) => {
      this.actions.getItemCountForUserFail(jqXhr);
    })
  }

  addItemForUser(itemId) {
    $.ajax({
      type: 'POST',
      url: '/api/Boutiques/My/items',
      data: { itemId: itemId }
    })
    .done(() => {
      //TODO this should pass along the list of items so we can refresh the view
      this.actions.addItemForUserSuccess();
    })
    .fail((jqXhr) => {
      this.actions.addItemForUserFail(jqXhr);
    });
  }

  addItemForBoutique(boutiqueId, itemId) {
    $.ajax({
      type: 'POST',
      url: '/api/Boutiques/'+boutiqueId+'/items',
      data: { itemId: itemId }
    })
    .done(() => {
      //TODO this should pass along the list of items so we can refresh the view
      this.actions.addItemForBoutiqueSuccess();
    })
    .fail((jqXhr) => {
      this.actions.addItemForBoutiqueFail(jqXhr);
    });
  }

}

export default alt.createActions(ItemManagerActions);
