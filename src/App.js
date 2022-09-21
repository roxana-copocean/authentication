import { useContext } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import Layout from './components/Layout/Layout';
import UserProfile from './components/Profile/UserProfile';
import AuthContext from './context/auth-context';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

function App() {
	const context = useContext(AuthContext);
	return (
		<Layout>
			<Switch>
				<Route path="/" exact>
					<HomePage />
				</Route>
				{!context.isLoggedIn && (
					<Route path="/auth">
						<AuthPage />
					</Route>
				)}
				{context.isLoggedIn && (
					<Route path="/profile">
						<UserProfile />
					</Route>
				)}
				<Route path="*">
					<Redirect to="/" />
				</Route>
			</Switch>
		</Layout>
	);
}

export default App;
