import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './Navbar.module.css';
import { AuthContext, useAuth } from '../../AuthContext';
import AvatarUploader from '../Avatar/Avatar';
import { LuShoppingCart } from "react-icons/lu";

interface NavbarProps {
    onCartClick: () => void;
}

function Navbar({ onCartClick }: NavbarProps) {
    const { isLoggedIn, user, logout, isLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };


    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const redirectLogin = () => {
        navigate('/login');
    };

    if (isLoading) {
        return null;
    }


    return (
        <>
            <nav className={styles.navbar}>
                {/* Left: Logo */}
                <div className={styles.left}>
                    <Link to="/">
                        <img
                            src="https://shopeefood.vn/app/assets/img/shopeefoodvn.png?4aa1a38e8da801f4029b80734905f3f7"
                            alt="ShopeeFood Logo"
                            className={styles.logo}
                        />
                    </Link>
                </div>

                {/* Center: Search */}
                <div className={styles.center}>
                    <input
                        type="text"
                        placeholder="Tìm món, địa điểm..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <button className={styles.searchButton} onClick={handleSearch}>
                        <FaSearch />
                    </button>
                </div>

                {/* Right: Cart + User */}
                <div className={styles.right}>
                    {/* Cart icon */}
                    <div className={styles.cartIcon} onClick={onCartClick}>
                        <LuShoppingCart size={26} />
                    </div>

                    {/* Auth section */}
                    {!isLoggedIn || !user ? (
                        <button onClick={redirectLogin} className={styles.loginButton}>
                            Đăng nhập
                        </button>
                    ) : (
                        <div className={styles.userInfo}>
                            <Link to="/account/profile" className={styles.profileLink}>
                                <img
                                    src={user?.avatar_url && user.avatar_url !== '' ? user.avatar_url : '/default-avatar.png'}
                                    alt="Avatar" className={styles.avatar}
                                />
                                <span className={styles.userName}>{user.name}</span>
                            </Link>
                            <button onClick={handleLogout} className={styles.logoutButton}>
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>

            </nav>
        </>

    );
}

export default Navbar;
