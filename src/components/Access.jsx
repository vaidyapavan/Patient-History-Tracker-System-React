import React from 'react';
import styles from '../assets/Access.module.css';
import Navbar from './Navbar';
import ImageSlider from './ImageSlider';
import Footer from './Footer';

const Access = ({ handlePageChange }) => {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.logo}></div> {/* Logo at the top-left */}
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
        <div className={styles.marquee}>
          <p>Welcome to the Patient’s History Tracker System</p>
        </div>

        <div className={styles['image-slider-container']}>
          <ImageSlider />
          <div className={styles.content}>
            <h2>We Give high privacy to Patient data.</h2>
            <h2>Here, Patients are treated as God</h2>
          </div>
        </div>
      </div>

      {/* Add ID here for smooth scroll */}
      <div id="aboutus" className={styles.aboutus}>
        <h2>What We Do</h2>
        <div className={styles.gridContainer}>
        <div className={styles.gridItem}>
      <i className="fas fa-lock"></i>
      <h3>Secure Medical Record Storage</h3>
      <p>
        We offer a highly secure, encrypted platform for storing patients' entire medical history, ensuring privacy and accessibility at all times.
      </p>
    </div>
    <div className={styles.gridItem}>
      <i className="fas fa-id-card"></i>
      <h3>Unique Patient Identification</h3>
      <p>
        Each patient is assigned a unique ID to access their personalized medical records and history, making it easy to share data with authorized doctors.
      </p>
    </div>
    <div className={styles.gridItem}>
      <i className="fas fa-user-md"></i>
      <h3>Doctor-Patient Collaboration</h3>
      <p>
        Our system allows only authorized doctors to access and update patient data, ensuring that no unauthorized person can view or modify sensitive information.
      </p>
    </div>
    <div className={styles.gridItem}>
      <i className="fas fa-heartbeat"></i>
      <h3>Comprehensive Health Tracking</h3>
      <p>
        From diagnoses to treatments and prescriptions, our system tracks every detail of your medical journey, making it simple to review and manage your health.
      </p>
    </div>
    <div className={styles.gridItem}>
      <i className="fas fa-clock"></i>
      <h3>Fast and Easy Access</h3>
      <p>
        Patients can log in at any time to view their medical records or share them with healthcare professionals for more accurate diagnoses and better care coordination.
      </p>
    </div>
    <div className={styles.gridItem}>
      <i className="fas fa-stethoscope"></i>
      <h3>Efficient Medical Management for Doctors</h3>
      <p>
        Doctors can quickly pull up the medical histories of their patients, making it easier to provide accurate, well-informed treatment decisions.
      </p>
    </div>
        </div>
      </div>

      <div id="footer"><Footer  /></div>
      
    </>
  );
};

export default Access;
