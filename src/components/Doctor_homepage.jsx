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

const Doctor_homepage = ({ handlePageChange, doctorName}) => {
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
      const response = await axios.get('http://localhost:8085/getData');
      setData(response.data); // Update state with fetched data
      console.log('Data fetched successfully:', response.data); // Log fetched data to console
    } catch (error) {
      console.error('Error fetching data:', error); // Log error if data fetch fails
    }
  };

  // Sorting functions
  const sortData = (key) => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder[key] === 'asc') {
        if (key === 'date') {
          return new Date(a[key]) - new Date(b[key]);
        }
        return (a[key] || '').localeCompare(b[key] || '');
      } else {
        if (key === 'date') {
          return new Date(b[key]) - new Date(a[key]);
        }
        return (b[key] || '').localeCompare(a[key] || '');
      }
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, [key]: sortOrder[key] === 'asc' ? 'desc' : 'asc' });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8085/deleteData/${id}`);
      console.log('Item deleted successfully');
      getData(); // Refresh data after deletion
      setIsDeleteConfirmModal(false); // Close delete confirmation modal
    } catch (error) {
      console.error('Error deleting item:', error); // Log error if deletion fails
    }
  };
  
  const confirmDelete = (id) => {
    console.log(`Preparing to delete item with ID: ${id}`); // Log the ID to confirm
    setDeleteId(id);
    setIsDeleteConfirmModal(true); // Show delete confirmation modal
  };
  
  const setToLocalStorageAndNavigate = (id, name, email, date, age, gender, medical, description) => {
    localStorage.setItem('ID', id);
    localStorage.setItem('Name', name);
    localStorage.setItem('Email', email);
    localStorage.setItem('Date', date);
    localStorage.setItem('Age', age);
    localStorage.setItem('Gender', gender);
    localStorage.setItem('Medical', medical);
    localStorage.setItem('Description', description);
    handlePageChange('Update');
  };

  const handleDeleteConfirmation = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
      setIsDeleteConfirmModal(false); // Close delete confirmation modal
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
    const matchesMedical = medicalTerm === '' || (item.medical || []).some(medical => medical.toLowerCase().includes(medicalTerm.toLowerCase()));
    return matchesName && matchesGender && matchesMedical;
  });

  useEffect(() => {
    if ((searchTerm || genderTerm || medicalTerm) && filteredData.length === 0) {
      setMessage('No data found');
    } else {
      setMessage('');
    }
  }, [searchTerm, genderTerm, medicalTerm, filteredData]);

  const addStudent = () => {
    handlePageChange('Create');
  };

  const goToHomepage = () => {
    handlePageChange('Homepage');
  };

  const goToUpdate = (item) => {
    setToLocalStorageAndNavigate(
      item.id,
      item.name,
      item.email,
      item.date,
      item.age,
      item.gender,
      item.medical,
      item.description
    );
  };

  return (
    <>
      <div className="container mt-3">
      <div className='profile'>
      <button className="btn btn-primary mb-3" title="Go-to homepage" style={{ marginLeft: '5px' }} onClick={goToHomepage}>
            <ArrowBackIosIcon />
            Homepage
          </button>
          <h2 className="form-title">My Patient History</h2>
        <AccountBoxIcon style={{ marginLeft: "900px", fontSize: "100px" }} />
        <h2 style={{ marginLeft: '-100px' }}>{doctorName}</h2>
        
      </div>
        
       
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
            <div className='medical' style={{marginLeft:"30px"}}>
              <label><h6>Medical:</h6></label>
              <input
                type='text'
                placeholder='Search by Medical Data'
                value={medicalTerm}
                onChange={handleMedicalChange}
              />

</div>
          <button className="btn btn-primary mb-3" title="Add Data" style={{ marginLeft: '450px', height:"60px", width:"200px", textAlign:"center"}} onClick={addStudent}>
            Add Data <AddIcon />
          </button>
            </div>
          </div>
            
          
          
        </div>
        <div className="form-center">
          <table className="styled-table">
            <thead>
              <tr>
                <th onClick={() => sortData('date')} style={{ cursor: 'pointer' }}>
                  Date
                  {sortOrder.date === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                </th>
                <th onClick={() => sortData('name')} style={{ cursor: 'pointer' }}>
                  Patient Name
                  {sortOrder.name === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                </th>
                <th onClick={() => sortData('age')} style={{ cursor: 'pointer' }}>
                  Patient Age
                  {sortOrder.age === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                </th>
                <th>Gender</th>
                <th>Given Medical</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    {message}
                  </td>
                </tr>
              ) : (
                filteredData.map((eachData) => (
                  <tr key={eachData.id}>
                  <td>{eachData.date && !isNaN(new Date(eachData.date).getTime()) ? new Date(eachData.date).toLocaleDateString() : 'No Date'}</td>

                    <td>{capitalizeFirstLetter(eachData.name)}</td>
                    <td>{eachData.age}</td>
                    <td>{eachData.gender}</td>
                    <td>{eachData.medical && eachData.medical.length > 0 ? eachData.medical.join(', ') : 'None'}</td>
                    <td>{eachData.description || 'No Description'}</td>
                    <td>
                      <button onClick={() => goToUpdate(eachData)}> 
                        <EditButtonWithTooltip id={eachData.id} setToLocalStorageAndNavigate={setToLocalStorageAndNavigate} />
                      </button>
                      <button onClick={() => confirmDelete(eachData.id)}>
                        <DeleteButtonWithTooltip id={eachData.id} confirmDelete={confirmDelete} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={isDeleteConfirmModal}
          onDismiss={() => setIsDeleteConfirmModal(false)}
          isBlocking={false}
          styles={{
            main: {
              maxWidth: 300,
              width: 'auto',
            },
          }}
        >
          <div className="confirmation-modal">
            <button className="close-button" onClick={() => setIsDeleteConfirmModal(false)} style={{marginLeft:"250px",marginTop:"8px"}}>
              <CloseIcon />
            </button>
            <h4 style={{padding:"10px"}}>Are you sure you want to delete this record?</h4>
            <button className="btn btn-primary" onClick={handleDeleteConfirmation} style={{marginLeft:"60px"}}>
              Yes
            </button>
            <button className="btn btn-secondary" onClick={cancelDeleteConfirmation}>
              No
            </button>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default Doctor_homepage;
