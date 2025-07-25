import { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';


function UserSidebar({ user }: { user: any }) {
    const location = useLocation();
    const navigate = useNavigate();
    const isActive = (path: string) => location.pathname === path;
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(true);
    const isAccountSection = location.pathname.startsWith('/account/profile') || location.pathname.startsWith('/account/address');


    return (
        <aside className={styles.sidebar}>
            <div className={styles.userInfo}>
                <img
                    src={user.avatar_url?.trim() ? user.avatar_url : '/default-avatar.png'}
                    alt="Avatar"
                    className={styles.avatar}
                />
                <h3>{user.name}</h3>
            </div>

            <ul className={styles.menu}>
                <li
                    className={`${styles.menuItem} ${isAccountSection ? styles.active : ''}`}
                    onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                >
                    Update account
                </li>

                {isSubmenuOpen && (
                    <ul className={styles.submenu}>
                        <li
                            className={`${styles.submenuItem} ${isActive('/account/profile') ? styles.active : ''}`}
                            onClick={() => navigate('/account/profile')}
                        >
                            Profile
                        </li>
                        <li
                            className={`${styles.submenuItem} ${isActive('/account/address') ? styles.active : ''}`}
                            onClick={() => navigate('/account/address')}
                        >
                            Addresses
                        </li>
                    </ul>
                )}

                <li
                    className={`${styles.menuItem} ${isActive('/account/myorder') ? styles.active : ''}`}
                    onClick={() => navigate('/account/myorder')}
                >
                    Order information
                </li>

                <li className={styles.menuItem}>
                    Payment method
                </li>
            </ul>
        </aside>
    );
}

export default UserSidebar;