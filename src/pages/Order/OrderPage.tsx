import styles from './OrderPage.module.css';
import { CiLocationOn } from "react-icons/ci";
function OrderPage() {
    return (
        <>
            <div className={styles.orderContainer}>
                <div className={styles.addressSection}>
                    <div className={styles.addressHeader}>
                        <CiLocationOn />
                        <h2>Địa chỉ nhận hàng</h2>
                    </div>
                    <div className={styles.addressInfo}>
                        <span>Ninh Dương Lan Ngọc</span>
                        <span>034933554</span>
                        <span>Thành Phố Hồ Chí Minh Thành Phố Hồ Chí Minh Thành Phố Hồ Chí Minh</span>
                    </div>
                </div>
                <div className={styles.productSection}>
                </div>
            </div>
        </>
    );
};
export default OrderPage;