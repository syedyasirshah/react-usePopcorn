import { useEffect, useState } from "react";
const key = "f84fc31d";
export function useFetchMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	useEffect(
		function () {
			const abortController = new AbortController();
			async function fetchMovies() {
				try {
					setIsLoading(true);
					setError("");
					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${key}&s=${query}`,
						{ signal: abortController.signal }
					);
					if (!res.ok)
						throw new Error("Something went wrong with fetching movies");

					const data = await res.json();
					if (data.Response === "False") throw new Error("Movie not found");
					setMovies(data.Search);
					setError("");
					setIsLoading(false);
				} catch (error) {
					console.log("error: ", error);
					setError(error.message);
				} finally {
					setIsLoading(false);
				}
			}
			//handleWatchedList();
			fetchMovies();
			return () => abortController.abort();
		},
		[query]
	);
	return { movies, error, isLoading };
}
