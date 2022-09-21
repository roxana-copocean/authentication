import React, { useState } from 'react';

const AuthContext = React.createContext({
	token: '',
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {}
});

// calculation the expiration time
const calculateRemaniningTime = (expirationTime) => {
	const currentTime = new Date().getTime();
	const adjustedExpiratinTime = new Date(expirationTime).getTime();
	const remainingTime = adjustedExpiratinTime - currentTime;
	return remainingTime;
};

export const AuthContextProvider = (props) => {
	const initialToken = localStorage.getItem('token');
	const [ token, setToken ] = useState(initialToken);

	const userIsLoggedIn = !!token;

	const logoutHandler = () => {
		setToken(null);
		localStorage.removeItem('token');
	};

	const loginHandler = (token, expirationTime) => {
		setToken(token);
		localStorage.setItem('token', token);
		const remainingTime = calculateRemaniningTime(expirationTime);
		setTimeout(logoutHandler, remainingTime);
	};

	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler
	};
	return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
