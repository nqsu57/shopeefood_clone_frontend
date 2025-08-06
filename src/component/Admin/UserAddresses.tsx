import styles from "./AdminUserDetail.module.css";

interface Address {
  id: number;
  street: string;
  ward: string;
  district: string;
  province: string;
}

interface Props {
  addresses: Address[];
}

const UserAddresses = ({ addresses }: Props) => (
  <div className={`${styles.sectionContainer} ${styles.addressSection}`}>
    <h2 className={styles.sectionTitle}>Địa chỉ giao hàng</h2>
    {addresses.map((addr) => (
      <div key={addr.id} className={styles.addressItem}>
        <p>{addr.street}, {addr.ward}, {addr.district}, {addr.province}</p>
      </div>
    ))}
  </div>
);

export default UserAddresses;
