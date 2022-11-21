const mongoose = require("mongoose");

// Connecting to  DB
exports.connect = () => {
	mongoose
		.connect(process.env.MONGO_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			console.log("DB Connected");
		})
		.catch((error) => {
			console.log("DB connection failed. exiting...");
			console.error(error);
			process.exit(1);
		});
};
