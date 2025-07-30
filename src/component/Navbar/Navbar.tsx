import React, { useContext, useState } from 'react';
import axios from 'axios';
import styles from './Navbar.module.css';
import { AuthContext, useAuth } from '../../AuthContext';
import AvatarUploader from '../Avatar/Avatar';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { LuShoppingCart } from "react-icons/lu";

interface NavbarProps {
    onCartClick: () => void;
}

function Navbar({ onCartClick }: NavbarProps) {
    const { isLoggedIn, user, logout, isLoading } = useAuth();
    const [searchQuery, setSearchQuery] = useState("");
    const [showUserMenu, setShowUserMenu] = useState(false);

    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    const handleCartClick = () => {
        if (!isLoggedIn) {
            // Chưa đăng nhập -> chuyển hướng login
            navigate('/login');
        } else {
            // Đã đăng nhập -> gọi hàm truyền từ ngoài
            onCartClick();
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

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const closeUserMenu = () => {
        setShowUserMenu(false);
    };


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
                        placeholder="Search for dishes, brand..."
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
                    <div className={styles.cartIcon} onClick={handleCartClick}>
                        <LuShoppingCart size={26} />
                    </div>

                    {/* Auth section */}
                    {!isLoggedIn || !user ? (
                        <button onClick={redirectLogin} className={styles.loginButton}>
                            Sign in
                        </button>
                    ) : (
                        <div
                            className={styles.userMenuWrapper}
                        >
                            <div
                                className={styles.userInfo}
                                onClick={toggleUserMenu}
                                role="button"
                                aria-haspopup="true"
                                aria-expanded={showUserMenu}
                            >
                                <img
                                    src={user?.avatar_url && user.avatar_url !== '' ? user.avatar_url : '/default-avatar.png'}
                                    alt="Avatar"
                                    className={styles.avatar}
                                />
                                <span className={styles.userName}>{user.name}</span>
                                <span className={styles.toggleIcon}>
                                    {showUserMenu ? <FiChevronUp /> : <FiChevronDown />}
                                </span>
                            </div>

                            {showUserMenu && (
                                <div className={styles.userDropdownMenu}>
                                    {/* Lịch sử đơn hàng */}
                                    <Link
                                        to="/account/myorder"
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                            setTimeout(closeUserMenu, 100); // Đóng menu sau khi chuyển trang
                                        }}
                                    >
                                        My Purchase
                                    </Link>

                                    <Link
                                        to="/account/profile"
                                        className={styles.dropdownItem}
                                        onClick={() => {
                                            setTimeout(closeUserMenu, 100);
                                        }}
                                    >
                                        Update Account
                                    </Link>

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            closeUserMenu();
                                        }}
                                        className={styles.dropdownItem}
                                    >
                                        Log out
                                    </button>
                                </div>
                            )}

                        </div>
                    )}
                </div>

            </nav>
        </>

    );
}

export default Navbar;
