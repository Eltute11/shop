import React from 'react';

import logo from '../static/images/aerolab-logo.svg';
import imgUser from '../static/images/user.svg';
import '../static/styles/main.css';

 class Header extends React.Component {
    
    render() {
      return <header>
        <div className="container">
            <div className="row justify-content-between align-items-center">
              <div className="col-auto">
                <img src={logo} alt="logo" />
              </div>
              <div className="col-auto d-flex align-items-center">
                <span className="pr-4">1231pts</span>
                <img src={imgUser} alt="user"/>
              </div>
            </div>
          </div>
      </header>;
    }
}

export default Header;