import React, { useState } from 'react';
import axios from 'axios';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Label } from '@fluentui/react/lib/Label';
import '../assets/Create.css';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
import DoneIcon from '@mui/icons-material/Done';

initializeIcons();

const Update = ({ patientData, handlePageChange }) => {
    const {
        patient_name,
        patient_id,
        patient_email,
        patient_date,
        doctor_name,
        mobile_number,
        age,
        gender,
        medical,
        description,
    } = patientData || {};

    const [patientName, setPatientName] = useState(patient_name || '');
    const [patientID, setPatientID] = useState(patient_id || '');
    const [patientEmail, setPatientEmail] = useState(patient_email || '');
    const [patientDate, setPatientDate] = useState(
        patient_date ? new Date(patient_date).toISOString().substring(0, 10) : ''
    );
    const [doctorName, setDoctorName] = useState(doctor_name || '');
    const [mobileNumber, setMobileNumber] = useState(mobile_number || '');
    const [ageState, setAge] = useState(age || '');
    const [genderState, setGender] = useState(gender || '');
    const [medicalState, setMedical] = useState(medical || '');
    const [descriptionState, setDescription] = useState(description || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errors, setErrors] = useState({});

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
            const response = await axios.put(`http://localhost:8087/patients/${patientID}`, {
                patient_name: patientName,
                patient_id: patientID,
                patient_email: patientEmail,
                patient_date: patientDate,
                doctor_name: doctorName,
                mobile_number: mobileNumber,
                age: ageState,
                gender: capitalizeFirstLetter(genderState),
                medical: medicalState,
                description: descriptionState
            });

            console.log('Form data updated successfully:', response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error updating form data:', error);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        handlePageChange('Doctor_homepage');
    };

    const cancelForm = () => {
        handlePageChange('Doctor_homepage');
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!patientName || !nameRegex.test(patientName)) {
            newErrors.patientName = 'Patient name is required and should contain only letters.';
            isValid = false;
        }

        if (!patientEmail || !emailRegex.test(patientEmail)) {
            newErrors.patientEmail = 'Invalid email format.';
            isValid = false;
        }

        if (!mobileNumber || !mobileNumberRegex.test(mobileNumber)) {
            newErrors.mobileNumber = 'Mobile number should be a valid 10-digit number.';
            isValid = false;
        }

        if (!doctorName) {
            newErrors.doctorName = 'Doctor name is required.';
            isValid = false;
        }

        if (!patientDate) {
            newErrors.patientDate = 'Date is required.';
            isValid = false;
        }

        if (!ageState) {
            newErrors.ageState = 'Age is required.';
            isValid = false;
        }

        if (!genderState) {
            newErrors.genderState = 'Gender is required.';
            isValid = false;
        }

        if (!medicalState) {
            newErrors.medicalState = 'Medical condition is required.';
            isValid = false;
        }

        if (!descriptionState) {
            newErrors.descriptionState = 'Description is required.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    return (
        <div className="create-container">
            <div className="form-container">
                <CloseIcon onClick={cancelForm} className="close-icon" style={{ marginLeft: "630px", marginTop: "-20px", marginRight: "-30px", cursor: "pointer" }} />
                <h2 className="form-title">Update Patient Data</h2>
                <form onSubmit={handleSubmit}>
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
                        <Label required>Email</Label>
                        <input
                            placeholder="Enter email"
                            type="email"
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
                        <Label required>Date</Label>
                        <input
                            placeholder="Enter date"
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
                        <Label required>Age</Label>
                        <input
                            placeholder="Enter age"
                            type="number"
                            className={`form-control ${errors.ageState ? 'is-invalid' : ''}`}
                            value={ageState}
                            onChange={handleChange(setAge, 'ageState')}
                        />
                        {errors.ageState && (
                            <div className="invalid-feedback">
                                {errors.ageState}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Gender</Label>
                        <br />
                        {/* Display error message for gender */}
                        <div style={{ color: "red" }}>{errors.gender}</div>

                        {/* Radio button for Male */}
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

                        {/* Radio button for Female */}
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
                        <Label required>Medical Condition</Label>
                        <input
                            placeholder="Enter medical condition"
                            type="text"
                            className={`form-control ${errors.medicalState ? 'is-invalid' : ''}`}
                            value={medicalState}
                            onChange={handleChange(setMedical, 'medicalState')}
                        />
                        {errors.medicalState && (
                            <div className="invalid-feedback">
                                {errors.medicalState}
                            </div>
                        )}
                    </div>
                    <div className="mb-3">
                        <Label required>Description</Label>
                        <textarea
                            placeholder="Enter description"
                            className={`form-control ${errors.descriptionState ? 'is-invalid' : ''}`}
                            value={descriptionState}
                            onChange={handleChange(setDescription, 'descriptionState')}
                        />
                        {errors.descriptionState && (
                            <div className="invalid-feedback">
                                {errors.descriptionState}
                            </div>
                        )}
                    </div>
                    <button type="button" className="btn btn-primary" onClick={cancelForm} style={{marginLeft:"200px"}}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Save Changes</button>
               
                </form>

                <Modal
                    isOpen={isModalOpen}
                    onDismiss={closeModal}
                    isBlocking={false}
                >
                    <div className="modal-content">
                        <h3>Successfully Updated!</h3>
                        <h5>Patient Data is updated  successfully.</h5>
                        <button onClick={closeModal} className="btn btn-primary" style={{backgroundColor:"green"}}><DoneIcon></DoneIcon></button>
                        {/* <button className="btn btn-primary" onClick={closeModal}>

                            Close
                        </button> */}
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default Update;
