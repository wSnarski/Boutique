import alt from '../alt';

class ItemActions{
  constructor() {
    this.generateActions(
      'getItemSuccess',
      'getItemFail'
    );
  }

  getItem(itemId) {
    $.ajax({ url: '/api/items/' + itemId })
    .done((data) => {
      this.actions.getItemSuccess(data);
    })
    .fail((jqXhr) => {
      this.actions.getItemFail(jqXhr);
    });
  }
}

export default alt.createActions(ItemActions);
