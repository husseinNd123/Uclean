import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure you have axios installed: npm install axios
import styles from '../../../assets/css/SignIn.module.css';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  // Function to clear expired local storage items
  const clearExpiredStorage = () => {
    const accessTokenExpiry = localStorage.getItem('accessTokenExpiry');
    const now = new Date().getTime();

    if (accessTokenExpiry && now > parseInt(accessTokenExpiry, 10)) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('accessTokenExpiry');
      localStorage.removeItem('username');
      window.location.href = '/login';
    }
  };

  // Check and clear expired storage on component load
  useEffect(() => {
    clearExpiredStorage();
  }, []);


  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('API URL:', process.env.REACT_APP_API_URL);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/users/userlogin`, { username, password });

      if (response.status === 200) {
        const data = response.data;
        const expiryTime = 28800000; // 8 hours in milliseconds
        const expiryDate = new Date().getTime() + expiryTime;
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('UserPermissions', data.UserPermissions);
        localStorage.setItem('accessTokenExpiry', expiryDate.toString());
        localStorage.setItem('username', username);
        const loginTimestamp = new Date().toISOString();
        localStorage.setItem('loginTimestamp', loginTimestamp);
        window.location.href = '#/admin/default';
      } else if (response.error === "Password incorrect") {
        console.error("Password incorrect");
        setError("Wrong Password!");
      } else if (response.error === "Username incorrect") {
        console.error(`User ${username} not found`);
        setError("User Not Found!");
      } else {
        const errorMessage = response.data.error;
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('User name or password is incorrect.');
    }
  };

  return (
    <section className={styles.body}>
      <div className={styles.section}>
        <form>
          <h1 className={styles.h1}>Login</h1>

          <div className={styles.inputBox}>
            <input
              type="text"
              required
              id="username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              placeholder="user" // Empty space as placeholder
              className={styles.input}
            />
            <label htmlFor="username" className={styles.inputBoxLabel}>Username</label>
          </div>

          <div className={styles.inputBox}>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="password"
              className={styles.input}
            />
            <label htmlFor="password" className={styles.inputBoxLabel}>Password</label>
          </div>

          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="showPassword">Show Password</label>
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" className={styles.button} onClick={handleLogin}>Log In</button>
        </form>
      </div>
    </section>
  );
};

export default SignIn;
