import React from 'react';
import {Router} from 'react-router';
import LoginStore from '../stores/LoginStore';

export default (ComposedComponent) => {
  return class AuthenticatedComponent extends React.Component {

    static onEnter(nextRoute, replace) {
      if (!LoginStore.getState().LoggedIn) {
        replace({
          pathname: '/shame',
          state: { nextPathname: nextRoute.location.pathname }
        });
      }
    }

    constructor(props) {
      super(props);
      this.state = LoginStore.getState();
      this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
      LoginStore.listen(this.onChange);
    }

    componentWillUnmount() {
      LoginStore.unlisten(this.onChange);
    }

    onChange(state) {
      this.setState(state, () => {
        if(!this.state.LoggedIn) {
          this.props.history.replace({
            pathname: '/shame',
            state: { nextPathname: 'shame' }
          });
        }
      });
    }

    render() {
      return (
        <ComposedComponent
      {...this.props}
      profile={this.state.user}
      token={this.state.jwt}
      userLoggedIn={this.state.LoggedIn} />
    );
  }
}
};
