import React, { useState, useEffect } from "react";
import styles from "./User.module.css";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AvatarUploader from "../../component/Avatar/Avatar";

function UserPage() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  const [originalUser, setOriginalUser] = useState({
    name: "",
    phone: "",
    gender: "Default",
    avatar_url: "",
  });

  const [user, setUser] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    gender: "Default",
    avatar_url: "",
  });

  useEffect(() => {
    if (!showChangePassword) {
      setNewPassword("");
      setConfirmPassword("");
      setCurrentPassword("");
    }
  }, [showChangePassword]);

  // useEffect(() => {
  //   console.log("Avatar updated → user.avatar_url:", user.avatar_url);
  // }, [user.avatar_url]);
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:8000/api/get_user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("RESPONSE USER DATA:", res);
        const data = res.data;

        const id = data.id || data._id || data.user_id || "";
        console.log(id);
        const name = data.name || "";
        const phone = data.phone || "";
        const email = data.email || "";
        const gender = data.gender || "Default";
        const avatar_url = data.avatar_url || "";
        ;
        console.log(data.avatar_url);
        setUser({ id, name, phone, email, gender, avatar_url });
        setOriginalUser({ name, phone, gender, avatar_url });

      } catch (error) {
        console.error("Unable to retrieve user information", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    const nameChanged = user.name !== originalUser.name;
    const genderChanged = user.gender != originalUser.gender;
    const phoneChanged = user.phone != originalUser.phone;
    const isPasswordChange = currentPassword || newPassword || confirmPassword;

    if (!nameChanged && !genderChanged && !phoneChanged && !isPasswordChange) {
      toast.info("No changes to update");
      return;
    }

    if (isPasswordChange) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        toast.warn("Please fill in all password fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        toast.warn("New passwords do not match.");
        return;
      }
    }

    const payload: any = {};
    if (nameChanged) payload.name = user.name;
    if (genderChanged) payload.gender = user.gender;
    if (phoneChanged) payload.phone = user.phone;
    if (isPasswordChange) {
      payload.current_password = currentPassword;
      payload.new_password = newPassword;
      payload.confirm_password = confirmPassword;
    }

    try {
      await axios.put(
        "http://localhost:8000/api/users/update_profile",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Profile updated successfully.");

      if (isPasswordChange) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowChangePassword(false);
      }

      setOriginalUser({ name: user.name, phone: user.phone, gender: user.gender, avatar_url: user.avatar_url });
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      if (detail === "Current password is incorrect.") {
        toast.error("Current password is incorrect. Please try again.");
      } else {
        toast.error(detail || "Failed to update profile.");
      }
      // toast.error(error.response?.data?.detail || "Failed to update profile.");
    }
  };

  const handleAvatarUploaded = async (newUrl: string) => {
    const token = localStorage.getItem('token');
    console.log("AvatarUploader:", AvatarUploader)
    if (!token || !user.id) {
      console.error('Missing token or user ID');
      return;
    }
    try {
      await axios.put(`http://localhost:8000/api/users/${user.id}/avatar`,
        { avatar_url: newUrl },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // setUser({ ...user, avatar_url: newUrl });
      setUser((prev) => ({
        ...prev,
        avatar_url: newUrl,
      }));


      // setOriginalUser({ ...originalUser, avatar_url: newUrl });
      setOriginalUser((prevOriginal) => ({
        ...prevOriginal,
        avatar_url: newUrl,
      }));
    } catch (err) {
      console.error('Update avatar failed:', err);
      toast.warn('Update avatar failed. Please try again.');
    }
  };
  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.userInfo}>
          <img
            src={user.avatar_url?.trim() ? user.avatar_url : "/default-avatar.png"}
            alt="Avatar"
            className={styles.avatar}
          />
          <h3>{user.name}</h3>
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
        <AvatarUploader
          initialAvatarUrl={user.avatar_url}
          onAvatarUploaded={handleAvatarUploaded}
        />


        {/* <div className={styles.avatarUpload}>
            <img
              src=""
              alt="Avatar"
              className={styles.avatarPreview}
            />
            <div className={styles.uploadArea}>
              <input type="file"/>
              <button className={styles.btn}>Update</button>
              <p className={styles.note}>
                Accepts GIF, JPEG, PNG, BMP with a maximum size of 5.0 MB
              </p>
            </div>
          </div> */}

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
              value={user.gender}
              onChange={(e) => setUser({ ...user, gender: e.target.value })}
            >
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
          <div className={styles.informationField}>
            <label>Phone</label>
            <input type="tel" value={user.phone}
              onChange={(e) => setUser({ ...user, phone: e.target.value })} />
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
      </main>
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

export default UserPage;
