import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Searchbar from './Searchbar';
import DeleteButtonWithTooltip from './DeleteButtonWithTooltip';
import EditButtonWithTooltip from './EditButtonWithTooltip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


import '../assets/Read.css';

const Read = ({handlePageChange} ) => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [isDeleteConfirmModal, setIsDeleteConfirmModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [sortOrder, setSortOrder] = useState({ name: 'asc', class: 'asc' });
  const [genderTerm, setGenderTerm] = useState('');
  const [hobbyTerms, setHobbyTerms] = useState([]); // Changed to array for multiple selection
  const navigate = useNavigate();

  useEffect(() => {
    getData(); // Fetch data when component mounts
  }, []);

  const getData = async () => {
    try {
      const response = await axios.get('http://localhost:8086/getData'); 
      setData(response.data); // Update state with fetched data
      console.log('Data fetched successfully:', response.data); // Log fetched data to console
    } catch (error) {
      console.error('Error fetching data:', error); // Log error if data fetch fails
    }
  };

  const sortNames = () => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder.name === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, name: sortOrder.name === 'asc' ? 'desc' : 'asc' });
  };

  const sortClasses = () => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder.class === 'asc') {
        return a.studentClass.localeCompare(b.studentClass);
      } else {
        return b.studentClass.localeCompare(a.studentClass);
      }
    });
    setData(sortedData);
    setSortOrder({ ...sortOrder, class: sortOrder.class === 'asc' ? 'desc' : 'asc' });
  };

  // Function to handle delete operation
  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:8086/deleteData/${id}`)
      .then(() => {
        console.log('Item deleted successfully');
        getData(); // Refresh data after deletion
        setIsDeleteConfirmModal(false); // Close delete confirmation modal
      })
      .catch((error) => {
        console.error('Error deleting item:', error); // Log error if deletion fails
      });
  };

  // Function to navigate to update page with item details
  const setToLocalStorageAndNavigate = (id, name, email, studentClass, hobby, gender) => {
    localStorage.setItem('ID', id);
    localStorage.setItem('Name', name);
    localStorage.setItem('Email', email);
    localStorage.setItem('StudentClass', studentClass);
    localStorage.setItem('hobby', JSON.stringify(hobby));
    localStorage.setItem('Gender', gender);
    handlePageChange('Update');
  };

  // Function to initiate delete confirmation
  const confirmDelete = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmModal(true); // Show delete confirmation modal
  };

  // Function to handle delete confirmation
  const handleDeleteConfirmation = () => {
    if (deleteId !== null) {
      handleDelete(deleteId);
    }
  };

  // Function to cancel delete confirmation
  const cancelDeleteConfirmation = () => {
    setIsDeleteConfirmModal(false); // Close delete confirmation modal
    setDeleteId(null);
    handlePageChange('Read');
  };

  // Function to handle search term change
  const handleChange = (e) => {
    setSearchTerm(e.target.value);
    setMessage('');
  };

  // Function to clear search term
  const handleClear = () => {
    setSearchTerm('');
    setMessage('');
  };

  const genderChange = (e) => {
    setGenderTerm(e.target.value);
  };

  const handleHobbyChange = (selectedKeys) => {
    setHobbyTerms(selectedKeys);
  };

  // Function to capitalize the first letter of a string
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  // Filter data based on search and filter criteria
  const filteredData = data.filter((item) => {
    const matchesName = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderTerm === '' || item.gender.toLowerCase() === genderTerm.toLowerCase();
    const matchesHobbies =
      hobbyTerms.length === 0 || hobbyTerms.every((hobby) => item.hobby.includes(hobby));
    return matchesName && matchesGender && matchesHobbies;
  });
  console.log(filteredData);

  // Effect to update message based on filtered data
  useEffect(() => {
    if ((searchTerm || genderTerm || hobbyTerms.length > 0) && filteredData.length === 0) {
      setMessage('No data found');
    } else {
      setMessage('');
    }
  }, [searchTerm, genderTerm, hobbyTerms, filteredData]);
  const addstudent=()=>
  {
    handlePageChange('Create');

  }
  const gotohomepage=()=>
  {
    
     handlePageChange('Homepage');
  }

  return (
    <>
      <div className="container mt-3">
        <h2 className="form-title">Patient Data</h2>
        <div>
        <button className="btn btn-primary mb-3" title="Add student" style={{marginLeft:"5px"}} onClick={gotohomepage}>
              Homepage
            </button>
          <Searchbar
            searchTerm={searchTerm}
            handleChange={handleChange}
            handleClear={handleClear}
            genderTerm={genderTerm}
            genderChange={genderChange}
            hobbyTerms={hobbyTerms}
            handleHobbyChange={handleHobbyChange}
          />
          <button className="btn btn-primary mb-3" title="Add student" style={{marginLeft:"1230px"}} onClick={addstudent}>
              Add+
            </button>
        </div>

        <table className="table table-bordered" style={{ alignItems: 'center' }}>
          <thead>
            <tr>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>
                Name
                {sortOrder.name === 'asc' ? (
                  <ArrowDropDownIcon onClick={sortNames} style={{ cursor: 'pointer' }} />
                ) : (
                  <ArrowDropUpIcon onClick={sortNames} style={{ cursor: 'pointer' }} />
                )}
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '20%' }}>
                Email
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>
                Class
                {sortOrder.class === 'asc' ? (
                  <ArrowDropDownIcon onClick={sortClasses} style={{ cursor: 'pointer' }} />
                ) : (
                  <ArrowDropUpIcon onClick={sortClasses} style={{ cursor: 'pointer' }} />
                )}
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '20%' }}>
                Hobbies
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>
                Gender
              </th>
              <th scope="col" style={{ textAlign: 'center', width: '15%' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td style={{ textAlign: 'center' }}>{item.studentClass}</td>
                <td style={{ textAlign: 'center' }}>
                  {Array.isArray(item.hobby) ? (
                    item.hobby.map((h, index) => (
                      <span key={index}>
                        {h}
                        {index !== item.hobby.length - 1 ? ', ' : ''}
                      </span>
                    ))
                  ) : (
                    <span>{item.hobby}</span>
                  )}
                </td>
                <td style={{ textAlign: 'center' }}>
                  {capitalizeFirstLetter(item.gender)}
                </td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="btn btn-primary"
                    style={{ marginRight: '12px', padding: '1px', width: '50px' }}
                    onClick={() =>
                      setToLocalStorageAndNavigate(
                        item.id,
                        item.name,
                        item.email,
                        item.studentClass,
                        item.hobby,
                        item.gender
                      )
                    }
                  >
                    <EditButtonWithTooltip />
                  </button>
                  <button
                    style={{ marginLeft: '8px', padding: '1px', width: '50px' }}
                    className="btn btn-primary"
                    onClick={() => confirmDelete(item.id)}
                  >
                    <DeleteButtonWithTooltip />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {message && (
          <p className="no-data-message" style={{ marginLeft: '60px' }}>
            {message}
          </p>
        )}
      </div>
      <Modal isOpen={isDeleteConfirmModal} onDismiss={cancelDeleteConfirmation} className="custom-modal">
        <div className="modal-content">
          <CloseIcon
            onClick={cancelDeleteConfirmation}
            style={{ marginLeft: '350px', marginTop: '-15px', marginRight: '-10px', cursor: 'pointer' }}
          />
          <br />
          <div className="success-message" style={{ color: 'black' }}>
            Are you sure you want to delete this data?
          </div>
          <button className="ok-button" onClick={cancelDeleteConfirmation} style={{ marginTop: '30px', marginLeft: '100px', marginBottom: '-10px' }}>
            No
          </button>
          <button className="ok-button" onClick={handleDeleteConfirmation} style={{ marginLeft: '200px', marginTop: '-35px' }}>
            Yes
          </button>
        </div>
      </Modal>
    </>
  );
};

export default Read;
