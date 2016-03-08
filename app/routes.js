import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import Home from './components/Home';
import MyBoutiques from './components/MyBoutiques';
import Item from './components/Item';

export default (
  <Route component={App}>
    <Route path='/' component={Home} />
    <Route path='/myBoutiques' component={MyBoutiques} />
    <Route path='/items/:id' component={Item} />
  </Route>
);
