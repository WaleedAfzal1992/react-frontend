import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Remove the JWT token from local storage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        // Redirect to login page
        navigate('/login'); // Adjust the path to your login route
    };

    return (
        <nav style={styles.navbar}>
            <h1 style={styles.title}>My App</h1>
            <button onClick={handleLogout} style={styles.logoutButton}>
                Logout
            </button>
        </nav>
    );
};

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#282c34',
        color: 'white',
    },
    title: {
        margin: 0,
        fontSize: '24px',
    },
    logoutButton: {
        padding: '8px 12px',
        fontSize: '16px',
        color: 'white',
        backgroundColor: '#ff4757',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
};

export default Navbar;
