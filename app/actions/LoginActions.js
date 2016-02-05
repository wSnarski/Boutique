import alt from '../alt';

class LoginActions {
    constructor() {
      this.generateActions(
        'setAuthModule',
        'showLogin',
        'getUserProfile',
        'loginUserFail'
      );
    }

    loginUserSuccess(login) {
      if(login.token) {
        localStorage.setItem('userToken', login.token);
        $.ajaxSetup({
          headers: {
            'Authorization': 'Bearer ' + login.token
          }
        });
        return login;
      }
      else{
        this.actions.loginUserFail("Login failed: No user provided");
      }
    }

    logoutUser() {
      localStorage.removeItem('userToken');
      $.ajaxSetup({
        headers: {
          'Authorization': ''
        }
      });
      return true;
    }

}

export default alt.createActions(LoginActions);
