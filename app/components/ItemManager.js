import React from 'react';
import AuthenticatedComponent from './AuthenticatedComponent';
import ItemManagerStore from '../stores/ItemManagerStore';
import ItemManagerActions from '../actions/ItemManagerActions';

class ItemManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = ItemManagerStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    ItemManagerStore.listen(this.onChange);
    ItemManagerActions.getItemCountForUser(this.props.itemId);
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.itemId !== nextProps.itemId) {
      ItemManagerActions.getItemCountForUser(nextProps.itemId);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  addItemToUser(e) {
    ItemManagerActions.addItemForUser(this.props.itemId);
  }

  addItemToBoutique(boutiqueId, e) {
    ItemManagerActions.addItemForBoutique(this.props.itemId, boutiqueId);
  }

  render() {
    return (
      <div className='container'>
        <h3 className='text-center'>This is the item manager</h3>
        {this.state.closetItems.map((closetItem, i) => {
            return (
              <div onClick={this.addItemToBoutique.bind(this, closetItem.id)} key={i}>
                {closetItem.name} : {closetItem.items.length}
              </div>
            );
        })}
        <h4 className='text-center' onClick={this.addItemToUser.bind(this)}>Add Item to Boutique</h4>
      </div>
    );
  }

}

export default AuthenticatedComponent(ItemManager);
