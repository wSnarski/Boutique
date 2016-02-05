import alt from '../alt';
import LoginActions from '../actions/LoginActions';

class LoginStore {
  constructor() {
    this.bindActions(LoginActions);
    this.authModule = null;
    this.profile = {};
    this.token = null;
    this.LoggedIn = false;
  }

  onSetAuthModule(module) {
    this.authModule = module;
  }

  onShowLogin() {
    this.authModule.show(function (err, profile, token) {
      if(err) {
        LoginActions.loginUserFail(err);
      } else {
        LoginActions.loginUserSuccess({
          token: token,
          profile: profile
        });
      }
    });
  }

  onGetUserProfile(token) {
    this.authModule.getProfile(token, function (err, profile) {
      if (err) {
        LoginActions.loginUserFail(err);
      } else {
        LoginActions.loginUserSuccess({
          token: token,
          profile: profile
        })
      }
    });
  }

  onLoginUserSuccess(login) {
    this.token = login.token;
    this.profile = login.profile;
    this.LoggedIn = true;
  }

  onLoginUserFail(message) {
    this.profile = {};
    this.token = null;
    this.LoggedIn = false;
    toastr.error(message);
  }

  onLogoutUser() {
    if (this.token == null) {
      toastr.error("Sorry! No user logged in.");
    } else {
      this.profile = {};
      this.token = null;
      this.LoggedIn = false;
      toastr.info("You've been successfully logged out.")
    }
  }
}

export default alt.createStore(LoginStore);
