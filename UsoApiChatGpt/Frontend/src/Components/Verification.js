import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import { useNavigate } from 'react-router-dom';
import './VerificationStyle.css';
import axios from 'axios';

const Verification = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const userId = sessionStorage.getItem('userId');
        try {
            const response = await axios.post(`${process.env.REACT_APP_VERIFY}?id=${userId}`, { code: otp },{
                headers: {
                  'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
                }
              });
            if (response.status === 200) {
                navigate('/user');
            }
        } catch (error) {
            console.error('Error to send message', error);
            throw error;
        }
    };

    return (
        <div className="verification-container">
            <h1 className="verification-title">Two Factor Verification</h1>
            <h3 className="verification-body">Type the code that was send to your phone number</h3>
            <OtpInput
                value={otp}
                onChange={setOtp}
                numInputs={6}
                separator={<span className="otp-separator">-</span>}
                inputStyle="otp-input"
                renderInput={(props) => <input {...props} />}
            />
            <button className="verify-button" onClick={handleSubmit}>
                Verify
            </button>
        </div>
    );
}

export default Verification;
