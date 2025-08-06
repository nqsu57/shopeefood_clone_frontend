import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminUserDetailPage.module.css";
import UserGeneralInfo from "../../component/Admin/UserGeneralInfo";
import DriverInfo from "../../component/Admin/DriverInfo";
import RestaurantInfo from "../../component/Admin/RestaurantInfo";
import UserAddresses from "../../component/Admin/UserAddresses";
import { User } from "../../types/user";

const AdminUserDetailPage = () => {
    const { id } = useParams();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => setUser(res.data));
    }, [id]);

    if (!user) return <div>Loading...</div>;

    return (
        <div className={styles.pageContainer}>
            <div className={styles.headerUser}>
                <div className={styles.avatarContainer}>
                    <img
                        src={user.avatar_url?.trim() ? user.avatar_url : '/default-avatar.png'}
                        alt="Avatar"
                        className={styles.avatar}
                    />
                </div>
                <div>
                    {user.role === "restaurant" ? (
                        <h1 className={styles.title}>
                            {user.restaurant_profile.name}
                        </h1>
                    ) : (
                        <h1 className={styles.title}>
                            {user.name}
                        </h1>
                    )

                    }

                    <span className={styles.verified}>
                        <strong>Verified: </strong>
                        {user.is_verified ? '✔' : '✖'}
                    </span>
                </div>
            </div>

            {user.role === "restaurant" ? (
                user.restaurant_profile ? (
                    <RestaurantInfo profile={user.restaurant_profile} />
                ) : (
                    <p>Không có thông tin nhà hàng.</p>
                )
            ) : (
                <>
                    <UserGeneralInfo user={user} />

                    {user.role === "driver" && user.driver_profile && (
                        <DriverInfo profile={user.driver_profile} />
                    )}

                    {/* {user.addresses.length > 0 && (
                        <UserAddresses addresses={user.addresses} />
                    )} */}
                </>
            )}
        </div>
    );
};

export default AdminUserDetailPage;