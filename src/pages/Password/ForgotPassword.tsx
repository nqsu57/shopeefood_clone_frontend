import React, { useState } from 'react';
import style from './Password.module.css'
import axios from "axios";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/api/forgot-password", { email });
            setMsg("Reset link sent to your email.");
        } catch (err) {
            setMsg("Error sending reset email.");
        }
    };
    return (
        <>
            <div className={style.container}>
                <div className={style.content}>
                    <h2>Forgot password</h2>
                    <span>Enter your email, system will send you a new password.</span>
                </div>
                <form className={style.sendMail} onSubmit={handleSubmit}>
                    <input
                        type='text'
                        placeholder="Email"
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button className={style.btnSend}>Send password</button>
                </form>
            </div>
        </>
    )
}
export default ForgotPassword;