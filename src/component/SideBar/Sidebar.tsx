import { useState } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';



function UserSidebar({ user }: { user: any }) {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const [activeMenu, setActiveMenu] = useState<'profile' | 'addresses'>('profile');
    const [isSubmenuOpen, setIsSubmenuOpen] = useState(true); 
    const navigate = useNavigate();

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
                    className={`${styles.menuItem} ${isSubmenuOpen ? styles.active : ''}`}
                    onClick={() => setIsSubmenuOpen(!isSubmenuOpen)}
                >
                    Update account
                </li>

                {isSubmenuOpen && (
                    <ul className={styles.submenu}>
                        <li
                            className={`${styles.submenuItem} ${activeMenu === 'profile' ? styles.active : ''}`}
                            onClick={() => {setActiveMenu('profile');
                            navigate('/account/profile');}
                                }
                        >
                            Profile
                        </li>
                        <li
                            className={`${styles.submenuItem} ${activeMenu === 'addresses' ? styles.active : ''}`}
                            onClick={() => {
                                setActiveMenu('addresses');
                                navigate('/account/address');
                            }}
                        >
                            Addresses
                        </li>
                    </ul>
                )}

                <li className={styles.menuItem}>Order information</li>
                <li className={styles.menuItem}>Payment method</li>
            </ul>
        </aside>

    );
}

export default UserSidebar;
