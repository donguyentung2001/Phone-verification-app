import React, { Component } from 'react';
import './App.css';
import PhoneForm from './components/PhoneForm'
class App extends Component {
  //App component, which will return the div which contains the phone number and access code's forms.
  render() {
    return (
      <div className="App">
        <div>
        <PhoneForm />
        </div>
      </div>
    );
  }
}

export default App;