var Customer = require('./customers_api'),
	Admin = require('./admins_api'),
	User = require('./user'),
	CreditCard = require('./credit_card_api'),
	Products = require('./products_api'),
	Supplier = require('./supplier_api')
	Provides = require('./provides_api'),
	Reputation = require('./reputation_api.js'),
	Rates = require('./rates_api'),
	Authentication = require('./authentication'),
	SocialMedia = require('./social_media_api'),
	Management = require('./management'),
	db_utils = require('./db_utils'),
	i18n = require('./i18n');

exports.Customer = Customer;
exports.Admin = Admin;
exports.User = User;
exports.CreditCard = CreditCard;
exports.Products = Products;
exports.Supplier = Supplier;
exports.Reputation = Reputation;
exports.Provides = Provides;
exports.Rates = Rates;
exports.Authentication = Authentication;
exports.Management = Management;
exports.db_utils = db_utils;
exports.i18n = i18n;
exports.SocialMedia = SocialMedia;
