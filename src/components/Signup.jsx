import React, { useState } from 'react';
import styles from '../assets/Signup.module.css';
import axios from 'axios';
import { Modal } from '@fluentui/react/lib/Modal';
import { Label } from '@fluentui/react/lib/Label';
import { MessageBar, MessageBarType } from '@fluentui/react';
// import { v4 as uuidv4 } from 'uuid'; 
import shortid from 'shortid';
import CloseIcon from '@mui/icons-material/Close';


const Signup = ({ handlePageChange }) => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmedPassword: ''
  });
  const [generalError, setGeneralError] = useState('');
  const [userId, setUserId] = useState('');

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setGeneralError('');
  };

  const handleConfirmPasswordInput = (event) => {
    const value = event.target.value;
    setConfirmedPassword(value);
    setErrors(prev => ({ ...prev, confirmedPassword: '' }));
    setGeneralError('');
  };

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nameRegex = /^[a-zA-Z\s]+$/;

    let valid = true;
    const { name, email, password } = values;
    const newErrors = { name: '', email: '', password: '', confirmedPassword: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    } else if (!nameRegex.test(name)) {
      newErrors.name = 'Name should contain letters and spaces only';
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Invalid email format';
      valid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters long';
      valid = false;
    }

    if (!confirmedPassword.trim()) {
      newErrors.confirmedPassword = 'Confirm password is required';
      valid = false;
    } else if (password !== confirmedPassword) {
      newErrors.confirmedPassword = 'Passwords do not match';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate()) {
      const userId = shortid.generate(); 
      const userData = { ...values, userId }; // Include the ID in the data
  
      axios.post('http://localhost:8087/signup', userData)
        .then(res => {
          setUserId(userId); // Store the generated user ID in the state
          setIsModalOpen(true); // Show success modal
        })
        .catch(err => {
          console.error('Error creating account:', err);
          setGeneralError('Failed to create account. Please try again.');
        });
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    handlePageChange('Login');
  };

  const goToSignInPage = () => {
    handlePageChange('Login');
  };

  const gotoaccesspage = () => {
    handlePageChange('');
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <CloseIcon style={{ marginLeft: "430px", marginTop: "-40px", cursor: "pointer" }} onClick={gotoaccesspage}></CloseIcon>
        <h2 style={{ marginLeft: "140px" }}>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.mb3} ${styles.inputGroup}`}>
            <Label required>Name</Label>
            <input
              type="text"
              placeholder="Enter your name"
              onChange={handleInput}
              name="name"
              value={values.name}
              style={{ border: errors.name ? '1px solid red' : '1px solid #ccc' }}
            />
            {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
          </div>

          <div className={`${styles.mb3} ${styles.inputGroup}`}>
            <Label required>Email</Label>
            <input
              type="text"
              placeholder="Enter your email"
              onChange={handleInput}
              name="email"
              value={values.email}
              style={{ border: errors.email ? '1px solid red' : '1px solid #ccc' }}
            />
            {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
          </div>

          <div className={`${styles.mb3} ${styles.inputGroup}`}>
            <Label required>Password</Label>
            <input
              type="password"
              placeholder="Enter your password"
              onChange={handleInput}
              name="password"
              value={values.password}
              style={{ border: errors.password ? '1px solid red' : '1px solid #ccc' }}
            />
            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
          </div>

          <div className={`${styles.mb3} ${styles.inputGroup}`}>
            <Label required>Confirm Password</Label>
            <input
              type="password"
              placeholder="Confirm your password"
              onChange={handleConfirmPasswordInput}
              value={confirmedPassword}
              style={{ border: errors.confirmedPassword ? '1px solid red' : '1px solid #ccc' }}
            />
            {errors.confirmedPassword && <div className={styles.errorMessage}>{errors.confirmedPassword}</div>}
          </div>

          {generalError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              styles={{ root: { marginBottom: '10px' } }}
            >
              {generalError}
            </MessageBar>
          )}

          <div className={styles.btnContainer}>
            <button type="submit" className={`${styles.btn} ${styles.btnSuccess}`}>Submit</button>
            <button type="button" className={`${styles.btn} ${styles.btnLink}`} onClick={goToSignInPage}>Sign in</button>
          </div>
        </form>
        <Modal isOpen={isModalOpen} onDismiss={closeModal} className={styles.customModal}>
        <div className={styles.modalContent}>
          <Label className={styles.modalLabel}>Success</Label>
          <p>Your account has been created successfully!</p>
          <p>Please check youe Email ID  We have send your unique patient ID, </p>
          <p> Keep it secure and don't share with anyone</p>
          <button onClick={closeModal} className={styles.modalButton}>OK</button>
        </div>
      </Modal>
    
      </div>
      
    </div>
  );
};

export default Signup;
