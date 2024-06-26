const express = require("express");
const { SageMakerRuntime } = require("@aws-sdk/client-sagemaker-runtime");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.text({ type: "text/csv" }));
app.use(
	cors({
		origin: "http://localhost:5174", // Specify the origin of the frontend app
	})
);

const region = "us-east-2"; // specify the region
const sagemakerRuntime = new SageMakerRuntime({ region: region });

app.post("/predict-temperature", async (req, res) => {
	const csvData = req.body;

	const params = {
		EndpointName: "canvas-new-deployment-06-06-2024-3-50-PM", // specify the name of the endpoint
		Body: csvData,
		ContentType: "text/csv",
	};

	try {
		const { Body } = await sagemakerRuntime.invokeEndpoint(params);
		const responseBody = Buffer.from(Body).toString("utf-8").trim();
		const [maxTemp, minTemp, avgTemp] = responseBody.split(",");
		if (maxTemp && minTemp && avgTemp) {
			res.json({ maxTemp, minTemp, avgTemp });
		} else {
			throw new Error("Incomplete response from SageMaker endpoint");
		}
	} catch (error) {
		console.error("Error invoking SageMaker endpoint:", error);
		res.status(500).send("Error predicting temperature");
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
