import { useEffect, useState, useRef } from "react";
import Header from "./components/Header";
import StarRating from "./components/StarRating";
import { useFetchMovies } from "./hooks/useFetchMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
// import PropTypes from "prop-types";

const average = (arr) =>
	arr?.reduce((acc, cur, i, arr) => acc + cur / arr?.length, 0);
const KEY = "f84fc31d";

export default function App() {
	// const [movies, setMovies] = useState([]);
	// const [isLoading, setIsLoading] = useState(false);
	// const [error, setError] = useState("");
	const [query, setQuery] = useState("money");
	const { movies, error, isLoading } = useFetchMovies(query);
	const [selectedMovieId, setSelectedMovieId] = useState(null);
	const [watched, setWatched] = useLocalStorageState([], "watched");

	// const [watched, setWatched] = useState([]);
	//const [watched, setWatched] = useState(() => {
	//try {
	//const storedValue = localStorage.getItem("watched");
	// Check if storedValue is not null before parsing
	//return storedValue !== null ? JSON.parse(storedValue) : [];
	//} catch (error) {
	//	console.error("Error parsing JSON:", error);
	//	return [];
	//}
	//});
	function handleSelectedMovie(id) {
		setSelectedMovieId((selectedMovieId) =>
			id === selectedMovieId ? null : id
		);
	}

	function handleWatchedList() {
		setSelectedMovieId(null);
	}

	function handleAddWatched(movie) {
		setWatched((watched) => [...watched, movie]);
	}

	function handledeleteWatched(id) {
		setWatched((watched) => watched.filter((watch) => watch.imdbID !== id));
	}

	//useEffect(() => {
	//try {
	//	localStorage.setItem("watched", JSON.stringify(watched));
	//	} catch (error) {
	//console.error("Error stringifying JSON:", error);
	//}
	//}, [watched]);

	// useEffect(
	// 	function () {
	// 		const abortController = new AbortController();
	// 		async function fetchMovies() {
	// 			try {
	// 				setIsLoading(true);
	// 				setError("");
	// 				const res = await fetch(
	// 					`http://www.omdbapi.com/?apikey=${key}&s=${query}`,
	// 					{ signal: abortController.signal }
	// 				);
	// 				if (!res.ok)
	// 					throw new Error("Something went wrong with fetching movies");

	// 				const data = await res.json();
	// 				if (data.Response === "False") throw new Error("Movie not found");
	// 				setMovies(data.Search);
	// 				setError("");
	// 				setIsLoading(false);
	// 			} catch (error) {
	// 				console.log("error: ", error);
	// 				setError(error.message);
	// 			} finally {
	// 				setIsLoading(false);
	// 			}
	// 		}
	// 		handleWatchedList();
	// 		fetchMovies();
	// 		return () => abortController.abort();
	// 	},
	// 	[query]
	// );

	return (
		<>
			<Header movies={movies} query={query} onSetQuery={setQuery} />
			<Main>
				<BoxContainer>
					{/* {isLoading ? (
						<Loading />
					) : (
						<MovieList movies={movies} onSelectedMovie={handleSelectedMovie} />
					)} */}
					{isLoading && <Loading />}
					{!isLoading && !error && (
						<MovieList movies={movies} onSelectedMovie={handleSelectedMovie} />
					)}
				</BoxContainer>
				<BoxContainer>
					{selectedMovieId ? (
						<MovieDetails
							selectedMovieId={selectedMovieId}
							onCloseWatched={handleWatchedList}
							onAddWatched={handleAddWatched}
							watched={watched}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />

							<WatchedList
								watched={watched}
								onDeleteWatched={handledeleteWatched}
							/>
						</>
					)}
				</BoxContainer>
			</Main>
		</>
	);
}

function Main({ children }) {
	return <main className='main'>{children}</main>;
}

function BoxContainer({ children }) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<div className='box'>
			<button className='btn-toggle' onClick={() => setIsOpen((open) => !open)}>
				{isOpen ? "❎" : "✅"}
			</button>
			{isOpen && children}
		</div>
	);
}

function Loading() {
	return <h2>Loading ...</h2>;
}

