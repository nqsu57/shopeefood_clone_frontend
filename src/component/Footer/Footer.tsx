import styles from './Footer.module.css';

function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.contact}>
                <h3>Công ty</h3>
                <ul>
                    <li>Giới thiệu</li>
                    <li>Trung tâm trợ giúp</li>
                    <li>Ứng dụng</li>
                    <li>Biến đổi số cùng Bảo mật thông tin</li>
                    <li>Liên hệ</li>
                    <li>Hợp tác nhãn viên giao hàng</li>
                    <li>Đăng ký quán ShopeeFood Uni</li>
                    <li>Shopee Blog</li>
                </ul>
            </div>
            <div className={styles.appLinks}>
                <h3>Ứng dụng ShopeeFood</h3>
                <div>
                    <a href="https://www.apple.com/app-store/" target="_blank" rel="noopener noreferrer">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Download_on_the_App_Store_RGB_blk.svg/2560px-Download_on_the_App_Store_RGB_blk.svg.png" alt="App Store" />
                    </a>
                    <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer">
                        <img src="https://vn.jbl.com/on/demandware.static/-/Sites-JB-APAC-NCOM-Library/default/dw880ad56f/glp/headphones-app-2020/images/google-play-badge.png" alt="Google Play" />
                    </a>
                    <a href="https://www.huawei.com/appgallery/" target="_blank" rel="noopener noreferrer">
                        <img src="https://hellopaisa.co.za/hellopaisa-2021/wp-content/uploads/2021/06/huawei-Badge-Black.png" alt="AppGallery" />
                    </a>
                </div>
            </div>
            <div className={styles.company}>
                <img src="https://shopeefood.vn/app/assets/img/Logo-ShopeefoodVN.png?a233b36c37415f85f46c25a6cd0963aa" alt="ShopeeFood Logo" />
                <p>© 2025 ShopeeFood</p>
                <div className={styles.social}>
                    <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
                        <span>Facebook</span>
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                        <span>Instagram</span>
                    </a>
                </div>
            </div>
            <div className={styles.address}>
                <h3>Địa chỉ công ty</h3>
                <p>Công ty Cổ Phần Foody</p>
                <p>Lầu 6, Tòa nhà FPT, số 244 đường Cống Quỳnh, phường Phạm Ngũ Lão, Quận 1, TP.HCM</p>
                <p>Giấy CNĐKKD số 031282036 do Sở Kế hoạch và Đầu tư TP.HCM cấp ngày 11/02/2012</p>
                <p>Chủ tịch hội đồng quản trị: Nguyễn Hải Đăng</p>
                <p>Hotline: 028 7109 6879 | cskh@support.shopeefood.vn</p>
                <div className={styles.certification}>
                    <img src="https://shopeefood.vn/app/assets/img/gov_seals1.jpg?4534b28245a7aad9805fbddc90f873d8" alt="Đã Đăng Ký" />
                </div>
            </div>

        </footer>
    );
};

export default Footer;