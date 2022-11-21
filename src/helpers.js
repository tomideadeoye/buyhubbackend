const User = require("../model/user");
const { faker } = require("@faker-js/faker"); // used to generate fake data
const bcrypt = require("bcryptjs"); // for hashing passwords

function fakeProductsGenerator() {
	const productList = [];
	for (let i = 0; i < 100; i++) {
		productList.push(faker.commerce.product());
	}
	console.log(productList);
	return productList;
}

function fakeCoordinatesGenerator() {
	const fakeCoordinates = faker.address.nearbyGPSCoordinate(
		[6.4279314, 3.4921047],
		100,
		true
	);
	console.log(fakeCoordinates);
	return fakeCoordinates;
}
const randomName = faker.name.fullName(); // Rowan Nikolaus
const randomEmail = faker.internet.email(); // Kassandra.Haley@erich.biz
const fakeProduct = faker.commerce.product();

async function userCreator() {
	try {
		const user = {
			first_name: faker.name.firstName(),
			last_name: faker.name.lastName(),
			email: faker.internet.email(),
			password: await bcrypt.hash(faker.internet.password(), 10),
			inventory: fakeProductsGenerator(),
			coordinates: fakeCoordinatesGenerator(),
			business_image: faker.image.business(1234, 2345, true),
			phone_number: faker.phone.number("+234 8# ### ### ##"),
			business_description: faker.lorem.paragraphs(3, "\r"),
		};
		await User.create(user);
		console.log(user);
		return user;
	} catch (err) {
		console.log(err);
	}
}
// for (let i = 0; i < 100; i++) {
// 	userCreator();
// }

// app.post("/updateMany", async (req, res) => {
// 	User.updateMany({}, { $set: { inventory: [] } });
// });

async function deleteAll() {
	try {
		await User.deleteMany({});
		console.log("All users deleted");
		howManyUsers();
	} catch (err) {
		console.log(err);
	}
}

async function howManyUsers() {
	try {
		const users = await User.find({});
		console.log("Number of users is", users.length);
	} catch (err) {
		console.log(err);
	}
}

module.exports = {
	fakeProductsGenerator,
	fakeCoordinatesGenerator,
	userCreator,
	deleteAll,
	howManyUsers,
};
