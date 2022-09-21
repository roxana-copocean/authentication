import { useState, useRef, useContext } from 'react';
import AuthContext from '../../context/auth-context';
import { useHistory } from 'react-router-dom';

import classes from './AuthForm.module.css';

const AuthForm = () => {
	const history = useHistory();
	const [ isLogin, setIsLogin ] = useState(true);
	const [ isLoding, setIsLoading ] = useState(false);
	const context = useContext(AuthContext);
	const emailRef = useRef();
	const passRef = useRef();

	const switchAuthModeHandler = () => {
		setIsLogin((prevState) => !prevState);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		const enteredEmail = emailRef.current.value;
		const eneteredPass = passRef.current.value;
		setIsLoading(true);
		let url;

		if (isLogin) {
			url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env
				.REACT_APP_API_KEY}`;
		} else {
			url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_API_KEY}`;
		}
		fetch(url, {
			method: 'POST',
			body: JSON.stringify({
				email: enteredEmail,
				password: eneteredPass,
				returnSecureToken: true
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
			.then((res) => {
				setIsLoading(false);
				if (res.ok) {
					return res.json();
				} else {
					return res.json().then((data) => {
						let errorMessage = 'Authentication Faild!';
						throw new Error(errorMessage);
					});
				}
			})
			.then((data) => {
				// making the token expire after 1 hour
				const expirationTime = new Date(new Date().getTime() + +data.expiresIn * 1000);
				context.login(data.idToken, expirationTime.toISOString());
				history.replace('/');
			})
			.catch((err) => {
				alert(err.message);
			});
	};

	return (
		<section className={classes.auth}>
			<h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
			<form onSubmit={submitHandler}>
				<div className={classes.control}>
					<label htmlFor="email">Your Email</label>
					<input type="email" id="email" required ref={emailRef} />
				</div>
				<div className={classes.control}>
					<label htmlFor="password">Your Password</label>
					<input type="password" id="password" required ref={passRef} />
				</div>
				<div className={classes.actions}>
					{!isLoding && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
					{isLoding && <p>Loading...</p>}
					<button type="button" className={classes.toggle} onClick={switchAuthModeHandler}>
						{isLogin ? 'Create new account' : 'Login with existing account'}
					</button>
				</div>
			</form>
		</section>
	);
};

export default AuthForm;
