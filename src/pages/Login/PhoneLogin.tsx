import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './PhoneLogin.module.css';
import { toast, ToastContainer } from 'react-toastify';
import { FaPhoneAlt } from "react-icons/fa";

const LoginPhone: React.FC = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!phoneNumber) {
            toast.error('Please input phone number');
            return;
        }

        setIsLoading(true);
        setError('');
        console.log(phoneNumber);
        try {
            // Gọi API để gửi số điện thoại và nhận OTP
            const response = await fetch('http://localhost:8000/api/auth/request-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phoneNumber }),
            });
            console.log(response);
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                if (response.status === 404) {
                    toast.error('The phone number has not been registered!');
                } else if (response.status === 400) {
                    toast.error(data.detail || 'Invalid phone number format.');
                } else {
                    toast.error('An error occurred while sending the OTP.');
                }
                return;
            }

            toast.success('OTP sent successfully!');
            navigate('/otp-page', { state: { phoneNumber } });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.logo}>
                <img src="https://shopeefood.vn/app/assets/img/Logo-ShopeefoodVN.png?a233b36c37415f85f46c25a6cd0963aa" alt="ShopeeFood Logo" className={styles.logoImage} />
            </div>
            <form onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                <FaPhoneAlt className={styles.iconPhone}/>
                    <input
                        type="tel"
                        placeholder="Please input phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                    {error && <div style={{ color: 'red', fontSize: '12px' }}>{error}</div>}
                </div>
                <button type="submit" className={styles.button} disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Continue'}
                </button>
            </form>
            <div className={styles.footer}>
                By pressing <strong>Continue</strong>, you agree to{' '}
                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
                    Terms of Service
                </a> and{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
                    Privacy Policy
                </a> of ShopeeFood.
            </div>
        </div>
    );
};

export default LoginPhone;
