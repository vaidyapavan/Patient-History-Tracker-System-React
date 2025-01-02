import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Label } from '@fluentui/react/lib/Label';
import DoneIcon from '@mui/icons-material/Done';
import '../assets/Create.css';
import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons();

const Create = ({ handlePageChange }) => {
    const [patientName, setPatientName] = useState('');
    const [patientID, setPatientID] = useState(''); 
    const [patientEmail, setPatientEmail] = useState('');
    const [patientDate, setPatientDate] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [medical, setMedical] = useState('');
    const [description, setDescription] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z\s]*$/;
    const mobileNumberRegex = /^[0-9]{10}$/;

    const handleChange = (setter, field) => (e) => {
        const value = e.target.value;
        setter(value);
        if (value === '') {
            setErrors((prevErrors) => ({ ...prevErrors, [field]: `${field} is required.` }));
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, [field]: '' }));
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:8086/create', {
                patient_name: patientName,
                patient_id: patientID, // Sending the patientID to the backend
                patient_email: patientEmail,
                patient_date: patientDate,
                doctor_name: doctorName,
                mobile_number: mobileNumber,
                age,
                gender: capitalizeFirstLetter(gender),
                medical,
                description
            });

            console.log('Form data submitted successfully:', response.data);

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error submitting form data:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        handlePageChange('Doctor_homepage');
    };

    const cancelForm = () => {
        handlePageChange('Doctor_homepage');
    };
    const goToHomepage = () =>
    {
        handleChange('Doctor_homepage');
    }

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        // Validate Doctor Name
        if (doctorName.length <= 3 || !doctorName.match(nameRegex)) {
            newErrors.doctorName = 'Doctor name must be more than 3 letters and contain only letters.';
            isValid = false;
        }

        // Validate Patient Name
        if (patientName.length <= 3 || !patientName.match(nameRegex)) {
            newErrors.patientName = 'Name must be more than 3 letters and contain only letters.';
            isValid = false;
        }

        // Validate Patient ID
        if (!patientID) {
            newErrors.patientID = 'Patient ID is required.';
            isValid = false;
        }

        // Validate Patient Email
        if (!patientEmail.match(emailRegex)) {
            newErrors.patientEmail = 'Invalid email address.';
            isValid = false;
        }

        // Validate Patient Date
        if (!patientDate) {
            newErrors.patientDate = 'Patient date is required.';
            isValid = false;
        }

        // Validate Mobile Number
        if (!mobileNumber.match(mobileNumberRegex)) {
            newErrors.mobileNumber = 'Mobile number must be 10 digits.';
            isValid = false;
        }

        // Validate Age
        if (!age || isNaN(age)) {
            newErrors.age = 'Age must be a valid number.';
            isValid = false;
        }

        // Validate Gender
        if (!gender) {
            newErrors.gender = 'Gender field is required.';
            isValid = false;
        }

        // Validate Medical
        if (medical.length === 0) {
            newErrors.medical = 'Medical field is required.';
            isValid = false;
        }

        // Validate Description
        if (description.length <= 10) {
            newErrors.description = 'Description must be more than 10 characters.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <div className="create-container">
            <div className="form-container">
                <CloseIcon onClick={cancelForm} className="close-icon" style={{ marginLeft: "630px", marginTop: "-20px", marginRight: "-30px", cursor: "pointer" }} />
                <h2 className="form-title">Add Patient Data</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <Label required>Doctor Name</Label>
                        <input
                            placeholder="Enter doctor name"
                            type="text"
                            className={`form-control ${errors.doctorName ? 'is-invalid' : ''}`}
                            value={doctorName}
                            onChange={handleChange(setDoctorName, 'doctorName')}
                        />
                        {errors.doctorName && (
                            <div className="invalid-feedback">
                                {errors.doctorName}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Patient Name</Label>
                        <input
                            placeholder="Enter patient name"
                            type="text"
                            className={`form-control ${errors.patientName ? 'is-invalid' : ''}`}
                            value={patientName}
                            onChange={handleChange(setPatientName, 'patientName')}
                        />
                        {errors.patientName && (
                            <div className="invalid-feedback">
                                {errors.patientName}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Patient ID</Label> {/* New Patient ID input field */}
                        <input
                            placeholder="Enter patient ID"
                            type="text"
                            className={`form-control ${errors.patientID ? 'is-invalid' : ''}`}
                            value={patientID}
                            onChange={handleChange(setPatientID, 'patientID')}
                        />
                        {errors.patientID && (
                            <div className="invalid-feedback">
                                {errors.patientID}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Patient Email</Label>
                        <input
                            placeholder="Enter patient email"
                            type="text"
                            className={`form-control ${errors.patientEmail ? 'is-invalid' : ''}`}
                            value={patientEmail}
                            onChange={handleChange(setPatientEmail, 'patientEmail')}
                        />
                        {errors.patientEmail && (
                            <div className="invalid-feedback">
                                {errors.patientEmail}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Patient Date</Label>
                        <input
                            type="date"
                            className={`form-control ${errors.patientDate ? 'is-invalid' : ''}`}
                            value={patientDate}
                            onChange={handleChange(setPatientDate, 'patientDate')}
                        />
                        {errors.patientDate && (
                            <div className="invalid-feedback">
                                {errors.patientDate}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Mobile Number</Label>
                        <input
                            placeholder="Enter mobile number"
                            type="text"
                            className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                            value={mobileNumber}
                            onChange={handleChange(setMobileNumber, 'mobileNumber')}
                        />
                        {errors.mobileNumber && (
                            <div className="invalid-feedback">
                                {errors.mobileNumber}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Age</Label>
                        <input
                            placeholder="Enter age"
                            type="text"
                            className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                            value={age}
                            onChange={handleChange(setAge, 'age')}
                        />
                        {errors.age && (
                            <div className="invalid-feedback">
                                {errors.age}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Gender</Label>
                        <br />
                        <div style={{ color: "red" }}>{errors.gender}</div>
                        <div className="form-check" style={{ marginBottom: '10px', marginTop: '8px' }}>
                            <input
                                className="form-check-input"
                                type="radio"
                                value="Male"
                                onChange={(e) => setGender(e.target.value)}
                                checked={gender === "Male"}
                            />
                            <label className="form-check-label">Male</label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                value="Female"
                                onChange={(e) => setGender(e.target.value)}
                                checked={gender === "Female"}
                            />
                            <label className="form-check-label">Female</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <Label required>Medical</Label>
                        <textarea
                            placeholder="Enter medical condition"
                            className={`form-control ${errors.medical ? 'is-invalid' : ''}`}
                            value={medical}
                            onChange={handleChange(setMedical, 'medical')}
                        />
                        {errors.medical && (
                            <div className="invalid-feedback">
                                {errors.medical}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Description</Label>
                        <textarea
                            placeholder="Enter description"
                            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                            value={description}
                            onChange={handleChange(setDescription, 'description')}
                        />
                        {errors.description && (
                            <div className="invalid-feedback">
                                {errors.description}
                            </div>
                        )}
                    </div>
                    <div className="d-flex justify-content-center mt-3">
                    <button  onClick={cancelForm} className="btn btn-primary">Back</button>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </form>

                <Modal isOpen={isModalOpen} onDismiss={closeModal}>
                    <div className="modal-content">
                        <h2>Success!</h2>
                        <h3>Data successfully added.</h3>
                        <button onClick={closeModal} className="btn btn-primary" style={{backgroundColor:"green"}}><DoneIcon></DoneIcon></button>
                        {/* <button onClick={closeModal} className="btn btn-primary">OK</button> */}
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Create;
