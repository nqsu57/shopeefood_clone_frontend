import React, { useState } from 'react';
import style from './Password.module.css';
import axios from "axios";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("error");

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
            setMsg("The email format is incorrect.");
            setMsgType("error");
            return;
        }
        try {
            // await axios.post("http://localhost:8000/api/auth/forgot-password", { email });
            await axios.post(
                "http://localhost:8000/api/forgot-password-test",
                { email },
                { headers: { "Content-Type": "application/json" } }
            );
            setMsg("The email has been sent, please check your inbox.");
            setMsgType("success");
        } catch (err) {
            setMsg("An error occurred while sending the email.");
            setMsgType("error");
        }
    };

    return (
        <div className={style.container}>
            <div className={style.content}>
                <h2>Forgot password</h2>
                <span>Enter your email, system will send you a new password.</span>
            </div>
            <form className={style.sendMail} onSubmit={handleSubmit}>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {msg && <p className={msgType === "error" ? style.errorMsg : style.successMsg}>{msg}</p>}

                <button className={style.btnSend}>Send password</button>
            </form>
        </div>
    );
}

export default ForgotPassword;