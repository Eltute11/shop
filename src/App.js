import React, {Component} from 'react';
import './styles/App.css';
import swal from 'sweetalert';

class App extends Component {

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
          <h1>{title}</h1>
          <h2>Estos son tus datos {profile.name}</h2>
          <ul>
            <li>ID {profile._id}</li>
            <li>My points {profile.points}</li>
            <li>Create date {profile.createDate}</li>
          </ul>
          <button onClick={this.updatePoints(1000)}>Incrementar puntos</button>
          <div></div>
          <div></div>
          
          {products.map(product => (
            <div className="card" key={product._id}>
              <img src={product.img.url} className="card-img-top" alt={product.name}></img>
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <h6 className="card-subtitle mb-2 text-muted">{product.category}</h6>
                <button onClick={this.redeemProduct(product._id, product.name)} className="card-link">Canjear por {product.cost}pts</button>
              </div>
            </div>
          ))}
          


        </div>
      );
    }
  }
}

export default App;
