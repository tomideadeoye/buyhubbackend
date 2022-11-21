const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	first_name: { type: String, default: null },
	last_name: { type: String, default: null },
	business_name: { type: String, default: null },
	phone_number: { type: String, default: null },
	email: { type: String, unique: true },
	password: { type: String },
	token: { type: String },
	inventory: { type: Array, default: [] },
	coordinates: { type: Array, default: [] },
	last_login: { type: Date, default: null },
	business_image: { type: String, default: null },
	business_description: { type: String, default: null },
});

module.exports = mongoose.model("user", userSchema);
