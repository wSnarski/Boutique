import React from 'react';
import AuthenticatedComponent from './AuthenticatedComponent';
import ItemManagerBoutique from './ItemManagerBoutique';
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

  render() {
    return (
      <div className='container'>
        <h3 className='text-center'>This is the item manager</h3>
        {
          this.state.boutiqueItems.map((boutiqueItem, i) => {
            return <ItemManagerBoutique key={i} itemId = {this.props.itemId} {...boutiqueItem}/>;
          })
        }
      </div>
    );
  }

}

export default AuthenticatedComponent(ItemManager);
