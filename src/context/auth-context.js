import React, { useState, useEffect, useCallback } from 'react';

let logoutTimer;
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

const retriveStoredToken = () => {
	const storedToken = localStorage.getItem('token');
	const storedExpirationDate = localStorage.getItem('expirationTime');
	const remainingTime = calculateRemaniningTime(storedExpirationDate);
	if (remainingTime <= 0) {
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');
		return null;
	}
	return { token: storedToken, duration: remainingTime };
};

// AUTH Context Provider
export const AuthContextProvider = (props) => {
	const tokenData = retriveStoredToken();
	let initialToken;
	if (tokenData) {
		initialToken = tokenData.token;
	}
	const [ token, setToken ] = useState(initialToken);

	const userIsLoggedIn = !!token;

	const logoutHandler = useCallback(() => {
		setToken(null);
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');
		// checking if the user is manually logging out, so we clear our timer
		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, []);

	const loginHandler = (token, expirationTime) => {
		setToken(token);
		localStorage.setItem('token', token);
		localStorage.setItem('expirationTime', expirationTime);
		const remainingTime = calculateRemaniningTime(expirationTime);
		logoutTimer = setTimeout(logoutHandler, remainingTime);
	};

	useEffect(
		() => {
			if (tokenData) {
				logoutTimer = setTimeout(logoutHandler, tokenData.duration);
			}
		},
		[ tokenData, logoutHandler ]
	);
	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		login: loginHandler,
		logout: logoutHandler
	};
	return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
