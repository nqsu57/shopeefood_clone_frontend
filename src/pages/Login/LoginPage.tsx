import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import styles from './Login.module.css';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ngăn reload trang

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
      setMessage("Đăng nhập thành công!");
      console.log('Okeee');
      // Điều hướng sang trang App
      navigate("/");
    } catch (error) {
      console.error("Login error", error);
      setMessage("Sai tên đăng nhập hoặc mật khẩu!");
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log(email);
  //   console.log(password);

  // };
  return (
    <>
      <div className={styles.container}>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className='input-field'>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Sign In</button>
        </form>
        <div className={styles.alert_dange}>{message && <p>{message}</p>}</div>
      

      </div>
      <div><p>Don't have an account? <Link to="/signup">Sign Up</Link></p></div>
    </>
  );
};

export default LoginPage;
