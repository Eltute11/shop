import React from 'react';

import swal from 'sweetalert';

import './static/styles/App.css';
import './static/styles/main.css';
import logo from './static/images/aerolab-logo.svg';
import imgUser from './static/images/user.svg';
import banner from './static/images/header-x1.png';

class App extends React.Component {

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDIwZTc2YjhmYTY3NTAwNmQwMGU0NTAiLCJpYXQiOjE1NjI0Mzc0ODN9.oeeX9Vx0vrWNZK5knmWLjcMCvpNQQWlvvpcQAMxqqf8';

  constructor(props){
    super(props);
    this.state={
      isLoaded: false,
      title: 'Mis datos',
      profile: {},
      products: {},
      error: null
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
          this.setState({
            profile: result
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
            products: result
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

  btnRedeem = (points, cost, p_id, p_name) => () => {
    console.log(points);
    console.log(cost);
    console.log(p_id);
    console.log(p_name);
    if(cost <= points){
      return <button onClick={this.redeemProduct(p_id, p_name)} className="btn btn-block btn-primary mt-2">Canjear ahora</button>;
    }else{
      return <button onClick={this.redeemProduct(p_id, p_name)} className="btn btn-block btn-disable mt-2">No alcanza</button>;
    }
  }

  componentDidMount() {
    this.getProfile();
    this.getProducts();
  }

  render() {
    const { error, isLoaded, profile, title, products } = this.state;
    if(!isLoaded || error){
      return <div>Loading...</div>;
    }else{
      return (
        <div className="App">
          <div className="zeynep"></div>

          <header>
            <div className="container">
                <div className="row justify-content-between align-items-center">
                  <div className="col-auto">
                    <img src={logo} alt="logo" />
                  </div>
                  <div className="col-auto d-flex align-items-center">
                    <span className="pr-4">Hola <b>{profile.name}</b>, tienes <b>{profile.points}pts</b></span>
                    {/* <img src={imgUser} alt="user" className="user btn-open"/> */}
                    <button type="button"  onClick={this.updatePoints(1000)} className="btn btn-outline-secondary">+ Puntos</button>
                  </div>
                </div>
              </div>
          </header>
          <main className="container">
            <div className="container">
              <div className="hero">
                {/* <img src={banner} className="img-fluid" alt="banner" /> */}
              </div>
            </div>

            <div className="container">
              <div className="row justify-content-between align-items-center">
                <div className="col-auto">
                  <h1>Electrónica 💻</h1>
                </div>
                <div className="col-auto"><h3>{profile.points}pts Disponibles</h3></div>
              </div>
            </div>
            
            <div className="container my-5">
              <div className="row">
                {products.map(product => (
                  <div className="col-12 col-md-4 col-lg-3 mb-3" key={product._id}>
                    <div className="card">
                      
                      <img src={product.img.url} className="card-img-top" alt={product.name}></img>
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <div className="d-flex justify-content-between align-items-center">
                          <h6 className="card-subtitle text-muted">{product.category}</h6>
                          <h5><span className="badge badge-pill badge-dark">{product.cost}pts</span></h5>
                        </div>
                        {/* {this.btnRedeem(profile.points, product.cost, product._id, product.name)} */}
                        <button onClick={this.redeemProduct(product._id, product.name)} className="btn btn-block btn-primary mt-2">Canjear ahora</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            
          </main>
          

          <div className="zeynep-overlay"></div>
        
        </div>
      );
    }
  }
}

export default App;
