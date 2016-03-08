import React from 'react';
import AuthenticatedComponent from './AuthenticatedComponent';
import BoutiqueManager from './BoutiqueManager';
//TODO the naming here is quite confusing
import BoutiqueManagerStore from '../stores/BoutiqueManagerStore';
import BoutiqueManagerActions from '../actions/BoutiqueManagerActions';

class MyBoutiques extends React.Component {

  constructor(props) {
    super(props);
    this.state = BoutiqueManagerStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    BoutiqueManagerStore.listen(this.onChange);
    BoutiqueManagerActions.getMyBoutiques();
  }

  componentWillUnmount() {
    BoutiqueManagerStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
      <h3 className='text-center'>
        Welcome to your boutiques
      </h3>
      <BoutiqueManager boutiques={this.state.boutiques}/>
      </div>
    );
  }
}

export default AuthenticatedComponent(MyBoutiques);
