import React from 'react';
import ItemManagerActions from '../actions/ItemManagerActions';

class ItemManagerBoutique extends React.Component {

  constructor(props) {
    super(props);
  }

  addItemToBoutique(e) {
    ItemManagerActions.addItemForBoutique(this.props.id, this.props.itemId);
  }

  render() {
    return (
      <div onClick={this.addItemToBoutique.bind(this)} >
        {this.props.name} : {this.props.items.length}
      </div>
    );
  }
}

export default ItemManagerBoutique;
