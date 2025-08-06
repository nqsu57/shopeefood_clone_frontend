import styles from "./AdminUserDetail.module.css";
import { DriverProfile } from "../../types/driver";

// interface DriverProfile {
//   license_number: string;
//   vehicle_type: string;
//   license_plate: string;
//   driver_license_number: string;
//   identity_card_number: string;
// }

interface Props {
  profile: DriverProfile;
}

const DriverInfo = ({ profile }: Props) => {
  return (
    <div className={styles.sectionContainer}>
      <div className={styles.detailUser}>
        <div className={styles.inforLabel}>
          <div className={styles.infoRow}>
            <label className={styles.label}>Số GPLX:</label>
            <span className={styles.value}>{profile.license_number}</span>
          </div>
          <div className={styles.infoRow}>
            <label className={styles.label}>Loại xe:</label>
            <span className={styles.value}>{profile.vehicle_type}</span>
          </div>
          <div className={styles.infoRow}>
            <label className={styles.label}>Biển số:</label>
            <span className={styles.value}>{profile.license_plate}</span>
          </div>
          <div className={styles.infoRow}>
            <label className={styles.label}>Số bằng lái:</label>
            <span className={styles.value}>{profile.driver_license_number}</span>
          </div>
          <div className={styles.infoRow}>
            <label className={styles.label}>CCCD:</label>
            <span className={styles.value}>{profile.identity_card_number}</span>
          </div>
        </div>
      </div>
    </div>
  )
};

export default DriverInfo;
