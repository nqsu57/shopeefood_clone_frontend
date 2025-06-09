import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from './Login.module.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../AuthContext';


const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
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
  toast.dismiss();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = checkInvalid();
    if (!isValid) {
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/login",
        new URLSearchParams({
          username: email,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // console.log("RES", response);
      const token = response.data.access_token;
      localStorage.setItem("token", token);
      console.log("Token login", token)
      login();
      setMessage("Login successful!");
      navigate("/profile");
    } catch (error) {
      console.error("Login error", error);
      toast.error("Email or password is incorrect");
      setMessage("Email or password is incorrect");
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
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
        limit={2}  />

    </>
  );
};

export default LoginPage;
