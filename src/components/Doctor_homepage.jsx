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
import '../assets/Doctor_homepage.css';

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
        medical: item.medical || 'No Medical Data Available', // Handle medical data
      }));
      setData(formattedData); // Update state with fetched data
      console.log('Data fetched successfully:', formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sortData = (key) => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder[key] === 'asc') {
        return key === 'date' ? new Date(a[key]) - new Date(b[key]) : (a[key] || '').localeCompare(b[key] || '');
      } else {
        return key === 'date' ? new Date(b[key]) - new Date(a[key]) : (b[key] || '').localeCompare(a[key] || '');
      }
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, [key]: sortOrder[key] === 'asc' ? 'desc' : 'asc' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8086/deleteData/${id}`);
      console.log('Item deleted successfully');
      getData(); // Refresh data after deletion
      setIsDeleteConfirmModal(false); // Close delete confirmation modal
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmModal(true); // Show delete confirmation modal
  };

  const handleDeleteConfirmation = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
      setDeleteId(null); // Clear deleteId after successful deletion
    }
  };

  const cancelDeleteConfirmation = () => {
    setIsDeleteConfirmModal(false); // Close delete confirmation modal
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

  const capitalizeFirstLetter = (string) => {
    return (string || '').charAt(0).toUpperCase() + (string || '').slice(1).toLowerCase();
  };

  const filteredData = data.filter((item) => {
    const matchesName = (item.name || '').toLowerCase().includes(searchTerm.toLowerCase());
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
    localStorage.setItem('Name', item.name);
    localStorage.setItem('Email', item.email);
    localStorage.setItem('Date', item.date);
    localStorage.setItem('Age', item.age);
    localStorage.setItem('Gender', item.gender);
    localStorage.setItem('Medical', item.medical); // Store medical as needed
    localStorage.setItem('Description', item.description);
    handlePageChange('Update');
  };

  return (
    <div className="container mt-3">
      <div className='profile'>
        <button className="btn btn-primary mb-3" title="Go-to homepage" style={{marginLeft:"-1200px"}} onClick={goToHomepage}>
          <ArrowBackIosIcon />
          Homepage
        </button>
        <h3 className="form-title">My Patient History</h3>
        <AccountBoxIcon style={{fontSize: "100px", marginRight:"1000px"}} />
      </div>
      <h2 style={{marginLeft:"1400px"}}>{doctorName}</h2>

      <div>
        <div className='search-add-button'>
          <div className='search'>
            <div className='searchinput'>
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
            <div className='gender'>
              <label><h6>Gender:</h6></label>
              <select value={genderTerm} onChange={genderChange}>
                <option value="">All</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className='medical'>
              <label><h6>Medical Condition:</h6></label>
              <input
                type='text'
                placeholder='Search by Medical Condition'
                value={medicalTerm}
                onChange={handleMedicalChange}
              />
            </div>
          </div>

          <button className="btn btn-primary mb-3 add-button" onClick={addPatient}>
            <AddIcon />
            Add New Patient
          </button>
        </div>

        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col" onClick={() => sortData('name')}>Name {sortOrder.name === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</th>
              <th scope="col" onClick={() => sortData('age')}>Age {sortOrder.age === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</th>
              <th scope="col" onClick={() => sortData('gender')}>Gender</th>
              <th scope="col" onClick={() => sortData('medical')}>Medical Condition</th>
              <th scope="col" onClick={() => sortData('date')}>Date {sortOrder.date === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
  {filteredData.length === 0 ? (
    <tr>
      <td colSpan="7">
        <div style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', paddingTop: '20px' }}>{message}</div>
      </td>
    </tr>
  ) : (
    filteredData.map((item) => (
      <tr key={item.id}>
        <td>{item.name ? capitalizeFirstLetter(item.name) : 'No Name Available'}</td>
        <td>{item.age}</td>
        <td>{capitalizeFirstLetter(item.gender)}</td>
        <td>{item.medical}</td>
        <td>{new Date(item.date).toLocaleDateString()}</td>
        <td>
          <EditButtonWithTooltip onClick={() => goToUpdate(item)} />
          <DeleteButtonWithTooltip onClick={() => confirmDelete(item.id)} />
        </td>
      </tr>
    ))
  )}
</tbody>

        </table>
      </div>

      <Modal
        isOpen={isDeleteConfirmModal}
        onDismiss={cancelDeleteConfirmation}
      >
        <div className="modal-content">
          <CloseIcon className="modal-close" onClick={cancelDeleteConfirmation} />
          <h2>Confirm Delete</h2>
          <p>Are you sure you want to delete this patient record?</p>
          <button className="btn btn-danger" onClick={handleDeleteConfirmation}>
            Yes, Delete
          </button>
          <button className="btn btn-secondary" onClick={cancelDeleteConfirmation}>
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Doctor_homepage;
