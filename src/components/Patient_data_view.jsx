import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import Navbar from './Navbar';
import '../assets/Patient_data_view.css';

const Patient_data_view = ({ handlePageChange, patientName }) => {
  const [data, setData] = useState([]);
  const [searchTermDoctor, setSearchTermDoctor] = useState('');
  const [searchTermMedical, setSearchTermMedical] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sortOrder, setSortOrder] = useState({ date: 'asc', name: 'asc' });

  useEffect(() => {
    getData(); // Fetch data when component mounts
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:8085/getData');
      setData(response.data); // Update state with fetched data
      console.log('Data fetched successfully:', response.data);
    } catch (error) {
      console.error('Error fetching data:', error); // Log error if data fetch fails
    }
  };

  const sortData = (key) => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder[key] === 'asc') {
        return a[key].localeCompare(b[key]);
      } else {
        return b[key].localeCompare(a[key]);
      }
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, [key]: sortOrder[key] === 'asc' ? 'desc' : 'asc' });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8085/deleteData/${id}`)
      .then(() => {
        console.log('Item deleted successfully');
        getData(); // Refresh data after deletion
        setIsDeleteConfirmModal(false); // Close delete confirmation modal
      })
      .catch((error) => {
        console.error('Error deleting item:', error); // Log error if deletion fails
      });
  };

  const setToLocalStorageAndNavigate = (id, name, email, age, doctorName, date, medical, description, critical) => {
    localStorage.setItem('ID', id);
    localStorage.setItem('Name', name);
    localStorage.setItem('Email', email);
    localStorage.setItem('Age', age);
    localStorage.setItem('DoctorName', doctorName);
    localStorage.setItem('Date', date);
    localStorage.setItem('Medical', medical);
    localStorage.setItem('Description', description);
    localStorage.setItem('Critical', critical);

    handlePageChange('Update');
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmModal(true); // Show delete confirmation modal
  };

  const handleDeleteConfirmation = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
    }
  };

  const cancelDeleteConfirmation = () => {
    setIsDeleteConfirmModal(false); // Close delete confirmation modal
    setDeleteId(null);
    handlePageChange('Read');
  };

  const handleChangeDoctor = (e) => {
    setSearchTermDoctor(e.target.value);
    setMessage('');
  };

  const handleChangeMedical = (e) => {
    setSearchTermMedical(e.target.value);
    setMessage('');
  };

  const handleClearDoctor = () => {
    setSearchTermDoctor('');
    setMessage('');
  };

  const handleClearMedical = () => {
    setSearchTermMedical('');
    setMessage('');
  };

  const filteredData = data.filter((item) => {
    const doctorName = item.doctor_name || ''; // Ensure item.doctor_name is defined
    const medical = item.medical || ''; // Ensure item.medical is defined


    const medicalString = Array.isArray(medical) ? medical.join(', ') : medical;

    const matchesDoctorName = doctorName.toLowerCase().includes(searchTermDoctor.toLowerCase());
    const matchesMedical = medicalString.toLowerCase().includes(searchTermMedical.toLowerCase());

    return matchesDoctorName && matchesMedical;
  });

  useEffect(() => {
    if ((searchTermDoctor || searchTermMedical) && filteredData.length === 0) {
      setMessage('No data found');
    } else {
      setMessage('');
    }
  }, [searchTermDoctor, searchTermMedical, filteredData]);

  const addStudent = () => {
    handlePageChange('Create');
  };

  const goToHomepage = () => {
    handlePageChange('Homepage');
  };

  return (
    <>
      <Navbar></Navbar>
      <div className="container mt-3">


        <div className='profile'>
          <button
            className="btn btn-primary mb-3"
            title="Go-to Homepage"
            style={{ marginLeft: '5px' }}
            onClick={goToHomepage}
          >
            <ArrowBackIosIcon />
            Homepage
          </button>
          <h2 className="form-title">My Medical Data</h2>
          <AccountBoxIcon style={{ marginLeft: '1000px', fontSize: '100px' }} />
          <h2 style={{ marginLeft: '-100px', marginTop: "40px" }}>{patientName}</h2>

        </div>


        <div>

          <div className="search">
            <div className="searchinput">
              <input
                type="text"
                placeholder="Search by Doctor Name"
                value={searchTermDoctor}
                onChange={handleChangeDoctor}
              />
              {searchTermDoctor ? (
                <CloseIcon onClick={handleClearDoctor} style={{ cursor: 'pointer' }} />
              ) : (
                <SearchIcon />
              )}
            </div>
            <div className="searchinput" style={{ marginLeft: '10px' }}>
              <input
                type="text"
                placeholder="Search by Medical"
                value={searchTermMedical}
                onChange={handleChangeMedical}
              />
              {searchTermMedical ? (
                <CloseIcon onClick={handleClearMedical} style={{ cursor: 'pointer' }} />
              ) : (
                <SearchIcon />
              )}
            </div>
          </div>
        </div>

        <table className="styled-table">
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'center', width: '20%' }}>
                Date
                {sortOrder.date === 'asc' ? (
                  <ArrowDropDownIcon onClick={() => sortData('date')} style={{ cursor: 'pointer' }} />
                ) : (
                  <ArrowDropUpIcon onClick={() => sortData('date')} style={{ cursor: 'pointer' }} />
                )}
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '20%' }}>
                Doctor Name
                {sortOrder.name === 'asc' ? (
                  <ArrowDropDownIcon onClick={() => sortData('doctor_name')} style={{ cursor: 'pointer' }} />
                ) : (
                  <ArrowDropUpIcon onClick={() => sortData('doctor_name')} style={{ cursor: 'pointer' }} />
                )}
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '30%' }}>
                Given Medical
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '30%' }}>
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  {message}
                </td>
              </tr>
            ) : (
              filteredData.map((item) => (
                <tr key={item.id}>
                  <td>{item.patient_date}</td>
                  <td>{item.doctor_name}</td>
                  <td>{Array.isArray(item.medical) ? item.medical.join(', ') : item.medical}</td>
                  <td>{item.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isDeleteConfirmModal} onDismiss={cancelDeleteConfirmation} isBlocking={false}>
        <div className="modal-content">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this record?</p>
          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleDeleteConfirmation}>
              Yes
            </button>
            <button className="btn btn-secondary" onClick={cancelDeleteConfirmation}>
              No
            </button>
          </div>
          <CloseIcon className="modal-close-icon" onClick={cancelDeleteConfirmation} />
        </div>
      </Modal>
    </>
  );
};

export default Patient_data_view;
