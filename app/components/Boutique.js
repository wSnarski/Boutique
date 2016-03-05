import React from 'react';
import BoutiqueStore from '../stores/BoutiqueStore';
import BoutiqueActions from '../actions/BoutiqueActions';

class Boutique extends React.Component {

  constructor(props) {
    super(props);
    this.state = BoutiqueStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    BoutiqueStore.listen(this.onChange);
    BoutiqueActions.getBoutique(this.props.boutiqueId);
  }

  componentWillUnmount() {
    BoutiqueStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  render() {
    return (
      <div className='container'>
        <h3 className='text-center'>
          I am a boutique
        </h3>
      </div>
    );
  }
}

export default Boutique;
