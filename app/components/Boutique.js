import React from 'react';
import BoutiqueItem from './BoutiqueItem';
import BoutiqueManagerActions from '../actions/BoutiqueManagerActions';

class Boutique extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='container'>
        <h3 className='text-center'>
          Boutique: {this.props.info.name}
        </h3>
        <span> with the following items </span>
        {
          this.props.items.map((item, i) => {
            return <BoutiqueItem key={i} {...item}/>;
          })
        }
      </div>
    );
  }
}

export default Boutique;
