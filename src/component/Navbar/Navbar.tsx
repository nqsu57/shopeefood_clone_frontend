import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './Navbar.module.css';

function Navbar() {
    return (
        <nav className={styles.navbar}> 
            {/* Logo */}
            <div className={styles.left}>
                <div className={styles.logo}>
                    <img
                        src="https://shopeefood.vn/app/assets/img/shopeefoodvn.png?4aa1a38e8da801f4029b80734905f3f7"
                        alt="ShopeeFood Logo"
                    />
                </div>
            </div>

            {/* Search */}
            <div className={styles.center}>
                <input
                    type="text"
                    placeholder="Find places, item, address..."
                    className={styles.searchInput}
                />
                <button type="submit" className={styles.searchButton}>
                    <FaSearch />
                </button>
            </div>

            {/* Đăng nhập */}
            <div className={styles.right}>    
                <Link to="/login" className={styles.loginButton}>Sign in</Link>
            </div>
            <div className={styles.user}>
                <Link to="/profile">Account</Link>
            </div>
        </nav>
    );
}

export default Navbar;

