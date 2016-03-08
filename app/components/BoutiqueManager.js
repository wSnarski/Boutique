import React from 'react';
import BoutiqueManagerActions from '../actions/BoutiqueManagerActions';
import Boutique from './Boutique'

class BoutiqueManager extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='container'>
      <h3 className='text-center'>
      These are your boutiques
      {
        this.props.boutiques.map((boutique, i) => {
          return <Boutique key={i} {...boutique}/>;
        })
      }
      </h3>
      </div>
    );
  }
}

export default BoutiqueManager;
