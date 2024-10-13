import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import Create from './components/Create';
import Read from './components/Read';
import Error from './components/Error';
import Update from './components/Update';
import Signup from './components/Signup';
import Login from './components/Login';
import Homepage from './components/Homepage';
import Patient_data_view from './components/Patient_data_view';
import Doctor_homepage from './components/Doctor_homepage';
import Access from './components/Access';

function App() {
  const [pageName, setPageName] = useState('');
  const [email, setEmail] = useState('');  
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');

  const handlePageChange = (newPageName) => {
    setPageName(newPageName); 
  };

  return (
    <Router>
      <Routes>
        {/* Define your routes here if needed */}
      </Routes>

      {/* Render the current page conditionally based on pageName */}
      {pageName === '' && <Access handlePageChange={handlePageChange} />}
      {pageName === 'Login' && <Login handlePageChange={handlePageChange} setEmail={setEmail} />} {/* Pass setEmail */}
      {pageName === 'Signup' && <Signup handlePageChange={handlePageChange} />}
      {pageName === 'Read' && <Read handlePageChange={handlePageChange} />}
      {pageName === 'Create' && <Create handlePageChange={handlePageChange} />}
      {pageName === 'Update' && <Update handlePageChange={handlePageChange} />}
      {pageName === 'Homepage' && <Homepage handlePageChange={handlePageChange} setPatientName={setPatientName} setDoctorName={setDoctorName} email={email} />} {/* Pass email */}
      {pageName === 'Patient_data_view' && <Patient_data_view handlePageChange={handlePageChange} patientName={patientName} />}
      {pageName === 'Doctor_homepage' && <Doctor_homepage handlePageChange={handlePageChange} doctorName={doctorName} />}
      {pageName === 'Error' && <Error handlePageChange={handlePageChange} />}
    </Router>
  );
}

export default App;