// function ListBox({ children }) {
// 	const [isOpen1, setIsOpen1] = useState(true);
// 	return (
// 		<div className='box'>
// 			<button className='btn-toggle' onClick={() => setIsOpen1((open) => !open)}>
// 				{isOpen1 ? "❎" : "✅"}
// 			</button>
// 			{isOpen && children}
// 		</div>
// 	);
// }

function MovieList({ movies, onSelectedMovie }) {
	return (
		<ul className='list list-movies'>
			{movies?.map((movie) => (
				<SingleMovie
					movie={movie}
					key={movie.imdbID}
					onSelectedMovie={onSelectedMovie}
				/>
			))}
		</ul>
	);
}

function SingleMovie({ movie, onSelectedMovie }) {
	return (
		<>
			<li onClick={() => onSelectedMovie(movie.imdbID)}>
				<img src={movie.Poster} alt={`${movie.Title} poster`} />
				<h3>{movie.Title}</h3>
				<div>
					<p>
						<span>🗓</span>
						<span>{movie.Year}</span>
					</p>
				</div>
			</li>
		</>
	);
}

function MovieDetails({
	selectedMovieId,
	onCloseWatched,
	onAddWatched,
	watched,
}) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState("");
	const movieWatched = watched
		?.map((watch) => watch.imdbID)
		.includes(selectedMovieId);

	const watchedUserRating = watched?.find(
		(watch) => watch.imdbID === selectedMovieId
	)?.userRating;

	const {
		Title: title,
		Actors: actors,
		Year: year,
		Director: director,
		Poster: poster,
		Released: released,
		Runtime: runtime,
		Runtime: genre,
		imdbRating,
		Plot: plot,
	} = movie;

	const countRef = useRef(0);

	useEffect(
		function () {
			if (userRating) countRef.current++;
		},
		[userRating]
	);
	useEffect(
		function () {
			function callback(e) {
				if (e.code === "Escape") {
					onCloseWatched();
				}
			}

			document.addEventListener("keydown", callback);

			return function () {
				document.removeEventListener("keydown", callback);
			};
		},
		[onCloseWatched]
	);

	useEffect(
		function () {
			async function getMovie() {
				try {
					setIsLoading(true);
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedMovieId}`
					);

					const data = await res.json();
					console.log(data);
					setMovie(data);
				} catch (error) {
					console.log("error: ", error);
				} finally {
					setIsLoading(false);
				}
			}
			getMovie();
		},
		[selectedMovieId]
	);

	useEffect(
		function () {
			if (!title) return;
			document.title = `Movie | ${title}`;

			return () => (document.title = "usePopcorn");

			// console.log(`Clean up effect for movie ${title}`);
		},
		[title]
	);

	function handleAdd() {
		const newWatchedMovie = {
			imdbID: selectedMovieId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(" ").at(0)),
			userRating,
		};
		onAddWatched(newWatchedMovie);
		onCloseWatched();
	}
	return (
		<div className='details'>
			{isLoading ? (
				<Loading />
			) : (
				<>
					<header>
						<button className='btn-back' onClick={onCloseWatched}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${movie} movie`} />
						<div className='details-overview'>
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐️</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>

					<section>
						{!movieWatched ? (
							<div className='rating'>
								<StarRating
									maxRating={10}
									onSetRated={setUserRating}
									messages={[]}
								/>

								{userRating > 0 && (
									<button className='btn-add' onClick={handleAdd}>
										+ Add to list
									</button>
								)}
							</div>
						) : (
							<p>
								You rated this movie 0{watchedUserRating} <span>⭐️</span>
							</p>
						)}
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}
// function WatchedBox() {
// 	const [isOpen2, setIsOpen2] = useState(true);

// 	return (
// 		<div className='box'>
// 			<button
// 				className='btn-toggle'
// 				onClick={() => setIsOpen2((open) => !open)}>
// 				{isOpen2 ? "❎" : "✅"}
// 			</button>
// 			{isOpen2 && (
// 				<>
// 					<WatchedSummary watched={watched} />

// 					<WatchedList watched={watched} />
// 				</>
// 			)}
// 		</div>
// 	);
// }

function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched?.map((movie) => movie.imdbRating));
	const avgUserRating = average(watched?.map((movie) => movie.userRating));
	const avgRuntime = average(watched?.map((movie) => movie.runtime));
	return (
		<div className='summary'>
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>
						{watched.length}
						{watched.length === 1 ? " movie" : " movies"}
					</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating.toFixed(2)}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{Number(avgUserRating.toFixed(2)) || ""}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime.toFixed(2)} min</span>
				</p>
			</div>

			{/* {movieRated > 0 && (
				<p style={{ fontSize: "16px" }}>
					This movie is rated {movieRated < 10 ? `0${movieRated}` : movieRated}{" "}
					stars
				</p>
			)} */}
		</div>
	);
}

