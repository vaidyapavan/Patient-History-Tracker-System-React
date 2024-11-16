import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styles from '../assets/Doctor_homepage.module.css';
import {
  DatePicker,
  defaultDatePickerStrings,
} from '@fluentui/react';

const Doctor_homepage = ({ handlePageChange, doctorName }) => {
  const [data, setData] = useState([]);
  const [searchName, setSearchName] = useState('');  // For patient name
  const [searchId, setSearchId] = useState('');      // For patient ID
  const [message, setMessage] = useState('');
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sortOrder, setSortOrder] = useState({ date: 'asc', name: 'asc', age: 'asc' });
  const [genderTerm, setGenderTerm] = useState('');
  const [medicalTerm, setMedicalTerm] = useState('');
  const [startDate, setStartDate] = useState(null); // To store start date
  const [endDate, setEndDate] = useState(null); // To store end date
  const [filteredDataState, setFilteredDataState] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:8086/patientDataForDoctor');
      const formattedData = response.data.map(item => ({
        ...item,
        medical: item.medical || 'No Medical Data Available',
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sortData = (key) => {
    const sortedData = [...filteredData].sort((a, b) => {
      let comparison = 0;
      if (key === 'date') {
        comparison = new Date(a.patient_date) - new Date(b.patient_date);
      } else if (key === 'name') {
        comparison = (a.patient_name || '').localeCompare(b.patient_name || '');
      } else if (key === 'age') {
        comparison = (a.age || 0) - (b.age || 0);
      }
      return sortOrder[key] === 'asc' ? comparison : -comparison;
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, [key]: sortOrder[key] === 'asc' ? 'desc' : 'asc' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8086/deleteData/${id}`);
      getData(); // Refresh data after deletion
      setIsDeleteConfirmModal(false);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmModal(true);
  };

  const handleDeleteConfirmation = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
      setDeleteId(null);
    }
  };

  const cancelDeleteConfirmation = () => {
    setIsDeleteConfirmModal(false);
    setDeleteId(null);
  };

  const genderChange = (e) => {
    setGenderTerm(e.target.value);
  };

  const handleMedicalChange = (e) => {
    setMedicalTerm(e.target.value);
  };

  const handleSearchNameChange = (e) => {
    setSearchName(e.target.value);
  };

  const handleSearchIdChange = (e) => {
    setSearchId(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const matchesName = (item.patient_name || '').toLowerCase().includes(searchName.toLowerCase());
    
    // Handle date range filtering
    const itemDate = item.patient_date ? new Date(item.patient_date) : null;
    const isWithinDateRange =
      (!startDate || (itemDate && itemDate >= startDate)) &&
      (!endDate || (itemDate && itemDate <= endDate));
  
    // Handle ID matching
    const matchesId = searchId === '' || (item.patient_id && item.patient_id.toString().includes(searchId));
  
    // Gender and medical condition matching
    const matchesGender = genderTerm === '' || (item.gender || '').toLowerCase() === genderTerm.toLowerCase();
    const matchesMedical = medicalTerm === '' || (item.medical || '').toLowerCase().includes(medicalTerm.toLowerCase());
  
    return isWithinDateRange && matchesName && matchesId && matchesGender && matchesMedical;
  });
  const handleGoClick = () => {
    setFilteredDataState(filteredData);  // Store filtered data in state
  };
  useEffect(() => {
    if ((searchName || searchId || genderTerm || medicalTerm) && filteredData.length === 0) {
      setMessage('No data found');
    } else {
      setMessage('');
    }
  }, [searchName, searchId, genderTerm, medicalTerm, filteredData]);

  const addPatient = () => {
    handlePageChange('Create');
  };

  const goToHomepage = () => {
    handlePageChange('Homepage');
  };

  const goToUpdate = (item) => {
    localStorage.setItem('ID', item.id);
    localStorage.setItem('Name', item.patient_name);
    localStorage.setItem('PatientID', item.patient_id);
    localStorage.setItem('Email', item.patient_email);
    localStorage.setItem('Date', item.patient_date);
    localStorage.setItem('Age', item.age);
    localStorage.setItem('Gender', item.gender);
    localStorage.setItem('Medical', item.medical);
    localStorage.setItem('Description', item.description);
    handlePageChange('Update');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.profile}>
        <button className="btn btn-primary mb-3" title="Go-to homepage" onClick={goToHomepage}>
          <ArrowBackIosIcon />
          Homepage
        </button>
        <h3>My Patient History</h3>
        <AccountBoxIcon style={{ fontSize: "80px", marginRight: "40px" }} />
      </div>
      <h2 style={{ marginLeft: "1420px" }}>{doctorName}</h2>

      <div>
        <div className={styles.search}>
          <div className={styles.searchInputs}>
            
            <input
              type='text'
              placeholder='Enter your Patient Name'
              value={searchName}
              onChange={handleSearchNameChange}  
            />
            <input
              type='text'
              placeholder='Enter your Patient ID'
              value={searchId}
              onChange={handleSearchIdChange}  
            />
          </div>
          <div className={styles.gender}>
            <label><h6>Gender:</h6></label>
            <select value={genderTerm} onChange={genderChange}>
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className={styles.medical}>
            <label><h6>Medical Condition:</h6></label>
            <input
              type='text'
              placeholder='Search by Medical Condition'
              value={medicalTerm}
              onChange={handleMedicalChange}
            />
          </div>
          <div>
            <DatePicker
              className={styles.startDatePicker}
              placeholder='Select start date'
              value={startDate}
              onSelectDate={(date) => setStartDate(date)}
              strings={defaultDatePickerStrings}
              styles={{

                textField: { paddingRight: 30 },
              }}
            />
          </div>
          <div>
            <DatePicker
              placeholder='Select end Date'
              value={endDate}
              onSelectDate={(date) => setEndDate(date)}
              strings={defaultDatePickerStrings}
              styles={{

                textField: { paddingRight: 30 },

              }}
            />
          </div>
          <div>   
           <button className="btn btn-primary mb-3 add-button" onClick={addPatient} style={{marginRight:"10px"}} >
          <AddIcon />
          Add New Patient 
        </button>
        </div>
       
        </div>
       

        {message && <p>{message}</p>}

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th onClick={() => sortData('date')}> Doctor Visiting Date {sortOrder.date === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</th>
                <th onClick={() => sortData('name')}> Patient Name {sortOrder.name === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</th>
                <th>Patient ID</th>
                <th onClick={() => sortData('age')}>Age {sortOrder.age === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</th>
                <th>Gender</th>
                <th>Doctpr prescription</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map(item => (
                <tr key={item.id}>
                  <td>{formatDate(item.patient_date)}</td>
                  <td>{item.patient_name}</td>
                  <td>{item.patient_id}</td>
                  <td>{item.age}</td>
                  <td>{item.gender}</td>
                  <td>{item.medical}</td>
                  <td>{item.description}</td>
                  <td>
          
                    <EditIcon onClick={() => goToUpdate(item)} className={styles.editIcon}></EditIcon>
                    <DeleteIcon onClick={() => confirmDelete(item.id)} className={styles.deleteIcon}></DeleteIcon>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br></br>
        <div className={styles.footer}>
          <button style={{ marginLeft: "700px" }} onClick={() => handlePageChange('Homepage')}>Back</button>
        </div>
      </div>

      <Modal
        isOpen={isDeleteConfirmModal}
        onDismiss={cancelDeleteConfirmation}
        isBlocking={false}
      >
        <div className={styles.deleteConfirmModal}>
          <h4>Are you sure you want to delete this record?</h4>
          <button onClick={handleDeleteConfirmation} className="btn btn-danger">Yes</button>
          <button onClick={cancelDeleteConfirmation} className="btn btn-secondary">No</button>
        </div>
      </Modal>
    </div>
  );
};

export default Doctor_homepage;
