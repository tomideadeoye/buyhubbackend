require("dotenv").config(); // allows us to read the .env file
require("./config/database").connect(); // Connects to database
const express = require("express"); // used to create the server
const bcrypt = require("bcryptjs"); // for hashing passwords
const jwt = require("jsonwebtoken"); // used to create, sign, and verify tokens

const {
	generatePaymentLink,
	createVirtualAccount,
} = require("./generateEncryption");

const {
	userCreator,
	fakeCoordinatesGenerator,
	deleteAll,
	howManyUsers,
} = require("./src/helpers");

const cors = require("cors"); //Newly added
const app = express();

// userCreator();
app.use(cors());
app.use(express.json());
howManyUsers();

const User = require("./model/user"); // importing user context
const auth = require("./middleware/auth");

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

// creating a new user
app.post("/register", async (req, res) => {
	try {
		const { firstName, lastName, email, password } = req.body; // Get user input

		if (!(email && password && firstName && lastName)) {
			res.status(400).send("All input is required");
		} // Validate user input

		if (await User.findOne({ email })) {
			return res.status(409).send("User Already Exist. Please Login");
		} // Check if user already exist

		const user = await User.create({
			first_name: firstName,
			last_name: lastName,
			email: email.toLowerCase(), // sanitize
			password: await bcrypt.hash(password, 10),
		}); // Create user in database

		// Create token
		const token = jwt.sign(
			{ user_id: user._id, email },
			process.env.TOKEN_KEY,
			{
				expiresIn: "5h",
			}
		);

		user.token = token; // save user token

		res.status(201).json(user); // return new user
	} catch (err) {
		console.log(err);
	}
});

app.post("/login", async (req, res) => {
	try {
		const { email, password } = req.body; // Get user input

		// Validate user input
		if (!(email && password)) {
			res.status(400).send("All input is required");
		}

		const user = await User.findOne({ email }); // Validate if user exist in  database

		if (user && (await bcrypt.compare(password, user.password))) {
			// Create token
			const token = jwt.sign(
				{ user_id: user._id, email },
				process.env.TOKEN_KEY,
				{
					expiresIn: "5h",
				}
			);

			user.token = token; // save user token
			return res.status(200).json(user); // user
		}
		return res.status(400).send("Invalid Credentials");
	} catch (err) {
		console.log(err);
	}
});

// returns x-access-token

app.post("/", async (req, res) => {
	const { search, coordinates } = req.body;

	if (search === "") {
		User.find({}, function (err, data) {
			if (!err) {
				res.send({ title: "All available businesses and products", data });
			} else {
				throw err;
			}
		})
			.clone()
			.catch(function (err) {
				console.log(err);
			});
	} else {
		const data = await User.find({
			inventory: { $regex: search, $options: "i" },
		}).exec();
		res.send({ title: `Search results for ${search}`, data });
		console.log(data.length);
	}
});

app.post("/paylink", async (req, res) => {
	const { business_name, item } = req.body;
	const paylink = await generatePaymentLink(business_name, item);
	res.send(paylink);
});

app.get("/virtualAccount", (req, res) => {
	createVirtualAccount();
});

// update users
app.post("/update/:username", async (req, res) => {
	const update = {
		age: req.body.age,
		height: req.body.height,
		weight: req.body.weight,
		gender: req.body.gender,
	};
	const filter = { username: req.params.username };
	const updatedDocument = await User.findOneAndUpdate(filter, update, {
		new: true,
	});

	return res.status(200).send(updatedDocument);
});

module.exports = app;
