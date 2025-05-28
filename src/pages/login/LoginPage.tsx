import React, { useState } from 'react';
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
    <div className={styles.container}>
      <h2>Đăng nhập</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};
// function LoginPage(){
//     return (
//         <div>Form</div>
//     )
// }

export default LoginPage;
