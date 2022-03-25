
import { useState } from 'react';
import './App.css';

import BarChart from './BarChart';
function App() {
  /**
   * Set value of first name, last name and zip code initially as empty string
   */
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    zipcode: '',
  });
  const [chartData, setChartData] = useState([]);
  const [populationData, setPopulationData] = useState([]);
  /**
   * Set the value of submitted to false initially when button clicked set it to true
   */
  const [submitted, setSubmitted] = useState(false);
  /**
   * Represents the response received from the API call.
   */
  const [responseText, setResponseText] = useState('');
  /**
   * Represents the error received from the API call.
   */
  const [error, setError] = useState('');
  /** Check if it is valid to call the API to fetch the output */
  const [valid, setValid] = useState(false);
  /**
   * set the button loading to false
   */
  const[loading,setloading]=useState(false);
  /**
   *  Update the value of first name 
   */
  const handleFirstNameInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      firstName: event.target.value,
    }));
  };
    /**
   *  Update the value of last name 
   */
  const handleLastNameInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      lastName: event.target.value,
    }));
  };
  /**
   *  Update the value of zipcode
   */
  const handleZipCodeInputChange = (event) => {
    event.persist();
    setValues((values) => ({
      ...values,
      zipcode: event.target.value,
    }));
  };
  /**
   * @method handleSubmit This function is called when the button is clicked.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (values.firstName && values.lastName && values.zipcode) {
      setValid(true);
      setloading(true);
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
          setloading(false);
          if (!response.ok) {
            // get error message from body or default to response status
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
          } else {
            if (!data.hasOwnProperty('Error')) {
              var graphData=data.neighbors;
              var label=[];
              var population=[];
              // console.log(graphData.forEach((value, index) =>console.log(value)));
            
              graphData.forEach((value, index) => label.push('Zipcode '+value[0]) && population.push(value[1]));
              // console.log(population,label)
              setPopulationData(population);
              setChartData(label);
             
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
            <button className="form-field" type="submit" disabled={loading}>
              {loading && <div>Loading...</div>}
              {!loading && <div>Submit</div>}
            </button>
          </form>

        </div>
        <span className='output'>Result- {responseText}</span>
        <span className='errorText'>{error}</span>
        {/* <br/> */}
     <div className='chart'>{chartData.length!=0?<BarChart data={chartData} population={populationData} />:null}</div>
      
      </header>


    </div>
  );
}

export default App;
