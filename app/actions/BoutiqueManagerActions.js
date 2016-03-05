import alt from '../alt';

class BoutiqueManagerActions {
  constructor() {
    this.generateActions(
      'getMyBoutiquesSuccess',
      'getMyBoutiquesFail'
    )
  }

  getMyBoutiques() {
    $.ajax({ url: '/api/Boutiques/My' })
    .done((data) => {
      this.actions.getMyBoutiquesSuccess(data);
    })
    .fail((jqXhr) => {
      this.actions.getMyBoutiquesFail(jqXhr);
    });
  }
}

export default alt.createActions(BoutiqueManagerActions);
