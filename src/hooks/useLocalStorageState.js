import { useState, useEffect } from "react";

export function useLocalStorageState(initialValue, key) {
	const [value, setValue] = useState(function () {
		//try {
		const storedValue = localStorage.getItem(key);
		// Check if storedValue is not null before parsing
		return storedValue !== null ? JSON.parse(storedValue) : initialValue;
		//} catch (error) {
		//	console.error("Error parsing JSON:", error);
		//	return [];
		//}
	});
	useEffect(() => {
		//try {
		localStorage.setItem(key, JSON.stringify(value));
		//	} catch (error) {
		//console.error("Error stringifying JSON:", error);
		//}
	}, [value, key]);
	return [value, setValue];
}
