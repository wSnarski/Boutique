import alt from '../alt';

class BoutiqueManagerActions {
  constructor() {
    this.generateActions(
      'getMyBoutiquesSuccess',
      'getMyBoutiquesFail'
    )
  }

  getMyBoutiques() {
    $.ajax({ url: '/api/Users/Me/Boutiques' })
    .done((data) => {
      this.actions.getMyBoutiquesSuccess(data);
    })
    .fail((jqXhr) => {
      this.actions.getMyBoutiquesFail(jqXhr);
    });
  }

  //get boutiques for user..
}

export default alt.createActions(BoutiqueManagerActions);
