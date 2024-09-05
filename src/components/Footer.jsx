


import React from "react";

import '../assets/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>About Us</h3>
          <p> This  system helps patient to track their all medical histroic data. Hare we have taken care of the patient data privacy.</p>
        </div>
        <div className="footer-column">
          <h3>Contact</h3>
          <p>Email: vaidyapavan1000@gmail.com</p>
          <p>Phone: +91 8208734730</p>
        </div>
        <div className="footer-column">
          <h3>Follow us</h3>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/pavan-vaidya-14a695229/"><i className="fab fa-facebook-f">Linkedin</i></a>
            <a href="https://www.facebook.com/"><i className="fab fa-twitter"> Facebook</i></a>
            <a href="https://www.instagram.com/pavanvaidya722/"><i className="fab fa-instagram">Instagram</i></a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; 2024 Your Website. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;

























