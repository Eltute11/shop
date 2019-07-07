import React, {Component} from 'react';
import './App.css';

class App extends Component {

  token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZDIwZTc2YjhmYTY3NTAwNmQwMGU0NTAiLCJpYXQiOjE1NjI0Mzc0ODN9.oeeX9Vx0vrWNZK5knmWLjcMCvpNQQWlvvpcQAMxqqf8';

  constructor(props){
    super(props);
    this.state={
      error: null,
      isLoaded: false,
      title: 'Mis datos',
      items: {}
    }
  }


  componentDidMount() {
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
        this.setState({
          isLoaded: true,
          items: result
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  updatePoints = () => {
    let requestObject = {
      amount: 1000
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
        this.setState({
          isLoaded: true
        });
        console.log(result);
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error
        });
      }
    )
  }

  render() {
    const { error, isLoaded, items, title } = this.state;
    if(error) {
      return <div>Error: {error.message}</div>;
    }else if(!isLoaded){
      return <div>Loading...</div>;
    }else{
      return (
        <div className="App">
          <h1>{title}</h1>
          <h2>Estos son tus datos {items.name}</h2>
          <ul>
            <li>ID {items._id}</li>
            <li>My points {items.points}</li>
            <li>Create date {items.createData}</li>
          </ul>
          <button onClick={this.updatePoints}>Incrementar puntos</button>
        </div>
      );
    }
  }
}

export default App;
