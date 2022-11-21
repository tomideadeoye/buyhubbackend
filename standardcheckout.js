const { Client, Config, StandardCheckout } = require("seerbit-nodejs");
const { SeerBitConfig } = require("../config");
const config = new Config({
	publicKey: SeerBitConfig.PUBLIC_KEY,
	secretKey: SeerBitConfig.SECRET_KEY,
	bearerToken: SeerBitConfig.TOKEN,
});
const client = new Client(config);

const standard = new StandardCheckout(client);
const payload = {
	amount: 100,
	callbackUrl: "www.testapp.com",
	country: "NG",
	currency: "NGN",
	email: "testmerchant@mail.com",
	paymentReference: Date.now(),
};

standard
	.Initialize(payload)
	.then((res) => console.log(res))
	.catch((e) => console.log(e));
