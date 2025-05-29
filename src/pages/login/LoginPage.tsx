import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Login.module.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Xử lý đăng nhập giả lập
    if (email === 'user@example.com' && password === '123456') {
      alert('Đăng nhập thành công!');
    } else {
      alert('Sai email hoặc mật khẩu');
    }
  };

  return (
    <>
      <div className={styles.container}>
        <h2>Sign Up</h2>
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
          <button type="submit">Sign Up</button>
        </form>
      </div>
      <div><p>Don't have an account? <Link to="/signup">Sign Up</Link></p></div>
    </>
  );
};

export default LoginPage;
