import React from 'react';
import AuthenticatedComponent from './AuthenticatedComponent';
import BoutiqueManagerStore from '../stores/BoutiqueManagerStore';
import BoutiqueManagerActions from '../actions/BoutiqueManagerActions';
import Boutique from './Boutique'

class BoutiqueManager extends React.Component {

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
      These are your boutiques
      {
        this.state.boutiques.map((boutique, i) => {
          return <Boutique key={i} boutiqueId={boutique._id}/>;
        })
      }
      </h3>
      </div>
    );
  }
}

export default AuthenticatedComponent(BoutiqueManager);
