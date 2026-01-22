import React, { createContext, useContext, useState } from 'react';

const Logincheck = createContext();

export const LoginProvider = ({ children }) => {
    const [islogin, setIslogin] = useState(false);

    const login = () => {
        setIslogin(true);
    };

    const logout = () => {
        setIslogin(false);
    };

    return (
        <Logincheck.Provider value={{ islogin, login, logout }}>
            {children}
        </Logincheck.Provider>
    );
};

export const uselogin = () => useContext(Logincheck);