import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Modal } from '@fluentui/react/lib/Modal';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import '../assets/Update.css';
import { Label } from '@fluentui/react/lib/Label';

const Update = ({ handlePageChange }) => {
    const [id, setId] = useState('');
    const [patientName, setPatientName] = useState('');
    const [patientEmail, setPatientEmail] = useState('');
    const [patientDate, setPatientDate] = useState('');
    const [doctorName, setDoctorName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [medical, setMedical] = useState([]);
    const [description, setDescription] = useState('');
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const nameRegex = /^[a-zA-Z\s]*$/;
    const mobileNumberRegex = /^[0-9]{10}$/;

    useEffect(() => {
        const storedId = localStorage.getItem("ID");
        if (storedId) {
            setId(storedId);
            axios.get(`http://localhost:8085/getData`)
                .then(response => {
                    const data = response.data.find(item => item.id === parseInt(storedId));
                    if (data) {
                        setPatientName(data.patientName);
                        setPatientEmail(data.patientEmail);
                        setPatientDate(data.patientDate);
                        setDoctorName(data.doctorName);
                        setMobileNumber(data.mobileNumber);
                        setAge(data.age);
                        setGender(data.gender);
                        setMedical(data.medical.map(med => ({ value: med, label: med })));
                        setDescription(data.description);
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, []);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (patientName.length <= 3 || !patientName.match(nameRegex)) {
            newErrors.patientName = 'Name must be more than 3 letters and contain only letters.';
            isValid = false;
        }

        if (!patientEmail.match(emailRegex)) {
            newErrors.patientEmail = 'Invalid email address.';
            isValid = false;
        }

        if (!patientDate) {
            newErrors.patientDate = 'Patient date is required.';
            isValid = false;
        }

        if (doctorName.length <= 3 || !doctorName.match(nameRegex)) {
            newErrors.doctorName = 'Doctor name must be more than 3 letters and contain only letters.';
            isValid = false;
        }

        if (!mobileNumber.match(mobileNumberRegex)) {
            newErrors.mobileNumber = 'Mobile number must be 10 digits.';
            isValid = false;
        }

        if (!age || isNaN(age)) {
            newErrors.age = 'Age must be a valid number.';
            isValid = false;
        }

        if (!gender) {
            newErrors.gender = 'Gender field is required.';
            isValid = false;
        }

        if (medical.length === 0) {
            newErrors.medical = 'At least one medical condition must be selected.';
            isValid = false;
        }

        if (description.length <= 10) {
            newErrors.description = 'Description must be more than 10 characters.';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const capitalizedGender = capitalizeFirstLetter(gender);
        axios.put(`http://localhost:8085/update/${id}`, {
            patientName,
            patientEmail,
            patientDate,
            doctorName,
            mobileNumber,
            age,
            gender: capitalizedGender,
            medical: medical.map(m => m.value),
            description
        })
            .then(response => {
                setIsSaveModalOpen(true);
            })
            .catch(error => {
                console.error('Error updating item:', error);
            });
    };

    const handleMedicalChange = (selectedOptions) => {
        setMedical(selectedOptions);
    };

    const cancelUpdate = () => {
        handlePageChange('Doctor_homepage');
    };

    const closeSaveModal = () => {
        setIsSaveModalOpen(false);
        handlePageChange('Doctor_homepage');
    };

    const medicalOptions = [
        { value: 'Reading', label: 'Reading' },
        { value: 'Gaming', label: 'Gaming' },
        { value: 'Travelling', label: 'Travelling' },
        { value: 'Cooking', label: 'Cooking' },
        { value: 'Badminton', label: 'Badminton' },
        { value: 'Singing', label: 'Singing' },
        { value: 'Writing', label: 'Writing' },
        { value: 'Painting', label: 'Painting' },
        { value: 'Cricket', label: 'Cricket' },
        { value: 'Other', label: 'Other' },
        { value: 'None', label: 'None' }
    ];

    return (
        <div className="update-container">
            <CloseIcon onClick={cancelUpdate} className="close-icon" style={{ marginLeft: "540px", marginTop: "-20px", cursor: "pointer" }} />

            <h2>Update Patient Data</h2>
            <form onSubmit={handleUpdate}>
                <div className="mb-3">
                    <Label required>Patient Name</Label>
                    <input
                        type="text"
                        className={`form-control ${errors.patientName ? 'is-invalid' : ''}`}
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                    />
                    {errors.patientName && (
                        <div className="invalid-feedback">
                            {errors.patientName}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <Label required>Patient Email</Label>
                    <input
                        type="text"
                        className={`form-control ${errors.patientEmail ? 'is-invalid' : ''}`}
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
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
                        onChange={(e) => setPatientDate(e.target.value)}
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
                        type="text"
                        className={`form-control ${errors.doctorName ? 'is-invalid' : ''}`}
                        value={doctorName}
                        onChange={(e) => setDoctorName(e.target.value)}
                    />
                    {errors.doctorName && (
                        <div className="invalid-feedback">
                            {errors.doctorName}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <Label required>Mobile Number</Label>
                    <input
                        type="text"
                        className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
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
                        type="text"
                        className={`form-control ${errors.age ? 'is-invalid' : ''}`}
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                    />
                    {errors.age && (
                        <div className="invalid-feedback">
                            {errors.age}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <Label required>Medical</Label>
                    <Select
                        isMulti
                        name="medical"
                        options={medicalOptions}
                        className={`basic-multi-select ${errors.medical ? 'is-invalid' : ''}`}
                        classNamePrefix="select"
                        value={medical}
                        onChange={handleMedicalChange}
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
                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    {errors.description && (
                        <div className="invalid-feedback">
                            {errors.description}
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <Label required>Gender</Label>
                    <div className="form-check" style={{ marginBottom: '10px' }}>
                        <input
                            className={`form-check-input ${errors.gender ? 'is-invalid' : ''}`}
                            type="radio"
                            id="male"
                            value="male"
                            checked={gender === 'male'}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="male">
                            Male
                        </label>
                    </div>
                    <div className="form-check">
                        <input
                            className={`form-check-input ${errors.gender ? 'is-invalid' : ''}`}
                            type="radio"
                            id="female"
                            value="female"
                            checked={gender === 'female'}
                            onChange={(e) => setGender(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor="female">
                            Female
                        </label>
                    </div>
                    {errors.gender && (
                        <div className="invalid-feedback">
                            {errors.gender}
                        </div>
                    )}
                </div>
                <button type="button" className="btn btn-primary" onClick={cancelUpdate} style={{ marginLeft: "170px", marginRight: "-10px" }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ marginLeft: '30px', marginRight: "80px" }}>Save</button>
            </form>

            <Modal isOpen={isSaveModalOpen} onDismiss={closeSaveModal} className="custom-modal">
                <div className="modal-content" style={{ alignItems: "center" }}>
                    <br />
                    <h2 style={{ marginLeft: "10px" }}>Data updated successfully!</h2>
                    <br />
                    <button className="btn btn-primary" onClick={closeSaveModal}>OK</button>
                </div>
            </Modal>
        </div>
    );
}

export default Update;
