import classes from './ProfileForm.module.css';
import { useRef, useContext } from 'react';
import AuthContext from '../../context/auth-context';
import { useHistory } from 'react-router-dom';

const ProfileForm = () => {
	const context = useContext(AuthContext);
	const newPassInputRef = useRef();
	const history = useHistory();

	const submitHandler = (e) => {
		e.preventDefault();
		const eneteredNewPass = newPassInputRef.current.value;
		fetch(`https://identitytoolkit.googleapis.com/v1/accounts:update?key=${process.env.REACT_APP_API_KEY}`, {
			method: 'POST',
			body: JSON.stringify({
				idToken: context.token,
				password: eneteredNewPass,
				eturnSecureToken: false
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then((res) => {
			history.replace('/');
		});
	};
	return (
		<form className={classes.form} onSubmit={submitHandler}>
			<div className={classes.control}>
				<label htmlFor="new-password">New Password</label>
				<input type="password" id="new-password" ref={newPassInputRef} minLength="7" />
			</div>
			<div className={classes.action}>
				<button>Change Password</button>
			</div>
		</form>
	);
};

export default ProfileForm;
