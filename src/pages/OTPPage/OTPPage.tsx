import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Để lấy thông tin từ location state
import { useAuth } from '../../AuthContext';
import { toast } from 'react-toastify';
import styles from './OTPPage.module.css';


const OtpPage: React.FC = () => {
    const location = useLocation()
    const phoneNumber = location.state?.phoneNumber || ''; // Lấy số điện thoại từ state
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [error, setError] = useState<string>('');
    const navigate = useNavigate();
    const { login } = useAuth();
    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;

        if (value.match(/[^0-9]/)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Tự động chuyển sang ô nhập tiếp theo
        if (value && index < otp.length - 1) {
            document.getElementById(`otp-input-${index + 1}`)?.focus();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            // setError('Please enter a 6-digit OTP');
            toast.error('Please enter the 6-digit OTP!');
            return;
        }

        try {
            // Gọi API xác thực OTP
            const response = await axios.post('http://localhost:8000/api/auth/verify-otp', {
                phone: phoneNumber,
                otp: otpValue,
            });
            if (response.status !== 200) {
                toast.error('The OTP is incorrect or has expired!');
                throw new Error('Invalid OTP');
            }
            const token = response.data.access_token;
            if (!token) {
                toast.error('Không tìm thấy token!');
                throw new Error('Token not found');
            }
            localStorage.setItem('token', token);

            // Gọi API lấy thông tin user
            const userResponse = await axios.get('http://localhost:8000/api/get_user', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const user = userResponse.data;
            console.log(user);
            login(user);
            navigate('/');
            console.log('OTP verified');
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                setError(error.response?.data?.detail || 'Failed to verify OTP');
            } else {
                setError('Unexpected error');
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.instruction}>
                The verification code has been sent to the phone number <strong>{phoneNumber}</strong>
            </div>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.codeInput}>
                    {otp.map((value, index) => (
                        <input
                            key={index}
                            type="text"
                            id={`otp-input-${index}`}
                            maxLength={1}
                            value={value}
                            onChange={(e) => handleOtpChange(e, index)}
                            className={styles.codeInputField}
                        />
                    ))}
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <button type="submit" className={styles.button}>
                    Continue
                </button>
            </form>

        </div>
    );
};

export default OtpPage;
