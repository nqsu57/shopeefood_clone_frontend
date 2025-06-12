import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function ResetPasswordForm() {
  const [params] = useSearchParams();
  const token = params.get("token") ?? "";
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/reset-password", { token, new_password: newPassword });
      setMsg("Password reset successful.");
    } catch (err) {
      setMsg("Error resetting password.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="password" placeholder="New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <button type="submit">Reset Password</button>
      <p>{msg}</p>
    </form>
  );
}