function WatchedList({ watched, onDeleteWatched }) {
	return (
		<ul className='list'>
			{watched?.map((movie) => (
				<WatchedMovie
					movie={movie}
					key={movie.imdbID}
					onDeleteWatched={onDeleteWatched}
				/>
			))}
		</ul>
	);
}

function WatchedMovie({ movie, onDeleteWatched }) {
	return (
		<li>
			<img src={movie.poster} alt={`${movie.title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating || ""}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>
				<button
					className='btn-delete'
					onClick={() => onDeleteWatched(movie.imdbID)}>
					X
				</button>
			</div>
		</li>
	);
}

// StarRating.prototype = {
// 	maxRating: PropTypes.number,
// 	color: PropTypes.string,
// 	messages: PropTypes.array,
// 	onSetRated: PropTypes.func,
// };

// function StarRating({ maxRating = 10, onSetRated, messages = [] }) {
// 	const [rating, setRating] = useState(0);
// 	const [tempRating, setTempRating] = useState(0);

// 	const handleSelectRating = (selectRating) => {
// 		setRating(selectRating);
// 		onSetRated(selectRating);
// 	};

// 	const handleHoverMouseIn = (temp) => {
// 		setTempRating(temp);
// 	};

// 	const handleHoverMouseOut = (temp) => {
// 		setTempRating(0);
// 	};
// 	// const textStyle = {
// 	//   lineHeight: "1",
// 	//   margin: "0",
// 	//   color,
// 	//   fontSize: `${size / 1.5}px`,
// 	// };

// 	return (
// 		<div>
// 			<div style={{ display: "flex", gap: "0" }}>
// 				{Array.from({ length: maxRating }, (_, i) => (
// 					<Star
// 						onGiveRating={() => handleSelectRating(i + 1)}
// 						key={i}
// 						full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
// 						onMouseIn={() => handleHoverMouseIn(i + 1)}
// 						onMouseOut={() => handleHoverMouseOut(i + 1)}
// 					/>
// 				))}
// 			</div>
// 			<p>
// 				{messages.length === maxRating
// 					? messages[tempRating ? tempRating - 1 : rating - 1]
// 					: tempRating || rating || ""}
// 			</p>
// 		</div>
// 	);
// }

// function Star({ onGiveRating, full, onMouseIn, onMouseOut }) {
// 	const starStyle = {
// 		hight: "30px",
// 		width: "30px",
// 		cursor: "pointer",
// 	};
// 	return (
// 		<span
// 			role='button'
// 			style={starStyle}
// 			onClick={onGiveRating}
// 			onMouseEnter={onMouseIn}
// 			onMouseLeave={onMouseOut}>
// 			{!full ? (
// 				<svg
// 					xmlns='http://www.w3.org/2000/svg'
// 					fill='none'
// 					viewBox='0 0 24 24'
// 					stroke='#000'>
// 					<path
// 						strokeLinecap='round'
// 						strokeLinejoin='round'
// 						strokeWidth='{2}'
// 						d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
// 					/>
// 				</svg>
// 			) : (
// 				<svg
// 					xmlns='http://www.w3.org/2000/svg'
// 					viewBox='0 0 20 20'
// 					fill='#FFFFFF'
// 					stroke='#000'>
// 					<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
// 				</svg>
// 			)}
// 		</span>
// 	);
// }
