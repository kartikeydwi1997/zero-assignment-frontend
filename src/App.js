
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    zipcode: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);
  const handleFirstNameInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      firstName: event.target.value,
    }));
  };
  const handleLastNameInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      lastName: event.target.value,
    }));
  };

  const handleZipCodeInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      zipcode: event.target.value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (values.firstName && values.lastName && values.zipcode) {
      setValid(true);
      console.log(values);
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: values.firstName + " " + values.lastName, zip: values.zipcode })
      };
      fetch('https://zip-county-api.herokuapp.com/create_phase', requestOptions)
        .then(async response => {
          const isJson = response.headers.get('content-type')?.includes('application/json');
          const data = isJson && await response.json();
          // check for error response
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          } else {
            if (!data.hasOwnProperty('Error')) {
              setResponseText(data.pig_latin_name + "’s zip code is in " + data.county + " and has a population of " + data.population)
              setError("");
            }
            else {
              setResponseText("")
              setError("Error: Zipcode not found");

            }
          }
        })
        .catch(error => {
          console.error('There was an error!', error);
        });
    }
    setSubmitted(true);
  }
  return (
    <div className="App">
      <header className="App-header">
        <b>Zero assignment</b>

        <div className="form-container">
          <form class="register-form" onSubmit={handleSubmit}>
            <input
              id="first-name"
              className="form-field"
              type="text"
              placeholder="First Name"
              name="firstName"
              onChange={handleFirstNameInputChange}
            />
            {submitted && !values.firstName && <span id='first-name-error'>Please enter a first name</span>}
            <input
              id="last-name"
              className="form-field"
              type="text"
              placeholder="Last Name"
              name="lastName"
              onChange={handleLastNameInputChange}
            />
            {submitted && !values.lastName && <span id='last-name-error'>Please enter a last name</span>}

            <input
              id="zipcode"
              className="form-field"
              type="text"
              placeholder="zipcode"
              name="zipcode"
              onChange={handleZipCodeInputChange}
            />
            {submitted && !values.zipcode && <span id='email-error'>Please enter a zipcode</span>}
            <button className="form-field" type="submit">
              Submit
            </button>
          </form>

        </div>
        <span className='output'>{responseText}</span>
        <span className='errorText'>{error}</span>
      </header>


    </div>
  );
}

export default App;
