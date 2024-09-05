import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../assets/Access.module.css';
import Navbar from './Navbar';
const Access = ({ handlePageChange }) => {
  const navigate = useNavigate();

  // Array of image paths
  const images = [
    require('../assets/images/access1.jpeg'),
    require('../assets/images/access2.jpeg'),
    require('../assets/images/access3.jpeg'),
    require('../assets/images/access4.jpeg'),
    require('../assets/images/access5.jpg'),
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <Navbar></Navbar>
       <div
      className={styles.container}
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
      }}
    >
      <div className={styles.logo}>
        <h2></h2>
      </div>
      <div className={styles['content']}>
        
        <p className='statements'>
        <h2> We  Gives the high privecy to the Employee data</h2>
        <h2>Here Patient is treates as God</h2> 
        </p>

      </div>
      <div className={styles['button-container']}>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handlePageChange('Login')}
        >
          Sign-in
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handlePageChange('Signup')}
        >
          Create Account
        </button>
      </div>
    </div>
    </>
   
  );
};

export default Access;
