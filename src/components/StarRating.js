import { useState } from "react";
import PropTypes from "prop-types";
StarRating.prototype = {
	maxRating: PropTypes.number,
	color: PropTypes.string,
	messages: PropTypes.array,
	onSetRated: PropTypes.func,
};
function StarRating({ maxRating = 10, onSetRated, messages = [] }) {
	const [rating, setRating] = useState(0);
	const [tempRating, setTempRating] = useState(0);

	const handleSelectRating = (selectRating) => {
		setRating(selectRating);
		onSetRated(selectRating);
	};

	const handleHoverMouseIn = (temp) => {
		setTempRating(temp);
	};

	const handleHoverMouseOut = (temp) => {
		setTempRating(0);
	};
	// const textStyle = {
	//   lineHeight: "1",
	//   margin: "0",
	//   color,
	//   fontSize: `${size / 1.5}px`,
	// };

	return (
		<div style={{ display: "flex", gap: "1" }}>
			<div style={{ display: "flex", gap: "0" }}>
				{Array.from({ length: maxRating }, (_, i) => (
					<Star
						onGiveRating={() => handleSelectRating(i + 1)}
						key={i}
						full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
						onMouseIn={() => handleHoverMouseIn(i + 1)}
						onMouseOut={() => handleHoverMouseOut(i + 1)}
					/>
				))}
			</div>
			<span style={{ marginLeft: "10px" }}>
				{messages.length === maxRating
					? messages[tempRating ? tempRating - 1 : rating - 1]
					: tempRating || rating || ""}
			</span>
		</div>
	);
}

function Star({ onGiveRating, full, onMouseIn, onMouseOut }) {
	const starStyle = {
		hight: "30px",
		width: "30px",
		cursor: "pointer",
	};
	return (
		<span
			role='button'
			style={starStyle}
			onClick={onGiveRating}
			onMouseEnter={onMouseIn}
			onMouseLeave={onMouseOut}>
			{!full ? (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					stroke='#000'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth='{2}'
						d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
					/>
				</svg>
			) : (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					fill='#FFFFFF'
					stroke='#000'>
					<path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
				</svg>
			)}
		</span>
	);
}
export default StarRating;
