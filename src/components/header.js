import React from 'react';

import logo from '../static/images/aerolab-logo.svg';
import '../static/styles/main.css';

 class Header extends React.Component {
    
    render() {
      return <header className="headroom">
        <div className="container">
            <div className="row">
              <div className="col-auto">
                <img src={logo} alt="logo" />
              </div>
            </div>
          </div>
      </header>;
    }
}

export default Header;