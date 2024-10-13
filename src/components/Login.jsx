import React, { useState } from 'react';
import styles from '../assets/Login.module.css'; 
import axios from 'axios';
import { Label } from '@fluentui/react/lib/Label';
import { MessageBar, MessageBarType } from '@fluentui/react';
import CloseIcon from '@mui/icons-material/Close';

const Login = ({ handlePageChange, setEmail }) => {  
  const [values, setValues] = useState({
    email: '',
    password: ''
  });

  const [requiredError, setRequiredError] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({
    email: false,
    password: false
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setValues(prev => ({ ...prev, [name]: value }));

    if (value) {
      setRequiredError('');
      setErrors(prev => ({ ...prev, [name]: false }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let valid = true;

    if (!values.email || !values.password) {
      setRequiredError('Enter the Email id and Password !!');
      setErrors({
        email: !values.email,
        password: !values.password
      });
      valid = false;
    }

    if (!valid) {
      return;
    }

    axios.post('http://localhost:8086/login', values)
      .then(res => {
        if (res.data === "Success") {
          setEmail(values.email); // Store email for global use
          handlePageChange('Homepage'); // Navigate to the homepage
        } else {
          setError('Invalid Email or Password');
        }
      })
      .catch(err => {
        setError('An error occurred. Please try again.');
        console.log(err);
      });
  };

  const handleRegister = () => {
    handlePageChange('Signup');  
  };

  const handleForgotPassword = () => {
    handlePageChange('Error');  
  };

  const gotoaccesspage = () => {
    handlePageChange('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <CloseIcon style={{ marginLeft: "430px", marginTop: "-40px", cursor: "pointer" }} onClick={gotoaccesspage}></CloseIcon>
        <h2 style={{ marginLeft: "165px" }}>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className={`${styles.mb3} ${styles.inputGroup}`}>
            <Label required>Email</Label>
            <input 
              type="text"
              placeholder="Enter your Email" 
              onChange={handleInput}
              name="email"
              value={values.email}
              style={{ border: errors.email ? '1px solid red' : '' }}
            />
          </div>
          <br />
          <div className={`${styles.mb3} ${styles.inputGroup}`}>
            <Label required>Password</Label>
            <input 
              type="password" 
              placeholder="Enter your password"
              name="password"
              onChange={handleInput}
              value={values.password}
              style={{ border: errors.password ? '1px solid red' : '' }}
            />
          </div>
          <br />
          {requiredError && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
              dismissButtonAriaLabel="Close"
              styles={{ root: { marginBottom: '10px' } }}
            >
              {requiredError}
            </MessageBar>
          )}
          {error && (
            <MessageBar
              messageBarType={MessageBarType.error}
              isMultiline={false}
              dismissButtonAriaLabel="Close"
              styles={{ root: { marginBottom: '10px', } }}
            >
              {error}
            </MessageBar>
          )}
          <br />
          <button type="submit" className={`${styles.btn} ${styles.btnSuccess}`} style={{ marginLeft: "120px" }}>Sign In</button>
          <button type="button" className={`${styles.btn} ${styles.btnSuccess}`} style={{ marginLeft: "10px" }} onClick={handleRegister}>
            Register
          </button>
          <br /><br />
          <button style={{ marginLeft: "100px" }} onClick={handleForgotPassword}>Forgot username or Password?</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
