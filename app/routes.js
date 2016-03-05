import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import BoutiqueManager from './components/BoutiqueManager';
import Item from './components/Item';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/boutiqueManager' component={BoutiqueManager} />
    <Route path='/items/:id' component={Item} />
  </Route>
);
