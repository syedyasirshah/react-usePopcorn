import { useEffect } from "react";
import { useRef } from "react";

function Search({ query, onSetQuery }) {
	const inputRef = useRef();

	useEffect(
		function () {
			function callback(e) {
				if (document.activeElement === inputRef.current) return;

				if (e.code === "Enter") {
					inputRef.current.focus();
					onSetQuery("");
				}
			}

			document.addEventListener("keydown", callback);
			return () => document.removeEventListener("keydown", callback);
		},
		[onSetQuery]
	);
	return (
		<div>
			<input
				className='search'
				type='text'
				placeholder='Search movies...'
				value={query}
				ref={inputRef}
				onChange={(e) => onSetQuery(e.target.value)}
			/>
		</div>
	);
}

export default Search;
