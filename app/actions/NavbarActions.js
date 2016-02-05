import alt from '../alt';
import {assign} from 'underscore';

class NavbarActions {
  constructor() {
    this.generateActions(
      'updateOnlineUsers',
      'updateAjaxAnimation',
      'updateSearchQuery',
      'getClothesCountSuccess',
      'getClothesCountFail',
      'findClothesSuccess',
      'findClothesFail'
    );
  }

  findClothes(payload) {
    $.ajax({
      url: '/api/clothes/search',
      data: { name: payload.searchQuery }
    })
    .done((data) => {
      assign(payload, data);
      this.actions.findClothesSuccess(payload);
    })
    .fail(() => {
      this.actions.findClothesFail(payload);
    });
  }

  getClothesCount() {
    $.ajax({ url: '/api/clothes/count' })
    .done((data) => {
      this.actions.getClothesCountSuccess(data)
    })
    .fail((jqXhr) => {
      this.actions.getClothesCountFail(jqXhr)
    });
  }
}

export default alt.createActions(NavbarActions);
