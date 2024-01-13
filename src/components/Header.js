import Logo from "./Logo";
import Search from "./Search";
function Header({ movies, query, onSetQuery }) {
	return (
		<nav className='nav-bar'>
			<Logo />
			<Search query={query} onSetQuery={onSetQuery} />
			<p className='num-results'>
				Found <strong>{movies.length}</strong> results
			</p>
		</nav>
	);
}

export default Header;
