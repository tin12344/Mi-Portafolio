import axios from 'axios';
import './VerificationEmailStyle.css';

const VerificationEmail = () => {

    const tokenUrl = new URLSearchParams(window.location.search);
    const verifyToken = tokenUrl.get('token');
    const verify = async () => {
        const response = await axios.post(process.env.REACT_APP_USER_VERIFY , { token: verifyToken });
        console.log(response);
    }
    verify();
    return (
        <div className="verification-container">
          <h2 className="verification-title">Verification Account</h2>
          <p className="verification-message">Your account has been verified</p>
          <p className="verification-message">You can now log with your account</p>
        </div>
    );
};

export default VerificationEmail;
