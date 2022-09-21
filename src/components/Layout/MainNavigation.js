import { Link } from 'react-router-dom';
import { useContext } from 'react';

import classes from './MainNavigation.module.css';
import AuthContext from '../../context/auth-context';

const MainNavigation = () => {
	const context = useContext(AuthContext);
	const isLoggedIn = context.isLoggedIn;
	const logOutHandler = () => {
		context.logout();
	};
	return (
		<header className={classes.header}>
			<Link to="/">
				<div className={classes.logo}>React Authentication</div>
			</Link>
			<nav>
				<ul>
					{!isLoggedIn && (
						<li>
							<Link to="/auth">Login</Link>
						</li>
					)}
					{isLoggedIn && (
						<li>
							<Link to="/profile">Profile</Link>
						</li>
					)}
					{isLoggedIn && (
						<li>
							<button onClick={logOutHandler}>Logout</button>
						</li>
					)}
				</ul>
			</nav>
		</header>
	);
};

export default MainNavigation;
