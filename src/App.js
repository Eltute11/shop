import React from 'react';

import swal from 'sweetalert';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';

import './static/css/App.css';
import './static/css/main.css';
import logo from './static/images/aerolab-logo.svg';
import imgUser from './static/images/user.svg';
import banner from './static/images/header-x1.png';
import BtnRedeem from './components/btnRedeem';

class App extends React.Component {

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDIwZTc2YjhmYTY3NTAwNmQwMGU0NTAiLCJpYXQiOjE1NjI0Mzc0ODN9.oeeX9Vx0vrWNZK5knmWLjcMCvpNQQWlvvpcQAMxqqf8';

  constructor(props){
    super(props);
    this.app = React.createRef()
    this.state={
      isLoaded: false,
      title: 'Mis datos',
      profile: {},
      history: {},
      products: {},
      maxProducts: {},
      maxCost: 0,
      error: null,
      updatingMaxCost: true,
      txtOrder: 'most recent',
      sidebarOpen: false ,
      countHistory: 0
    }
  }

  setError = () => {
    this.setState({
      error: true
    });
    swal('Oops!', 'Parece que ha ocurrido un error. Intentar nuevamente', "error")
      .then((value) => {
        window.location.reload();
    });
  }

  getProfile = () => {
    fetch('https://coding-challenge-api.aerolab.co/user/me', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      }
    })
    .then(res => res.json())
    .then(
      (result) => {
        if(result.error == null) {
          // Ahora que tenemos los pts del usuario, solicitamos los productos
          if(this.state.updatingMaxCost){
            this.getProducts();
          }
          this.setState({
            profile: result,
            maxCost: result.points
          });
        }else{
          const error = new Error(result.error);
          throw error;
        }  
      },
      (error) => {
        this.setError();
      }
    )
    .catch( err => {
      swal('Oops!', err.message, "error");
    });
  }

  getProducts = () => {
    fetch('https://coding-challenge-api.aerolab.co/products', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      }
    })
    .then(res => res.json())
    .then(
      (result) => {
        if(result.error == null) {
          this.setState({
            isLoaded: true,
            products: result,
            maxProducts: result
          });
          // Si los puntos del usuario fueron modificados, actualizamos los productos a mostrar
          if(this.state.updatingMaxCost){
            this.maxCostProduct(this.state.maxCost);
            this.setState({
              updatingMaxCost: false
            })
          }
        }else{
          const error = new Error(result.error);
          throw error;
        }     
      },
      (error) => {
        this.setError();
      }
    )
    .catch( err => {
      swal('Oops!', err.message, "error");
    });
  }

  getHistory = () => {
    fetch('https://coding-challenge-api.aerolab.co/user/history', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      }
    })
    .then(res => res.json())
    .then(
      (result) => {
        if(result.error == null) {
          this.setState({
            history: result,
            countHistory: result.length
          });
        }else{
          const error = new Error(result.error);
          throw error;
        }     
      },
      (error) => {
        this.setError();
      }
    )
    .catch( err => {
      swal('Oops!', err.message, "error");
    });
  }

  updatePoints = points => () => {
    let requestObject = {
      amount: points
    }

    fetch('https://coding-challenge-api.aerolab.co/user/points', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      },
      body: JSON.stringify(requestObject)
    })
    .then(res => res.json())
    .then(
      (result) => {
        if(result.error == null) {
          swal('Felicitaciones!', 'Ahora tienes ' + result['New Points'] + ' puntos!', "success");
          this.getProfile();
          // Actualizamos los productos que puede canjear
          this.maxCostProduct(result['New Points']);
        }else{
          const error = new Error(result.error);
          throw error;
        }
      },
      (error) => {
        this.setError();
      }
    )
    .catch(err => {
      swal('Oops!', err.message, "error");
    });
  }

  redeemProduct = (id, name) => () => {
    let requestObject = {
      productId: id
    }

    fetch('https://coding-challenge-api.aerolab.co/redeem', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.token,
      },
      body: JSON.stringify(requestObject)
    })
    .then(res => res.json())
    .then(
      (result) => {
        if(result.error == null) {
          swal('Felicitaciones!', 'Tu canje por ' + name + ' ha sido realizado exitosamente!', "success");
          this.setState({
            updatingMaxCost: true
          })
          this.getProfile();
        }else{
          const error = new Error(result.error);
          throw error;
        }
      },
      (error) => {
        this.setError('error');
      }
    )
    .catch(err => {
      swal('Oops!', err.message, "error");
    });
  }

  maxCostProduct(cost){
    const reduceProduct = this.state.products.filter(product => product.cost <= cost);
    this.setState({maxProducts: reduceProduct});
  }

  orderProduct = order => () => {
    const products = this.state.maxProducts;
    let newOrderProducts = products.sort(function(a, b) {
      var x = a['cost']; var y = b['cost'];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    })
    if(order === 'DESC'){
      newOrderProducts = newOrderProducts.reverse();
      this.setState({
        txtOrder: 'highest points'
      })
    }else{
      this.setState({
        txtOrder: 'lowest points'
      })
    }
    this.setState({
      maxProducts: newOrderProducts
    })
  }

  openSidebar = () => {
    this.setState({
      sidebarOpen: true
    })
  }

  closeSidebar = () => {
    this.setState({
      sidebarOpen: false
    })
  }

  componentDidMount() {
    this.getProfile();
    this.getHistory();
  }

  render() {
    const { error, isLoaded, profile, maxProducts, txtOrder, history, countHistory } = this.state;
    if(!isLoaded || error){
      return <div>Loading...</div>;
    }else{
      return (
        <div className={`App ${this.state.sidebarOpen ? " zeynep-opened " : ""}`} ref={this.app}>
          <div className="zeynep">
            <h3>My History <span role="img" aria-label="electronic">🛒</span></h3>
            <div className="mt-4">
              {history.map(purchase => (
                <div className="d-flex flex-row justify-content-between align-items-center my-3 history" key={purchase.createDate}>
                  <div className="col-4 pl-0">
                  <img src={purchase.img.url} className="img-fluid" alt={purchase.name}></img>
                  </div>
                  <div className="col">
                    <h6 className="mb-0">{purchase.name}</h6>
                  </div>
                  <div className="col-auto pr-0">
                    <span className="text-muted">{purchase.cost}pts</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <main>
            <header className="mb-5 mb-sm-0">
              <div className="container">
                  <div className="row justify-content-between align-items-center">
                    <div className="col-auto">
                      <img src={logo} alt="logo" />
                    </div>
                    <div className="col-auto d-flex align-items-center">
                      <span className="pr-3 d-none d-sm-flex">Hello <b>{profile.name}</b>, you have <b>{profile.points}pts</b></span>
                      <span className="pr-3 d-sm-none"><b>{profile.points}pts</b></span>
                      {/* <img src={imgUser} alt="user" className="user btn-open"/> */}
                      <div className="fa-2x mx-2" onClick={this.openSidebar} style={{cursor: 'pointer'}}>
                        <span className="fa-layers fa-fw" key="fa-layer">
                          <i className="fas fa-shopping-basket"></i>
                          <span className="fa-layers-counter" style={{background: '#ff7c00'}}>{countHistory}</span>
                        </span>
                      </div>
                      <button type="button"  onClick={this.updatePoints(1000)} className="btn btn-points">more points</button>
                    </div>
                  </div>
                </div>
            </header>
            <div className="container pt-5 pt-sm-0">
              <div className="hero d-none d-sm-flex">
                  {/* <img src={banner} className="img-fluid" alt="banner" /> */}
              </div>

              <div className="container">
                <div className="row justify-content-between align-items-center">
                  <div className="col-auto">
                    <h1>Electronic <span role="img" aria-label="electronic">💻</span></h1>
                  </div>
                  <div className="col-auto d-none d-sm-flex">
                    <h3>{profile.points}pts available</h3>
                  </div>
                </div>
                <div className="row justify-content-between align-items-center my-4">
                  <div className="col-lg d-flex flex-row filter">
                    <span className="filter-title">Sort by points</span> 
                    <InputRange
                      maxValue={4000}
                      minValue={0}
                      value={this.state.maxCost}
                      onChange={(maxCost) => {
                        this.setState({ maxCost });
                      }}
                      onChangeComplete={(newMaxCost) => {
                        this.maxCostProduct(newMaxCost);
                      }} />
                  </div>
                  <div className="col-12 col-lg-auto text-center text-lg-left mt-5 mt-lg-0">
                    <div className="dropdown ml-3">
                      <button className="dropdown-toggle" type="button" id="dropdownOrder" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Sort by {txtOrder}
                      </button>
                      <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownOrder">
                        <span className="dropdown-item" onClick={this.orderProduct('DESC') }>highest points</span>
                        <span className="dropdown-item" onClick={this.orderProduct('ASC') }>lowest points</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="container my-5">
                <div className="row">
                  {maxProducts.map(product => (
                    <div className="col-12 col-md-4 col-lg-3 mb-3" key={product._id}>
                      <div className="card">
                        
                        <img src={product.img.url} className="card-img-top" alt={product.name}></img>
                        <div className="card-body">
                          <h5 className="card-title">{product.name}</h5>
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="card-subtitle text-muted">{product.category}</h6>
                            <h5><span className="badge badge-pill badge-dark">{product.cost}pts</span></h5>
                          </div>
                          <BtnRedeem points={profile.points} cost={product.cost} onClick={this.redeemProduct(product._id, product.name)} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </main>
          

          <div className="zeynep-overlay" onClick={this.closeSidebar}></div>
        
        </div>
      );
    }
  }
}

export default App;
