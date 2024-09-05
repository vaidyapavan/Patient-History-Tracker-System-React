import React, { useState } from 'react';
import '../assets/Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <nav>
            <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                <li><a href="http://localhost:3000/Homepage" onClick={toggleMenu}>Home</a></li>
                <li><a href="http://www.advikawelfarefoundation.org/" onClick={toggleMenu}>Home</a></li>
                <li><a href="http://localhost:3000/" onClick={toggleMenu}>About Us</a></li>
                <li><a href="https://www.pmc.gov.in/en/hospital_list" onClick={toggleMenu}>Hospitals</a></li>
                <li><a href="http://www.advikawelfarefoundation.org/#recent-works" onClick={toggleMenu}>Gallery</a></li>
            </ul>
        </nav>
    );
};

export default Navbar;
