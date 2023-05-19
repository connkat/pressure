import React, { useEffect, useState } from "react";
// import subDays from "date-fns/esm/fp/subDays/index.js";
import { Meteostat } from "meteostat";

import "./App.css";

import Weather from "./components/Weather";
import Loading from "./components/Loading";

export default function App() {
	const [lat, setLat] = useState([]);
	const [long, setLong] = useState([]);
	const [data, setData] = useState([]);

	const options = {
		params: {
			maxResults: "50",
		},
		headers: {
			"X-RapidAPI-Key": process.env.METEO_API_KEY,
			"X-RapidAPI-Host": "youtube-v31.proce.rapidapi.com",
		},
	};

	const fetchFromAPI = async (url) => {
		const { data } = await axios.get(
			`${process.env.METEO_API_URL}/${url}`,
			options
		);
		return data;
	};

	// let config = {
	// 	params: {
	// 		lat,
	// 		long,
	// 		start: subDays(new Date() - 1),
	// 		end: new Date(),
	// 	},
	// };

	useEffect(() => {
		const fetchData = async () => {
			navigator.geolocation.getCurrentPosition(function (position) {
				setLat(position.coords.latitude);
				setLong(position.coords.longitude);
			});

			const meteostat = new Meteostat(process.env.METEO_API_KEY);

			try {
				const { result } = await meteostat.stations.nearby({
					lat: lat,
					long: long,
				});
				console.log(result);
				setData(result);
			} catch (error) {
				console.log(error);
			}
		};
		fetchData();
	}, [lat, long]);

	return (
		<div className="App">
			{typeof data.main != "undefined" ? (
				// <Weather weatherData={data} />
				{ data }
			) : (
				<Loading />
			)}
		</div>
	);
}
