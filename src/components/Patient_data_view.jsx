import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '@fluentui/react/lib/Modal';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from './Navbar';
import styles from '../assets/Patient_data_view.module.css'; // Import styles
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { format } from 'date-fns'; // For date formatting
import {
  DatePicker,
  defaultDatePickerStrings,
} from '@fluentui/react';

const Patient_data_view = ({ handlePageChange, patientName }) => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTermDoctor, setSearchTermDoctor] = useState('');
  const [searchTermMedical, setSearchTermMedical] = useState('');
  const [message, setMessage] = useState('');
  const [startDate, setStartDate] = useState(null); // To store start date
  const [endDate, setEndDate] = useState(null); // To store end date
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // Fetch patient data by name
  const fetchPatientDataByName = async () => {
    try {
      const encodedName = encodeURIComponent(patientName); // Encode the patient name
      const response = await axios.get(`http://localhost:8086/getPatientData/${encodedName}`);
      if (response.status === 200) {
        setData(response.data); // Set the fetched data to state
        setFilteredData(response.data); // Initially set filteredData to all data
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

  // Filter data based on search terms and date range
  const filterData = () => {
    const filtered = data.filter((item) => {
      const itemDate = item.patient_date ? new Date(item.patient_date) : null;
      const isWithinDateRange =
        (!startDate || (itemDate && itemDate >= startDate)) &&
        (!endDate || (itemDate && itemDate <= endDate));
      const matchesDoctor = !searchTermDoctor || item.doctor_name.toLowerCase().includes(searchTermDoctor.toLowerCase());
      const matchesMedical = !searchTermMedical || item.medical.toLowerCase().includes(searchTermMedical.toLowerCase());

      return isWithinDateRange && matchesDoctor && matchesMedical;
    });

    if (filtered.length > 0) {
      setFilteredData(filtered);
      setMessage('');
    } else {
      setFilteredData([]);
      setMessage('No data present in this range');
    }
  };

  // Trigger the filtering when search terms change
  useEffect(() => {
    filterData(); // Automatically filter when searchTermDoctor or searchTermMedical changes
  }, [searchTermDoctor, searchTermMedical, startDate, endDate]);

  // Trigger filtering based on date when "GO" is clicked
  

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
        <br />
        <h2 style={{ marginLeft: '700px' }}>My Medical History</h2>

        <div className={styles.profile}>
          <div className={styles.profileInfo}>
            <AccountBoxIcon style={{ fontSize: '100px', marginTop: '-100px' }} />
            <h5 className={styles.patientName}>{patientName}</h5>
          </div>
        </div>

        <div className={styles.filterSection}>
          <SearchBox
            placeholder="Search by Doctor Name"
            value={searchTermDoctor}
            onChange={(e, newValue) => setSearchTermDoctor(newValue || '')}
            styles={{ root: { width: 250, marginRight: 10 } }}
          />
          <SearchBox
            placeholder="Search by Doctor prescription"
            value={searchTermMedical}
            onChange={(e, newValue) => setSearchTermMedical(newValue || '')}
            styles={{ root: { width: 250 } }}
          />

          <DatePicker
            className={styles.startDatePicker}
            placeholder="Select start date"
            value={startDate}
            onSelectDate={(date) => {
              setStartDate(date);
              filterData(); // Trigger filtering when start date is selected
            }}
            strings={defaultDatePickerStrings}
            styles={{
              root: { width: 250 }, 
              textField: { paddingRight: 30 }, 
              icon: { right: 10 }, 
            }}
          />
          <DatePicker
            placeholder="Select end Date"
            value={endDate}
            onSelectDate={(date) => {
              setEndDate(date);
              filterData(); // Trigger filtering when end date is selected
            }}
            strings={defaultDatePickerStrings}
            styles={{
              root: { width: 250 }, // Adjust the width
              textField: { paddingRight: 30 }, // Space between text and calendar icon
              icon: { right: 5 }, // Space the calendar icon from the text field's right side
            }}
          />

        </div>

        {filteredData.length > 0 ? (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Doctor Visit Date</th>
                  <th>Doctor Name</th>
                  <th>Doctor prescription</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.patient_date ? format(new Date(item.patient_date), 'dd-MM-yy') : 'No Date Available'}</td>
                    <td>{item.doctor_name}</td>
                    <td>{item.medical ? item.medical : 'No Medical Data Available'}</td>
                    <td>{item.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>{message || 'No patient data available'}</p>
        )}

        <br />
        <div className={styles.footer}>
          <button style={{ marginLeft: '700px' }} onClick={() => handlePageChange('Homepage')}>
            Back
          </button>
        </div>
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
