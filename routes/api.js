var Customer = require('./customers_api'),
	Admin = require('./admins_api'),
	User = require('./user'),
	Categories = require('./categories_api'),
	CreditCard = require('./credit_card_api'),
	Discounts = require('./discounts_api'),
	Products = require('./products_api'),
	Supplier = require('./supplier_api')
	Provides = require('./provides_api'),
	Purchases = require('./purchases_api'),
	PurchaseLines = require('./purchase_lines_api'),
	PurchasingRules = require('./purchasing_rule_api'),
	Reputation = require('./reputation_api.js'),
	Rates = require('./rates_api'),
	Authentication = require('./authentication'),
	SocialMedia = require('./social_media_api'),
	SocialMediaRules = require('./social_media_rules_api'),
	SocialMediaNotifications = require('./notifications_api'),
	RecommenderServer = require('./recommender_server_api'),
	BusinessIntelligence = require('./business_intelligence'),
	db_utils = require('./db_utils'),
	i18n = require('./i18n');

exports.Customer = Customer;
exports.Admin = Admin;
exports.User = User;
exports.Categories = Categories;
exports.CreditCard = CreditCard;
exports.Discounts = Discounts;
exports.Products = Products;
exports.Supplier = Supplier;
exports.Reputation = Reputation;
exports.Provides = Provides;
exports.Purchases = Purchases;
exports.PurchaseLines = PurchaseLines;
exports.PurchasingRules = PurchasingRules;
exports.Rates = Rates;
exports.Authentication = Authentication;
exports.db_utils = db_utils;
exports.i18n = i18n;
exports.SocialMedia = SocialMedia;
exports.SocialMediaRules = SocialMediaRules;
exports.SocialMediaNotifications = SocialMediaNotifications;
exports.RecommenderServer = RecommenderServer;
exports.BusinessIntelligence = BusinessIntelligence;