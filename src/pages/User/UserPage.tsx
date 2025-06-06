import React, { useState, useEffect } from "react";
import styles from "./User.module.css";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { data } from "react-router-dom";

function UserPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [originalUser, setOriginalUser] = useState({
    name: "",
    phone: "",
    gender: "Default",
  });
  useEffect(() => {
    if (!showChangePassword) {
      setNewPassword("");
      setConfirmPassword("");
    }
  }, [showChangePassword]);

  const [user, setUser] = useState({
    name: "",
    phone: "",
    email: "",
    gender: "Default",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      console.log("Token", token);
      try {
        const res = await axios.get("http://localhost:8000/api/get_user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(res.data);
        setOriginalUser(res.data);
        console.log(res);
      } catch (error) {
        console.error("Unable to retrieve user information", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");
    let hasChanges = false;

    // Handle change password
    if (showChangePassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.warn("Please fill in all the required password information.");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.warn("The new passwords do not match");
        return;
      }

      try {
        const response = await axios.put(
          "http://localhost:8000/api/users/change_password_user",
          {
            current_password: currentPassword,
            new_password: newPassword,
            confirm_password: confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        toast.success("Password changed successfully");
        setShowChangePassword(false);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } catch (error: any) {
        toast.warn(error.response?.data?.detail || "Unable to change the password.");
      }
    }
  };

  // Handle change user information


  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.userInfo}>
          <img
            src="http://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://img7.thuthuatphanmem.vn/uploads/2023/08/18/meme-anh-da-den-cham-hoi_052117827.jpg"
            alt="Avatar"
            className={styles.avatar}
          />
          <h3>Ngô Quốc Sự</h3>
        </div>
        <ul className={styles.menu}>
          <li className={styles.active}>Update account</li>
          <li>Order information</li>
          <li>Payment method</li>
        </ul>
      </aside>

      <main className={styles.profile}>
        <div className={styles.profileHeader}>
          <h2>User information</h2>
          {/* <button className={styles.btnDelete}>Xóa tài khoản</button> */}
        </div>

        <div className={styles.avatarUpload}>
          <img
            src="http://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://img7.thuthuatphanmem.vn/uploads/2023/08/18/meme-anh-da-den-cham-hoi_052117827.jpg"
            alt="Avatar"
            className={styles.avatarPreview}
          />
          <div className={styles.uploadArea}>
            <input type="file" />
            <button className={styles.btn}>Update</button>
            <p className={styles.note}>
              Accepts GIF, JPEG, PNG, BMP with a maximum size of 5.0 MB
            </p>
          </div>
        </div>
        <hr />
        <div className={styles.form}>
          <div className={styles.informationField}>
            <label>Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div className={styles.informationField}>
            <label>Gender</label>
            <select
              defaultValue="Default"
              value={user.gender}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}>
              <option>Default</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div className={styles.informationField}>
            <label>Email</label>
            {/* <input type="email" value={user.email} readOnly={true} /> */}
            <span>{user.email}</span>
          </div>
          {showChangePassword && (
            <>
              <div className={styles.informationField}>
                <label>Enter current password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className={styles.informationField}>
                <label>New password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className={styles.informationField}>
                <label>Re-enter new password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </>
          )}
          <div className={styles.btnchangePassword}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowChangePassword(!showChangePassword);
              }}
            >
              Change password
            </a>
          </div>
          <button className={styles.btnSave} onClick={handleSaveChanges}>
            Save changes
          </button>

          {showChangePassword && (
            <button
              type="button"
              className={styles.btnCancel}
              onClick={() => {
                setShowChangePassword(false);
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <hr />

        <div className={styles.phoneSection}>
          <label>Phone number</label>
          <div className={styles.phoneVerified}>
            <input type="tel" value={user.phone} />
            <button className={styles.btn}>Update phone number</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default UserPage;
