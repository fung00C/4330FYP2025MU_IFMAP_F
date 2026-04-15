import React, { createContext, useContext, useState } from 'react';

const Logincheck = createContext();

export const LoginProvider = ({ children }) => {
    const [islogin, setIslogin] = useState(() => {
        const savedStatus = localStorage.getItem('isLoggedIn');
        return savedStatus === 'true';
    });
    const login = () => {
        setIslogin(true);
        localStorage.setItem('isLoggedIn', 'true');
    };

    const logout = () => {
        setIslogin(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user_email');
        localStorage.removeItem('access_token');
    };

    return (
        <Logincheck.Provider value={{ islogin, login, logout }}>
            {children}
        </Logincheck.Provider>
    );
};

export const Uselogin = () => useContext(Logincheck);