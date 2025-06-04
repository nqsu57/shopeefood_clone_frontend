import React from 'react';
import styles from './User.module.css';

function UserPage() {
    const isChange = false;
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
                        <select defaultValue="Nam">
                            <option>Nam</option>
                            <option>Nữ</option>
                        </select>
                    </div>

                    <div className={styles.informationField}>
                        <label>Email</label>
                        <input type="email" />
                    </div>
                    <div className={styles.informationField}>
                        <label>Mật khẩu mới</label>
                        <input type="password" />
                    </div>
                      <div className={styles.informationField}>
                        <label>Nhập lại mật khẩu mới</label>
                        <input type="password" />
                    </div>
                    <div className={styles.btnchangePassword}>
                       <a href='#'>Đổi mật khẩu</a> 
                    </div>
                    <button className={styles.btnSave}>Lưu thay đổi</button>
                </div>

                <hr />

                <div className={styles.phoneSection}>
                    <label>Số điện thoại</label>
                    <div className={styles.phoneVerified}>
                        <span>+84349353537</span>
                        <button className={styles.btn}>Cập nhật số điện thoại</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserPage;

