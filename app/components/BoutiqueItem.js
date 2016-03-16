import React from 'react';

class BoutiqueItem extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h4>{this.props.detail.name}</h4>
      </div>
    );
  }

}

export default BoutiqueItem;
