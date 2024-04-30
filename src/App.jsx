import React, {useState, useEffect } from 'react';
import taxRatesData from './TaxRates.json';

export default function App() {
  const [show, setShow] = useState(false);
  const [earnings, setEarnings] = useState('');
  const [endTime, setEndTime] = useState('');
  const [startTime, setStartTime] = useState('');
  const [showData, setShowData] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [result, setResult] = useState(0);
  const [inputs, setInputs] = useState({
    firstName: '',
    jobTitle: '',
    salary: '',
    workHours: '',
    state: '',
  })


  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const toggleStop = () => {
    setEndTime(time);
    clearInterval(intervalId);
    setIntervalId(null);
  }

  const toggleClear = () => {
    setEndTime('')
    setStartTime('')
    setEarnings('')
    setResult(0)
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
    setShowData(false)
  }

  const handleChange = (e) => {
    const capitalizedValue = e.target.value
      .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
    setInputs({
      ...inputs,
      [e.target.name]: capitalizedValue,
    });
  };
  
  
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Create a copy of the inputs object with trimmed values
    const trimmedInputs = {
      firstName: inputs.firstName.trim(),
      jobTitle: inputs.jobTitle.trim(),
      salary: inputs.salary.trim(),
      workHours: inputs.workHours.trim(),
      state: inputs.state.trim(),
    };
  
    // Validate inputs using the trimmed values
    if (
      trimmedInputs.firstName === '' ||
      isNaN(parseFloat(trimmedInputs.salary)) ||
      isNaN(parseFloat(trimmedInputs.workHours)) ||
      parseFloat(trimmedInputs.workHours) <= 0 ||
      parseFloat(trimmedInputs.salary) <= 0
    ) {
      setError('Invalid input values');
      setShowError(true);
      return;
    }
  
    // Validate if fields are empty
    if (
      trimmedInputs.firstName === '' ||
      trimmedInputs.salary === '' ||
      trimmedInputs.workHours === '' ||
      trimmedInputs.state === ''
    ) {
      setError('Required fields cannot be empty');
      setShowError(true);
      return;
    }
  
    const validStates = Object.keys(taxRatesData);
    if (!validStates.includes(trimmedInputs.state)) {
      setError('Invalid State');
      setShowError(true);
      return;
    }
  
    setShow(false);
    setStartTime(time);
  
    const stateTaxRate = taxRatesData[trimmedInputs.state];
    const earningsPerSecond = parseFloat(trimmedInputs.salary) / (parseFloat(trimmedInputs.workHours) * 3600 * (1 + stateTaxRate));
    setEarnings(Number(earningsPerSecond.toFixed(4)));
    setShowData(true);
    setTimeout(() => {
      setShowError(false);
    }, 3000);
  }
  
  useEffect(() => {
    const id = setInterval(() => {
      setResult((prevResult) => {
        // Calculate the sum of prevResult and earnings
        const sum = prevResult + Number(earnings);
        // Round the sum to four decimal places
        const roundedSum = Number(sum.toFixed(4));
        return roundedSum;
      });
    }, 1000);
    setIntervalId(id);
    return () => clearInterval(id);
  }, [earnings]);
  
  
  

  return (
    <div className="justify-center items-center py-20 bg-gray-800 grow h-screen">
        {/* Modal for inputting data */}
          <div className={`z-60 inset-0 overflow-y-auto ${show === false ? 'hidden' : 'block'}`}>
            <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
            <div className='bg-white rounded-lg p-5 w-80 z-60 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transform-all'>
              <p className="text-xl justify-center text-gray-700 my-1 lg:text-2xl">Add Your Information</p>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                  <input name="firstName" type="text" placeholder="First Name" 
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline ${inputs.firstName.trim() === '' ? 'border-red-500' : ''}`} 
                  value={inputs.firstName} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="jobTitle" className="block text-gray-700 text-sm font-bold mb-2">Job Title</label>
                  <input name="jobTitle" type="text" placeholder="Job Title" 
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline" 
                  value={inputs.jobTitle} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="salary" className="block text-gray-700 text-sm font-bold mb-2">Salary</label>
                  <input name="salary" type="number" placeholder="Hourly Wage" 
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline ${inputs.salary.trim() === '' ? 'border-red-500' : ''}`} 
                  value={inputs.salary} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="workHours" className="block text-gray-700 text-sm font-bold mb-2">Work Hours</label>
                  <input name="workHours" type="number" placeholder="Per day" 
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline ${inputs.workHours.trim() === '' ? 'border-red-500' : ''}`} 
                  value={inputs.workHours} onChange={handleChange} />
                </div>
                <div className="mb-4">
                  <label htmlFor="state" className="block text-gray-700 text-sm font-bold mb-2">State</label>
                  <input name="state" type="text" placeholder="State" 
                  className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-800 bg-white leading-tight focus:outline-none focus:shadow-outline ${inputs.state.trim() === '' ? 'border-red-500' : ''}`} 
                  value={inputs.state} onChange={handleChange} />
                </div>
              </form>
              {showError && (
              <p className={`border ${error === 'Required fields cannot be empty' || error === 'Invalid State' ? 'bg-red-500 text-white': 'border-green-500'}
              p-2 text-gray-900`}>
                {error}
              </p>
              )}
              <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2" onClick={handleSubmit}>Calculate</button>
              <button type="button" className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded" onClick={handleClose}>Cancel</button>
            </div>
            </div>   
          </div>

          <div className="justify-center items-center py-20 bg-gray-800">
            <div className="justify-center mx-auto px-4">
              <h2 className='text-3xl mb-12 font-bold text-center'>How Much Are You Making?</h2>
              <div className="text-center my-4">
                <button className='rounded-lg my-1 p-3 bg-black cursor-pointer' onClick={handleShow}>Calculate Earnings</button>
              </div>
              <div className={`${showData === false ? 'hidden' : 'block'}`}>
                <div className='text-center my-8'>
                  <p className='text-9xl font-bold text-blue-500'>{inputs.jobTitle} {inputs.firstName}'s Income</p>
                </div>
                <div className='text-center my-16'>
                <h1 className="text-9xl font-bold text-green-800">${result}</h1>
                </div>
                <div className="text-center my-4">
                  <div className='flex flex-row justify-center'>
                    <p className='inline-block md:mr-4'>Start Time: {startTime}</p>
                    <button className="p-2 bg-black inline-block mr-1 md:mx-4 sm:p-6" onClick={toggleStop}>Stop</button>
                    <button className="p-2 bg-black inline-block ml-1 md:mx-4 sm:p-6" onClick={toggleClear}>Clear</button>
                    <p className='inline-block md:ml-4'>End Time: {endTime}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
  );
}