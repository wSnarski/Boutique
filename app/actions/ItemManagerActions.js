import alt from '../alt';

class ItemManagerActions {
  constructor() {
    this.generateActions(
      'getItemCountForUserSuccess',
      'getItemCountForUserFail',
      'addItemForBoutiqueSuccess',
      'addItemForBoutiqueFail'
    );
  }

  getItemCountForUser(itemId) {
    $.ajax({ url: '/api/Users/Me/Boutiques/boutiqueItems?itemId='+itemId})
    .done((data) => {
      this.actions.getItemCountForUserSuccess(data);
    })
    .fail((jqXhr) => {
      this.actions.getItemCountForUserFail(jqXhr);
    })
  }

  addItemForBoutique(boutiqueId, itemId) {
    $.ajax({
      type: 'POST',
      url: '/api/Boutiques/'+boutiqueId+'/boutiqueItems',
      data: { boutiqueId: boutiqueId, itemId: itemId }
    })
    .done((item) => {
      //TODO this should pass along the list of items so we can refresh the view
      this.actions.addItemForBoutiqueSuccess(item);
    })
    .fail((jqXhr) => {
      this.actions.addItemForBoutiqueFail(jqXhr);
    });
  }

}

export default alt.createActions(ItemManagerActions);
