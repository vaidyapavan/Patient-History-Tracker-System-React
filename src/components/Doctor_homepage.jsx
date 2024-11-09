import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import DeleteButtonWithTooltip from './DeleteButtonWithTooltip';
import EditButtonWithTooltip from './EditButtonWithTooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import styles from '../assets/Doctor_homepage.module.css';

const Doctor_homepage = ({ handlePageChange, doctorName }) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sortOrder, setSortOrder] = useState({ date: 'asc', name: 'asc', age: 'asc' });
  const [genderTerm, setGenderTerm] = useState('');
  const [medicalTerm, setMedicalTerm] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    getData(); // Fetch data when component mounts
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:8086/patientDataForDoctor');
      const formattedData = response.data.map(item => ({
        ...item,
        medical: item.medical || 'No Medical Data Available',
      }));
      setData(formattedData);
      console.log('Data fetched successfully:', formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sortData = (key) => {
    const sortedData = [...filteredData].sort((a, b) => {
      let comparison = 0;

      // Handling different types of sorting
      if (key === 'date') {
        comparison = new Date(a.patient_date) - new Date(b.patient_date);
      } else if (key === 'name') {
        comparison = (a.patient_name || '').localeCompare(b.patient_name || '');
      } else if (key === 'age') {
        comparison = (a.age || 0) - (b.age || 0); // Assuming age is a number
      }

      return sortOrder[key] === 'asc' ? comparison : -comparison; // Ascending or descending
    });

    setData(sortedData);
    setSortOrder({ ...sortOrder, [key]: sortOrder[key] === 'asc' ? 'desc' : 'asc' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8086/deleteData/${id}`);
      console.log('Item deleted successfully');
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

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setMessage('');
  };

  const handleClear = () => {
    setSearchTerm('');
    setMessage('');
  };

  const genderChange = (e) => {
    setGenderTerm(e.target.value);
  };

  const handleMedicalChange = (e) => {
    setMedicalTerm(e.target.value);
  };

  const filteredData = data.filter((item) => {
    const matchesName = (item.patient_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderTerm === '' || (item.gender || '').toLowerCase() === genderTerm.toLowerCase();
    const matchesMedical = medicalTerm === '' || (item.medical || '').toLowerCase().includes(medicalTerm.toLowerCase());
    return matchesName && matchesGender && matchesMedical;
  });

  useEffect(() => {
    if ((searchTerm || genderTerm || medicalTerm) && filteredData.length === 0) {
      setMessage('No data found');
    } else {
      setMessage('');
    }
  }, [searchTerm, genderTerm, medicalTerm, filteredData]);

  const addPatient = () => {
    handlePageChange('Create');
  };

  const goToHomepage = () => {
    handlePageChange('Homepage');
  };

  const goToUpdate = (item) => {
    localStorage.setItem('ID', item.id);
    localStorage.setItem('Name', item.patient_name);
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
        <AccountBoxIcon style={{ fontSize: "80px", marginRight:"40px" }} />
      </div>
      <h2 style={{ marginLeft: "1420px" }}>{doctorName}</h2>

      <div>
        <div className={styles.search}>
          <div className={styles.searchinput}>
            <input
              type='text'
              placeholder='Search by Patient Name'
              value={searchTerm}
              onChange={handleChange}
            />
            {searchTerm ? (
              <CloseIcon onClick={handleClear} style={{ cursor: 'pointer' }} />
            ) : (
              <SearchIcon />
            )}
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
          <button className="btn btn-primary mb-3 add-button" onClick={addPatient}>
            <AddIcon />
            Add New Patient
          </button>
        </div>

        {message && <p>{message}</p>}

        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => sortData('date')}>Date {sortOrder.date === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</th>
              <th onClick={() => sortData('name')}>Name {sortOrder.name === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</th>
              <th onClick={() => sortData('age')}>Age {sortOrder.age === 'asc' ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}</th>
              <th>Gender</th>
              <th>Medical Condition</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{formatDate(item.patient_date)}</td>
                <td>{item.patient_name}</td>
                <td>{item.age}</td>
                <td>{item.gender}</td>
                <td>{item.medical}</td>
                <td>{item.description}</td>
                
                  <td>
                    <EditIcon className={styles.icon} onClick={() => goToUpdate(item)}>Edit</EditIcon>
                    <DeleteIcon className={styles.icon} onClick={() => confirmDelete(item.id)}>Delete</DeleteIcon>
                  </td>
              
              </tr>
            ))}
          </tbody>
        </table>
        <button style={{ marginLeft: "700px" }} onClick={goToHomepage}>Back</button>
      </div>

      {/* Modal for delete confirmation */}
      <Modal isOpen={isDeleteConfirmModal} onDismiss={cancelDeleteConfirmation}>
        <div className={styles.modalContent}>
          <CloseIcon  onClick={cancelDeleteConfirmation} className={styles.deleteCloseIcon}></CloseIcon>
          <h3>Are you sure to delete this record?</h3>
          <br></br>
     
          <button onClick={handleDeleteConfirmation} style={{marginLeft:"10px"}} className={styles.deletemodalbuttons}>Yes</button>
          <button onClick={cancelDeleteConfirmation} className={styles.deletemodalbuttons}>No</button>

          
        </div>
      </Modal>
    </div>
  );
};

export default Doctor_homepage;
