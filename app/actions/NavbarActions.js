import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getItemCountSuccess',
      'getItemCountFail',
      'findItemSuccess',
      'findItemFail'
    );
  }

  findItem(payload) {
    $.ajax({
      url: '/api/items/search',
      data: { name: payload.searchQuery }
    })
    .done((data) => {
      assign(payload, data);
      this.actions.findItemSuccess(payload);
    })
    .fail(() => {
      this.actions.findItemFail(payload);
    });
  }

  getItemCount() {
    $.ajax({ url: '/api/items/count' })
    .done((data) => {
      this.actions.getItemCountSuccess(data)
    })
    .fail((jqXhr) => {
      this.actions.getItemCountFail(jqXhr)
    });
  }
}

export default alt.createActions(NavbarActions);
