import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '@fluentui/react/lib/Modal';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from './Navbar';
import styles from '../assets/Patient_data_view.module.css'; // Import styles
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { format } from 'date-fns'; // For date formatting

const Patient_data_view = ({ handlePageChange, patientName }) => {
  const [data, setData] = useState([]);
  const [searchTermDoctor, setSearchTermDoctor] = useState('');
  const [searchTermMedical, setSearchTermMedical] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch patient data by name
  const fetchPatientDataByName = async () => {
    try {
      const response = await axios.get(`http://localhost:8086/getPatientData/${patientName}`);
      console.log('Patient data:', response.data); // Log the response to check for 'medical'
      if (response.status === 200) {
        setData(response.data); // Set the fetched data to state
        setMessage('');
      } else {
        setMessage('Patient not found');
      }
    } catch (error) {
      console.error('Error fetching patient data:', error);
      setMessage('Error fetching patient data');
    }
  };

  // Fetch data when the patientName changes
  useEffect(() => {
    if (patientName) {
      fetchPatientDataByName();
    }
  }, [patientName]);

  // Filter the data based on search terms
  const filteredData = data.filter(
    (item) =>
      (!searchTermDoctor || item.doctor_name.toLowerCase().includes(searchTermDoctor.toLowerCase())) &&
      (!searchTermMedical || item.medical.toLowerCase().includes(searchTermMedical.toLowerCase()))
  );

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <button
          className="btn btn-primary mb-3"
          style={{ marginLeft: '5px' }}
          onClick={() => handlePageChange('Homepage')}
        >
          Go to Homepage
        </button>
        <br></br>
        <h2 style={{marginLeft:"700px"}}>My Medical History</h2>

        <div className={styles.profile}>
          <div className={styles.profileInfo}>
           
            <AccountBoxIcon style={{ fontSize: '100px' }} />
            <h5 className={styles.patientName}>{patientName}</h5>
          </div>
        </div>  

        <div className={styles.filterSection}>
          <SearchBox
            placeholder="Search by Doctor Name"
            value={searchTermDoctor}
            onChange={(e, newValue) => setSearchTermDoctor(newValue)}
            styles={{ root: { width: 250, marginRight: 10 } }}
          />
          <SearchBox
            placeholder="Search by Medical Condition"
            value={searchTermMedical}
            onChange={(e, newValue) => setSearchTermMedical(newValue)}
            styles={{ root: { width: 250 } }}
          />
        </div>

        {filteredData.length > 0 ? (
  <table className={`table table-bordered ${styles.table}`}>
    <thead>
      <tr>
        <th>Date</th>
        <th>Doctor Name</th>
        <th>Medical Condition</th>
        <th>Description</th>
      </tr>
    </thead>
    <tbody>
      {filteredData.map((item) => (
        <tr key={item.id}>
          {/* Format the patient_date field in DD-MM-YY format */}
          <td>{item.patient_date ? format(new Date(item.patient_date), 'dd-MM-yy') : 'No Date Available'}</td>
          <td>{item.doctor_name}</td>
          <td>{item.medical ? item.medical : 'No Medical Data Available'}</td>
          <td>{item.description}</td>
        </tr>
      ))}
    </tbody>

    
  </table>
) : (
  <p>{message || 'No patient data available'}</p>
)}
<br></br>
<button style={{marginLeft:"700px"}}  onClick={() => handlePageChange('Homepage')}>Back</button>
      </div>

      {/* Modal for delete confirmation */}
      <Modal isOpen={isDeleteConfirmModal} onDismiss={() => setIsDeleteConfirmModal(false)}>
        <div className={styles.modalHeader}>
          <CloseIcon onClick={() => setIsDeleteConfirmModal(false)} />
          <h5>Confirm Deletion</h5>
        </div>
        <div className={styles.modalBody}>
          <p>Are you sure you want to delete this record?</p>
          <button className="btn btn-danger" onClick={() => { /* Handle delete confirmation */ }}>
            Yes, Delete
          </button>
          <button className="btn btn-secondary" onClick={() => setIsDeleteConfirmModal(false)}>
            Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Patient_data_view;
