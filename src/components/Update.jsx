import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Label } from '@fluentui/react/lib/Label';
import '../assets/Create.css';
import { initializeIcons } from '@fluentui/font-icons-mdl2';

initializeIcons();

const Update = ({ handlePageChange }) => {
    const { id } = useParams(); // Get patient ID from the URL
    console.log(id)
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

    // Fetch the patient data on component mount
    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const response = await axios.get(`http://localhost:8086/patients/${id}`);
                const {
                    patient_name, patient_id, patient_email, patient_date, doctor_name,
                    mobile_number, age, gender, medical, description
                } = response.data;

                // Set the state with fetched data
                setPatientName(patient_name);
                setPatientID(patient_id);
                setPatientEmail(patient_email);
                setPatientDate(patient_date);
                setDoctorName(doctor_name);
                setMobileNumber(mobile_number);
                setAge(age);
                setGender(gender);
                setMedical(medical);
                setDescription(description);
            } catch (error) {
                console.error('Error fetching patient data:', error);
            }
        };

        fetchPatientData();
    }, [id]);

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
            const response = await axios.put(`http://localhost:8086/patients/${id}`, {
                patient_name: patientName,
                patient_id: patientID,
                patient_email: patientEmail,
                patient_date: patientDate,
                doctor_name: doctorName,
                mobile_number: mobileNumber,
                age,
                gender: capitalizeFirstLetter(gender),
                medical,
                description
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

        // Name validation
        if (!patientName || !nameRegex.test(patientName)) {
            newErrors.patientName = 'Patient name is required and should contain only letters.';
            isValid = false;
        }
        // Email validation
        if (!patientEmail || !emailRegex.test(patientEmail)) {
            newErrors.patientEmail = 'Invalid email format.';
            isValid = false;
        }
        // Mobile number validation
        if (!mobileNumber || !mobileNumberRegex.test(mobileNumber)) {
            newErrors.mobileNumber = 'Mobile number should be a valid 10-digit number.';
            isValid = false;
        }
        // Additional field validation if needed (doctorName, medical, etc.)

        setErrors(newErrors);
        return isValid;
    };

    const idFromLocalStorage = localStorage.getItem('ID'); // Retrieve ID from localStorage

    return (
        <div className="create-container">
            <div className="form-container">
                <CloseIcon onClick={cancelForm} className="close-icon" style={{ marginLeft: "890px", marginTop: "-20px", marginRight: "-30px", cursor: "pointer" }} />
                <h2 className="form-title">Update Patient Data</h2>
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
                        <Label required>Patient ID</Label>
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
                        <Label required>Medical Condition</Label>
                        <textarea
                            className={`form-control ${errors.medical ? 'is-invalid' : ''}`}
                            rows="4"
                            placeholder="Enter medical condition"
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
                        <Label>Description</Label>
                        <textarea
                            className="form-control"
                            rows="4"
                            placeholder="Enter description"
                            value={description}
                            onChange={handleChange(setDescription, 'description')}
                        />
                    </div>
                    <div>
                    <button  onClick={cancelForm} className="btn btn-primary">
                            Back
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* Modal for success */}
            <Modal
                isOpen={isModalOpen}
                onDismiss={closeModal}
                isBlocking={false}
                containerClassName="modal-container"
            >
                <div className="modal-content">
                    <h2>Patient Data Updated Successfully!</h2>
                    <button onClick={closeModal} className="btn btn-primary">Close</button>
                </div>
            </Modal>
        </div>
    );
};

export default Update;
