const axios = require("axios");
const moment = require("moment");
const { faker } = require("@faker-js/faker");

const baseUrl = "https://seerbitapi.com/api/v2";

function generateRandomLetter() {
	const alphabet = "abcdefghijklmnopqrstuvwxyz";

	return alphabet[Math.floor(Math.random() * alphabet.length)];
}
const dynamicgen = generateRandomLetter() + generateRandomLetter();

const privateKey = process.env.PRIVATE_KEY;
const publicKey = process.env.PUBLIC_KEY;

const getEncryptionKey = async () => {
	let headersList = {
		Accept: "*/*",
		"Content-Type": "application/json",
	};

	let bodyContent = JSON.stringify({
		key: "SBTESTSECK_HT8vDc6TYYUsWTQsv6U2gvKe9ueIUaKkNJjKtdrs.SBTESTPUBK_LkveguF5BXLdN5hK27rS1CDiTxmnDYVi",
	});

	let reqOptions = {
		url: "https://seerbitapi.com/api/v2/encrypt/keys",
		method: "GET",
		headers: headersList,
		data: bodyContent,
	};

	let encryptionKey = await axios.request(reqOptions);
	return encryptionKey.data.data.EncryptedSecKey.encryptedKey;
};

const generatePaymentLink = async (business, item) => {
	let encryptionKey = await getEncryptionKey();

	let headersList = {
		Authorization: `Bearer ${encryptionKey}`,
		"Content-Type": "application/json",
	};

	let customizationName = `${business}${dynamicgen}`;
	customizationName = customizationName.replace(/ /g, "");

	let bodyContent = JSON.stringify({
		status: "ACTIVE",
		paymentLinkName: customizationName,
		description: `Pay to ${business} `,
		currency: "NGN",
		successMessage: "Thank you for your payment",
		publicKey: "SBTESTPUBK_LkveguF5BXLdN5hK27rS1CDiTxmnDYVi",
		customizationName: customizationName,
		paymentFrequency: "RECURRENT",
		paymentReference: "",
		email: "js@emaildomain.com",
		requiredFields: {
			address: true,
			amount: true,
			customerName: true,
			mobileNumber: true,
			invoiceNumber: false,
		},
		linkExpirable: false,
		expiryDate: "",
		oneTime: false,
	});

	let reqOptions = {
		url: "https://paymentlink.seerbitapi.com/paymentlink/v2/payLinks/api",
		method: "POST",
		headers: headersList,
		data: bodyContent,
	};

	let response = await axios.request(reqOptions);
	let paymentLink = response.data.data.paymentLinks.paymentLinkUrl;
	console.log(paymentLink);
	return paymentLink;
};

const createVirtualAccount = async () => {
	console.log("createVirtualAccount");
};

module.exports = { generatePaymentLink, createVirtualAccount };
