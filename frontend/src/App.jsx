import { useState } from "react";
import "./App.css";

function App() {
	const [date, setDate] = useState("");
	const [temp, setTemp] = useState(null);
	const [loading, setLoading] = useState(false);

	const handleDateChange = (event) => {
		setDate(event.target.value);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		try {
			if (!date) {
				throw new Error("Invalid date input");
			}

			const [year, month, day] = date.split("-");
			const csvData = `${year},${month},${day}`;
			const response = await fetch(
				"http://localhost:3001/predict-temperature",
				{
					method: "POST",
					body: csvData,
					headers: {
						"Content-Type": "text/csv",
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const responseBody = await response.json();
			setTemp({ maxTemp: responseBody.maxTemp });
		} catch (error) {
			console.error("Error fetching temperature:", error);
			setTemp(null);
		}
		setLoading(false);
	};

	return (
		<div className="weather-container">
			<h1 className="title">Predict Temperature in King County</h1>
			<form className="weather-form" onSubmit={handleSubmit}>
				<input
					className="weather-input"
					type="text"
					value={date}
					onChange={handleDateChange}
					placeholder="Enter date (e.g., 2025-01-01)"
				/>
				<button
					className="weather-submit"
					type="submit"
					disabled={loading}
				>
					{loading ? "Loading..." : "Get temperature breakdown"}
				</button>
			</form>

			{temp && (
				<div className="weather-response-card">
					<p>Average Temperature: {temp.avgTemp}F</p>
					<p>Min Temperature: {temp.minTemp}F</p>
					<p>Max Temperature: {temp.maxTemp}F</p>
				</div>
			)}
		</div>
	);
}

export default App;
