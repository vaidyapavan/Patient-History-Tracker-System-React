import React from 'react';
import '../assets/search.css';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';

const Searchbar = ({ searchTerm, handleChange, handleClear, genderTerm, genderChange, medicalTerm, handleMedicalChange }) => {

  return (
    <div className='search'>
      <div className='searchinput'>
        <input
          type='text'
          placeholder='Search by Name'
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
        <label><h6>Medical:</h6></label>
        <input
          type='text'
          placeholder='Enter Medical Information'
          value={medicalTerm}
          onChange={(e) => handleMedicalChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default Searchbar;
