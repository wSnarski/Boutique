import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';
import LoginActions from '../actions/LoginActions';

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = NavbarStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    NavbarStore.listen(this.onChange);
    NavbarActions.getItemCount();

    let socket = io.connect();

    socket.on('onlineUsers', (data) => {
      NavbarActions.updateOnlineUsers(data);
    });

    //TODO since we have multiple ajax calls going out this is not really working..
    /*$(document).ajaxStart(() => {
      NavbarActions.updateAjaxAnimation('fadeIn');
    });

    $(document).ajaxComplete(() => {
      setTimeout(() => {
        NavbarActions.updateAjaxAnimation('fadeOut');
      }, 750);
    });*/
  }

  componentWillUnmount() {
    NavbarStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  handleLogin(event) {
    event.preventDefault();
    LoginActions.showLogin();
  }

  handleLogout(event) {
    event.preventDefault();
    console.log(this.props.profile);
    LoginActions.logoutUser();
  }

  handleSubmit(event) {
    event.preventDefault();

    let searchQuery = this.state.searchQuery.trim();

    if (searchQuery) {
      NavbarActions.findItem({
        searchQuery: searchQuery,
        searchForm: this.refs.searchForm,
        history: this.props.history
      });
    }
  }

  render() {
    let loginButton = this.props.loggedIn ?
    <li>
      <a className='dropdown-toggle' role='button' data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span>{this.props.profile.nickname}</span>
        <img className='img img-circle' src={this.props.profile.picture} />
        <span className="glyphicon glyphicon-chevron-down"></span>
      </a>
      <ul className="dropdown-menu">
      <li><Link to='/myBoutiques'>My Boutiques</Link></li>
      <li role="separator" className="divider"></li>
      <li><Link to='/Account'>Account Management</Link></li>
      <li><a role='button' onClick={this.handleLogout.bind(this)}>Logout</a></li>
      </ul>
    </li> :
    <li><a role='button' onClick={this.handleLogin.bind(this)}>Login</a></li>;
    return (
      <nav className='navbar navbar-default navbar-static-top'>
        <div className='container-fluid'>
        <div className='navbar-header'>
          <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
            <span className='sr-only'>Toggle navigation</span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
            <span className='icon-bar'></span>
          </button>
          <Link to='/' className='navbar-brand'>
            <span ref='triangles' className={'triangles animated ' + this.state.ajaxAnimationClass}>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
              <div className='tri'></div>
              <div className='tri invert'></div>
            </span>
            BOUTIQUE
            <span className='badge badge-up badge-danger'>{this.state.onlineUsers}</span>
          </Link>
        </div>
        <div id='navbar' className='navbar-collapse collapse'>
          <form ref='searchForm' className='navbar-form navbar-left animated' onSubmit={this.handleSubmit.bind(this)}>
            <div className='input-group'>
              <input type='text' className='form-control' placeholder={this.state.totalItems + ' items'} value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery} />
              <span className='input-group-btn'>
                <button className='btn btn-default' onClick={this.handleSubmit.bind(this)}><span className='glyphicon glyphicon-search'></span></button>
              </span>
            </div>
          </form>
          <ul className='nav navbar-nav'>
            <li><Link to='/'>Home</Link></li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            {loginButton}
          </ul>
        </div>
        </div>
      </nav>
    );
  }
}

export default Navbar;
