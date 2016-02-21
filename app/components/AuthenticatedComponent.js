import React from 'react';
import {Router} from 'react-router';
import LoginStore from '../stores/LoginStore';

export default (ComposedComponent) => {
  return class AuthenticatedComponent extends React.Component {

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
      this.setState(state);
    }

    render() {
      return (
        this.state.LoggedIn ?
          <ComposedComponent
            {...this.props}
            profile={this.state.user}
            token={this.state.jwt}
            userLoggedIn={this.state.LoggedIn} />
          :
          <h4>Please log in to use this function</h4>
    );
  }
}
};
