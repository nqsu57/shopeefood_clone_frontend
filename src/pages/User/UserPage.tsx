import React, { useState, useEffect } from 'react';
import styles from './User.module.css';
import axios from "axios";
import { data } from 'react-router-dom';

function UserPage() {
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    useEffect(() => {
        if (!showChangePassword) {
            setNewPassword("");
            setConfirmPassword("");
        }
    }, [showChangePassword]);

    const [user, setUser] = useState({
        // full_name: "",
        phone: "",
        email: "",
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
                console.log(res);
            }
            catch (error) {
                console.error("Không thể lấy thông tin user", error);
            }
      
        };

        fetchUserInfo();
    }, []);

    const handleSaveChanges = async () => {
    const token = localStorage.getItem("token");

    if (showChangePassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert("Vui lòng điền đầy đủ thông tin mật khẩu.");
            return;
        }

        if (newPassword !== confirmPassword) {
            alert("Mật khẩu mới không khớp.");
            return;
        }

        try {
            const response = await axios.put("http://localhost:8000/api/users/change_password_user", {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_password: confirmPassword,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            alert("Đổi mật khẩu thành công!");
            setShowChangePassword(false);
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error: any) {
            alert(error.response?.data?.detail || "Đổi mật khẩu thất bại.");
        }
    } else {
        // Xử lý cập nhật thông tin khác nếu cần
        alert("Thông tin người dùng đã được lưu (chưa xử lý cụ thể).");
    }
};


    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.userInfo}>
                    <img src="http://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://img7.thuthuatphanmem.vn/uploads/2023/08/18/meme-anh-da-den-cham-hoi_052117827.jpg"
                        alt="Avatar" className={styles.avatar} />
                    <h3>Ngô Quốc Sự</h3>
                </div>
                <ul className={styles.menu}>
                    <li className={styles.active}>Cập nhật tài khoản</li>
                    <li>Thông tin đơn hàng</li>
                    <li>Phương thức thanh toán</li>
                </ul>
            </aside>

            <main className={styles.profile}>
                <div className={styles.profileHeader}>
                    <h2>Thông tin người dùng</h2>
                    <button className={styles.btnDelete}>Xóa tài khoản</button>
                </div>

                <div className={styles.avatarUpload}>
                    <img src="http://img.tripi.vn/cdn-cgi/image/width=700,height=700/https://img7.thuthuatphanmem.vn/uploads/2023/08/18/meme-anh-da-den-cham-hoi_052117827.jpg" alt="Avatar" className={styles.avatarPreview} />
                    <div className={styles.uploadArea}>
                        <input type="file" />
                        <button className={styles.btn}>Cập nhật</button>
                        <p className={styles.note}>
                            Chấp nhận GIF, JPEG, PNG, BMP với kích thước tối đa 5.0 MB
                        </p>
                    </div>
                </div>
                <hr />
                <div className={styles.form}>
                    <div className={styles.informationField}>
                        <label>Tên</label>
                        <input type="text" />
                    </div>

                    <div className={styles.informationField}>
                        <label>Giới tính</label>
                        <select defaultValue="Default">
                            <option>Default</option>
                            <option>Nam</option>
                            <option>Nữ</option>
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
                                <label>Nhập mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                />
                            </div>
                            <div className={styles.informationField}>
                                <label>Mật khẩu mới</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className={styles.informationField}>
                                <label>Nhập lại mật khẩu mới</label>
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
                            Đổi mật khẩu
                        </a>
                    </div>
                    <button className={styles.btnSave} 
                    onClick={handleSaveChanges}>Lưu thay đổi</button>

                    {showChangePassword && (
                        <button
                            type="button"
                            className={styles.btnCancel}
                            onClick={() => {
                                setShowChangePassword(false);
                                setNewPassword('');
                                setConfirmPassword('');
                            }}
                        >
                            Huỷ
                        </button>
                    )}

                </div>

                <hr />

                <div className={styles.phoneSection}>
                    <label>Số điện thoại</label>
                    <div className={styles.phoneVerified}>
                        <input type='tel' value={user.phone} />
                        <button className={styles.btn}>Cập nhật số điện thoại</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserPage;

