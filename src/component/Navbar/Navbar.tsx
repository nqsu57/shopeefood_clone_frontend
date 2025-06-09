import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import styles from './Navbar.module.css';
import { AuthContext, useAuth } from '../../AuthContext';

function Navbar() {
    // const { isLoggedIn, login, logout } = useContext(AuthContext);
    const { isLoggedIn, login, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const redirectLogin = () => {
        navigate('/login');
    }


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

            {/* <div className={styles.right}>
            <Link to="/login" className={styles.loginButton}>Sign in</Link>
        </div> */}
            <div>
                {!isLoggedIn ? (
                    <button onClick={redirectLogin} className={styles.loginButton}>
                        Sign In
                    </button>
                ) : (

                    <button onClick={handleLogout} className={styles.loginButton}>
                        Log out
                    </button>
                )}
            </div>
            <div className={styles.user}>
                <Link to="/profile">Account</Link>
            </div>
        </nav>
    );
}

export default Navbar;

