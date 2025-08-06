import styles from "./AdminUserDetail.module.css";
import { User } from '../../types/user';

interface RestaurantProfile {
    name: string;
    address: string;
}

interface Props {
    profile: RestaurantProfile;
}

const RestaurantInfo = ({ profile}: Props) => (
    <div className={styles.sectionContainer}>
        <div className={styles.infoRow}>
            <label className={styles.label}>Địa chỉ:</label>
            <span className={styles.value}>{profile.address}</span>
        </div>
    </div>
);

export default RestaurantInfo;
