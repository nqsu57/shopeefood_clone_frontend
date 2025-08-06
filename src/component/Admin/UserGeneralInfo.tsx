import styles from './AdminUserDetail.module.css';
import { User } from '../../types/user';

interface Props {
    user: User;
}

const UserGeneralInfo = ({ user }: Props) => {
    return (
        <div className={styles.sectionContainer}>
            <div className={styles.detailUser}>
                <h1 className={styles.title}>{user.name}</h1>
                <div className={styles.inforLabel}>
                    <div className={styles.infoRow}>
                        <label className={styles.label}>Email:</label>
                        <span className={styles.value}>{user.email}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <label className={styles.label}>Phone number:</label>
                        <span className={styles.value}>{user.phone}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <label className={styles.label}>Gender:</label>
                        <span className={styles.value}>{user.gender}</span>
                    </div>
                    <div className={styles.infoRow}>
                        <label className={styles.label}>Role:</label>
                        <span className={styles.value}>{user.role}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserGeneralInfo;