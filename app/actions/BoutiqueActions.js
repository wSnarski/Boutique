import alt from '../alt';

class BoutiqueActions {
  constructor() {
    this.generateActions(
      'getBoutiqueSuccess',
      'getBoutiqueFail'
    )
  }

  getBoutique(boutiqueId) {
    $.ajax({ url: '/api/Boutiques/' + boutiqueId })
    .done((data) => {
      this.actions.getBoutiqueSuccess(data);
    })
    .fail((jqXhr) => {
      this.actions.getBoutiqueFail(jqXhr);
    });
  }
}

export default alt.createActions(BoutiqueActions);
