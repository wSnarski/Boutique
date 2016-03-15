import React from 'react';
import BoutiqueManagerActions from '../actions/BoutiqueManagerActions';

class Boutique extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props);
    return (
      <div className='container'>
        <h3 className='text-center'>
          Boutique: {this.props.info.name}
        </h3>
      </div>
    );
  }
}

export default Boutique;
