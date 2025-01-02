import React, { useState } from 'react';
import { Modal, MessageBar, MessageBarType } from '@fluentui/react';
import axios from 'axios';
import Footer from './Footer';
import CloseIcon from '@mui/icons-material/Close';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import '../assets/Homepage.css';


const Homepage = ({ handlePageChange, setPatientName, setDoctorName, email }) => {
  const [isPatientConfirmModal, setIsPatientConfirmModal] = useState(false);
  const [isDoctorConfirmModal, setIsDoctorConfirmModal] = useState(false);
  const [error, setError] = useState('');
  const [patientName, setLocalPatientName] = useState('');
  const [doctorName, setLocalDoctorName] = useState('');
  const [patientUniqueId, setPatientUniqueId] = useState('');
  const [doctorUniqueId, setDoctorUniqueId] = useState('');

  const closePatientSaveModal = () => {
    const values = {
      patient_name: patientName,  // Use patient_name to match backend
      patient_id: patientUniqueId // Use patient_id to match backend
    };
  
    axios.post('http://localhost:8086/verify', values)
      .then(res => {
        if (res.data === "Success") {  // Check for "Success" directly
          setPatientName(values.patient_name); // Set patient name in parent component
          handlePageChange('Patient_data_view');
        } else {
          setError('Invalid Name or User ID');
        }
      })
      .catch(err => {
        setError('An error occurred. Please try again.');
        console.error(err);
      });
  };
  

  const closeDoctorSaveModal = () => {
    const values = {
      name: doctorName,
      userId: doctorUniqueId
    };

    axios.post('http://localhost:8086/verify_Doctor', values)
      .then(res => {
        if (res.data === "Success") {
          setDoctorName(doctorName);
          handlePageChange('Doctor_homepage');
        } else {
          setError('Invalid Name or User ID');
        }
      })
      .catch(err => {
        setError('An error occurred. Please try again.');
        console.error(err);
      });
  };

  const patientConfirm = () => {
    setIsPatientConfirmModal(true);
  };

  const doctorConfirm = () => {
    setIsDoctorConfirmModal(true);
  };

  const gotohomepage = () => {
    setIsPatientConfirmModal(false);
    setError('');
  };

  const gotohomepage1 = () => {
    setIsDoctorConfirmModal(false);
    setError('');
  };

  return (
    <>
      <div className='homecontainer'>
        <div className="navbar">
          <div className="navbar-content">
            <div className="navbar-item"> <div className='logo' style={{ marginTop: "-70px" }}>

            </div>
            </div>
            <div className="navbar-item" style={{ marginLeft: "950px" }}>Home</div>
            <div className="navbar-item">About</div>
            <div className="navbar-item">Gallery</div>
            <div className="navbar-item">Contact</div>

            <div>
              <AccountBoxIcon style={{ marginLeft: "20px", fontSize: "70px" }} />

              <h4 style={{ marginLeft: "-20px", marginTop: "10px" }}>{email}</h4>
            </div>
          </div>
        </div>


        <br />
        <div className='card-container'>
          <div className="card" onClick={patientConfirm}>
            <h3>Patient</h3>
            <p>Access patient data and manage medical history.</p>
          </div>
          <div className="card" onClick={doctorConfirm}>
            <h3>Doctor</h3>
            <p>Access and manage patient records as a doctor.</p>
          </div>
        </div>

        {/* Patient confirmation modal */}
        <Modal isOpen={isPatientConfirmModal} onDismiss={gotohomepage} className="customModal">
          <div className="modalContent">
            <CloseIcon style={{ marginLeft: "340px", marginTop: "-20px", cursor: "pointer" }} onClick={gotohomepage} />
            <h2 style={{ marginLeft: "10px" }}>Confirm Patient Information</h2>
            <label htmlFor="patientName" style={{ fontSize: "16px", marginRight: "260px" }}>Name:</label>
            <input
              type="text"
              id="patientName"
              value={patientName}
              onChange={(e) => setLocalPatientName(e.target.value)}
              placeholder="Enter Patient Name"
              className={`input-field ${error ? 'error' : ''}`}
            />
            <br />
            <label htmlFor="patientUniqueId" style={{ fontSize: "16px", marginRight: "240px" }}>UniqueID:</label>
            <input
              type="text"
              id="patientUniqueId"
              value={patientUniqueId}
              onChange={(e) => setPatientUniqueId(e.target.value)}
              placeholder="Enter Unique ID"
              className={`input-field ${error ? 'error' : ''}`}
            />
            <br />
            {error && (
              <MessageBar
                messageBarType={MessageBarType.error}
                className="message-bar-error"
              >
                {error}
              </MessageBar>
            )}
            <button className="btn btn-primary" onClick={closePatientSaveModal}>OK</button>
          </div>
        </Modal>

        {/* Doctor confirmation modal */}
        <Modal isOpen={isDoctorConfirmModal} onDismiss={gotohomepage1} className="customModal">
          <div className="modalContent">
            <CloseIcon style={{ marginLeft: "340px", marginTop: "-20px", cursor: "pointer" }} onClick={gotohomepage1} />
            <h2 style={{ marginLeft: "20px" }}>Confirm Doctor Information</h2>
            <label htmlFor="doctorName" style={{ fontSize: "16px", marginRight: "260px" }}>Name:</label>
            <input
              type="text"
              id="doctorName"
              value={doctorName}
              onChange={(e) => setLocalDoctorName(e.target.value)}
              placeholder="Enter Doctor Name"
              className={`input-field ${error ? 'error' : ''}`}
            />
            <br />
            <label htmlFor="doctorUniqueId" style={{ fontSize: "16px", marginRight: "240px" }}>Unique ID:</label>
            <input
              type="text"
              id="doctorUniqueId"
              value={doctorUniqueId}
              onChange={(e) => setDoctorUniqueId(e.target.value)}
              placeholder="Enter Unique ID"
              className={`input-field ${error ? 'error' : ''}`}
            />
            <br />
            {error && (
              <MessageBar
                messageBarType={MessageBarType.error}
                className="message-bar-error"
              >
                {error}
              </MessageBar>
            )}
            <button className="btn btn-primary" onClick={closeDoctorSaveModal}>OK</button>
          </div>
        </Modal>
      </div>
      <Footer />
    </>
  );
};

export default Homepage;
