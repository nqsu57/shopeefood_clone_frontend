import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from "./Register.module.css";

function SignUpPage() {
    const [formData, setFormData] = useState({
        phone: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    toast.dismiss(); 
    const notify = () => {
        if (!formData.email) {
            toast.warn("Please input your email");
            setError('');
            return false;
        } else if (!formData.password) {
            toast.warn("Please input your password");
            return false;
        } else if (!formData.phone) {
            toast.warn("Please input your phone");
            setError('');
            return false;
        } else if (!formData.confirmPassword) {
            toast.warn("Please input confirm password");
            return false;
        } else if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!phoneRegex.test(formData.phone)) {
            toast.warn("Please enter a valid phone number");
            return;
        }
        if (!emailRegex.test(formData.email)) {
            toast.warn("Please enter a valid email address");
            return;
        }
        const isValid = notify();
        if (!isValid) {
            return;
        }
        try {
            const response = await fetch("http://localhost:8000/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    phone: formData.phone,
                    email: formData.email,
                    password: formData.password,
                }),
            });
            const result = await response.json();
            // console.log(result);
            console.log("Response OK:", response.ok);  // In trạng thái response.ok
            console.log("API Result:", result);
            if (response.ok) {
                setSuccess("Registration successful!");
                // console.log("Registration successful!");
                toast.success("Registration successful!");
                setTimeout(() => {
                    navigate("/login");
                },2000);
            } else {
                toast.error(result.detail || "Registration failed");
            }
        } catch (err) {
            console.error("Error:", err);
            toast.error("Error occurred during registration");
        }
    };
    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className={style.container}>
                {/* <div className={style.inputgroup}>
                    <label>Phone number</label>
                    <input type="tel" placeholder="Phone number" required />
                </div> */}
                <input
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    onChange={handleChange}
                    value={formData.phone}
                />
                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                />
                <input
                    name="confirmPassword"
                    type="password"
                    placeholder="Retype password"
                    onChange={handleChange}
                    value={formData.confirmPassword}
                />
                <button type="submit">Sign Up</button>
                {error && <p className={style.alert_dange}>{error}</p>}
            </form>
            <p>
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
            <ToastContainer
                className={"toast_container"}
                position="top-center"
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                autoClose={3000} 
                limit={2} />
        </div>
    );
}

export default SignUpPage;
