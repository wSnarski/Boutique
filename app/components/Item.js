import React from 'react';
import ItemStore from '../stores/ItemStore';
import ItemActions from '../actions/ItemActions';

class Item extends React.Component {

  constructor(props) {
    super(props);
    this.state = ItemStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    ItemStore.listen(this.onChange);
    ItemActions.getItem(this.props.params.id);
  }

  componentWillUnmount() {
    ItemStore.unlisten(this.onChange);
  }

  componentDidUpdate(prevProps) {
    // Fetch new item data when URL path changes
    if (prevProps.params.id !== this.props.params.id) {
      ItemActions.getItem(this.props.params.id);
    }
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
        <h3 className='text-center'>You are viewing an item</h3>
        <h4>{this.state.name}</h4>
        <h4>{this.state.type}</h4>
      </div>
    );
  }
}

export default Item;
