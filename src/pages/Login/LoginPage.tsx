import React, { useState, useEffect } from 'react';
import { Link, redirect, useNavigate } from "react-router-dom";
import styles from './Login.module.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../AuthContext';
import { FaPhone } from 'react-icons/fa';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    toast.dismiss();
  }, []);

  const checkInvalid = () => {
    if (!email) {
      toast.warn("Please input your email");
      return false;
    }
    if (!password) {
      toast.warn("Please input your password");
      return false;
    }
    return true;
  }

  const redirectPhoneLogin = () => {
    navigate('/phonelogin'); // Redirect when the button is clicked
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkInvalid()) return;

    try {
      const response = await axios.post(
        'http://localhost:8000/api/login',
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      const token = response.data.access_token;
      localStorage.setItem('token', token);

      const userRes = await axios.get('http://localhost:8000/api/get_user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      //  Lưu vào AuthContext
      login(userRes.data);
      console.log("user log",userRes.data)
      if (userRes.data.role === 'admin') {
        navigate('/admin/user-list');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login error', err);
      if (axios.isAxiosError(err) && err.response) {
        const status = err.response.status;
        const detail = err.response.data.detail;

        if (status === 401) {
          toast.error("Incorrect email or password.");
        } else if (status === 403) {
          toast.error("Your account is not verified or has been disabled.");
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
      } else {
        toast.error("Network error. Please check your connection.");
      }
    }
  };


  return (
    <>
      <div className={styles.container}>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <button className={styles.btnPhone} onClick={redirectPhoneLogin} type="button">
            <FaPhone className={styles.iconPhone} />
            <span className={styles.btnText}>PHONE</span>
          </button>
          <div className='input-field'>
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className={styles.forgotPassword}> <Link to="/forgotpassword">Forgot password</Link></div>
          <button type="submit">Sign In</button>
        </form>
        {/* <div className={styles.alert_dange}>{message && <p>{message}</p>}</div> */}
      </div>
      <div><p>Don't have an account? <Link to="/signup">Sign Up</Link></p></div>
      <ToastContainer
        className={"toast_container"}
        position="top-center"
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        autoClose={3000}
        limit={2} />

    </>
  );
};

export default LoginPage;
