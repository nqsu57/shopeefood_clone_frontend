import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import style from './Password.module.css'

export default function ResetPasswordForm() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError("Token missing.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/reset-password", {
        token,
        new_password: newPassword,
      });
      setMessage("Your password has been reset successfully.");
    } catch (err) {
      setError("Invalid or expired token.");
    }
  };
  return (
    <>
    <div className={style.container}>
      <div className={style.content}>
        <h2>Change password</h2>
        <span>Enter new password</span>
      </div>
      {message ? (
        <p>{message}</p>) : (
        <form onSubmit={handleSubmit}>
          <div className={style.changePassword}>
            <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <button type="submit" className={style.btnSend}>Reset Password</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
      )}
      </div>
    </>
  );
}
