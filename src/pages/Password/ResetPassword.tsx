import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import styles from './ResetPassword.module.css' 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("The link is invalid.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("The password does not match.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:8000/api/auth/reset-password", {
        token,
        new_password: password,
      });
      toast.success("Password reset successful!");
      navigate('/login');


    } catch (err: any) {
      toast.error(err.response?.data?.detail || "An error has occurred.");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reset Password</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>New password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label className={styles.label}>Confirm password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? " Processing... " : "Confirm password change"}
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;