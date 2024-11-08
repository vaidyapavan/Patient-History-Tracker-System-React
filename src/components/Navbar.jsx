import React, { useState } from 'react';
import '../assets/Navbar.css';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Function to scroll to a specific section by ID
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
        toggleMenu(); // Close the menu after clicking
    };

    return (
        <nav>
            <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                <li>
                    <a href="http://localhost:3000/Homepage" onClick={toggleMenu}>
                        Home
                    </a>
                </li>
                <li>
                    {/* Scroll to "What We Do" section */}
                    <a href="#aboutus" onClick={() => scrollToSection('aboutus')}>
                        About Us
                    </a>
                </li>
                <li>
                    <a href="https://www.pmc.gov.in/en/hospital_list" onClick={toggleMenu}>
                        Hospitals
                    </a>
                </li>
                <li>
                    {/* Scroll to the footer section */}
                    <a href="#footer" onClick={() => scrollToSection('footer')}>
                        Contact
                    </a>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
